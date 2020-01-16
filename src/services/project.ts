import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { baseUrl } from "../constants";
import { Projects, Users } from "../models";
import { listOfUserAsOwnerAndColloaboratorProjects } from "../query";
import { ProjectsModelInterface, UsersModelInterface } from "../types";
import {
    CustomError,
    EmailDetailsInterface,
    error,
    findUserByEmail,
    sendMailDefinition,
    signJwt
} from "./";
import { sendMail } from "./email";

export interface CreateProjectParameterInterface {
    project: Model<Document>;
}

export const createProjectDefinition = (
    createProjectsArgs: CreateProjectParameterInterface
): ((credentials: ProjectsModelInterface) => Promise<Document>) => {
    const { project } = createProjectsArgs;
    return async (credentials: ProjectsModelInterface) => {
        return await project.create(credentials);
    };
};

export const createProject = createProjectDefinition({ project: Projects });

export const viewOwnerProjectsDefinition = (
    projects: Model<Document>
): ((owner: ObjectId) => Promise<Document[]>) => {
    return async owner => {
        return await projects.aggregate(
            listOfUserAsOwnerAndColloaboratorProjects(owner)
        );
    };
};

export const viewOwnerProjects = viewOwnerProjectsDefinition(Projects);

export const viewSingleOwnerProjectDefinition = (
    projects: Model<Document>
): ((owner: ObjectId, projectId: string) => Promise<Document>) => {
    // TODO: return error message for non existent project
    return async (owner, projectId) => {
        return (await projects
            .findOne({
                _id: projectId,
                owner
            })
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as Document;
    };
};

export const viewSingleOwnerProject = viewSingleOwnerProjectDefinition(
    Projects,
);

export interface UserAsCollaboratorParameterInterface {
    owner: string | ObjectId;
    projectId: string | ObjectId;
    collaboratorEmail: string;
}

export interface AddUserAsCollaboratorParameterInterface {
    project: Model<Document>;
    user: Model<Document>;
    addUserAsCollaboratorError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
    signToken: (
        email: string,
        id: string | ObjectId,
        expiryDuration: string | number
    ) => Promise<string>;
    sendEmail: (emailDetails: EmailDetailsInterface) => Promise<any>;
}

export const addUserAsCollaboratorDefinition = (
    addUserAsCollaboratorArgs: AddUserAsCollaboratorParameterInterface
): ((userCollaboratorArgs: UserAsCollaboratorParameterInterface) => Promise<Document>) => {
    return async ({
        owner,
        projectId,
        collaboratorEmail
    }) => {
        // Check if collaborator exist on the platform if not return error.
        // user collaborator email. send email to collaborator after creating the collaborator.
        // send notification to collaborators board.
        const {
            project,
            user,
            addUserAsCollaboratorError,
            signToken,
            sendEmail
        } = addUserAsCollaboratorArgs;

        const ownerDetail = await user.findById(owner) as UsersModelInterface;
        const ownerProject = await project.findOne({
            owner,
            _id: projectId
        }) as ProjectsModelInterface;

        if (ownerDetail.email === collaboratorEmail) {
            throw addUserAsCollaboratorError(
                400,
                "Owner cannot be collaborator",
                "Add User to Project"
            )
        }
        if (!ownerProject) {
            throw addUserAsCollaboratorError(
                400,
                "Project does not exist",
                "Add user To Project"
            );
        }

        let collaborator = await user.findOne({
            email: collaboratorEmail
        }) as UsersModelInterface;
        if (!collaborator) {
            collaborator = await user.create({
                email: collaboratorEmail,
                collaborationInviteStatus: "pending"
            }) as UsersModelInterface;

            const token = await signToken(collaboratorEmail, collaborator.id, "1h");
            const messageHtmlContent = `
          <h3>${ownerDetail.name} just added you to ${ownerProject.name} project in Task Manager</h3>
          Click on this link to login with your password and continue.
          <a href='${baseUrl}collaborator-invite/${token}'>Login</a>
          `;

            // TODO: Option to decline invite.

            const messageSubject = "Task Manager Project Collaboration invite";
            await sendEmail({
                senderEmail: ownerDetail.email,
                recieverEmail: collaboratorEmail,
                recieverName: "",
                messageHtmlContent,
                messageSubject
            });
        }

        // Must not add self ass collaborator.
        // Check if user is already a collaborator
        let collaborators = ownerProject.collaborators as ObjectId[];
        const isCollaborator = collaborators.includes(collaborator.id);
        if (isCollaborator) {
            throw addUserAsCollaboratorError(
                400,
                "User is already a collaborator",
                "Project Collaborator"
            );
        }

        collaborators = [...collaborators, collaborator.id];
        return await project.findByIdAndUpdate(
            projectId,
            { $set:{ collaborators } },
            { new: true }
        )
        .populate("owner", "-password -salt")
        .populate("collaborators", "-password -salt")
        .exec() as ProjectsModelInterface;
    }
}

export const addUserAsCollaborator = addUserAsCollaboratorDefinition({
    project: Projects,
    user: Users,
    addUserAsCollaboratorError: error,
    sendEmail: sendMail,
    signToken: signJwt
});
