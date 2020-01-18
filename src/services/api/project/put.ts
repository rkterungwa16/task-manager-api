import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { CustomError, EmailDetailsInterface, error, signJwt } from "../..";
import { baseUrl } from "../../../constants";
import { Projects, Users } from "../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../types";
import { sendMail } from "../../email";

export interface UserAsCollaboratorParameterInterface {
    owner: string | ObjectId;
    projectId: string | ObjectId;
    collaboratorEmail: string;
}

export interface CollaboratorParameterInterface {
    project: Model<Document>;
    userAsCollaboratorError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
}

export interface AddUserAsCollaboratorParameterInterface extends
    CollaboratorParameterInterface {
    user: Model<Document>;
    signToken: (
        tokenDetail: any,
        expiryDuration: string | number
    ) => Promise<string>;
    sendEmail: (emailDetails: EmailDetailsInterface) => Promise<any>;
    getHtmlContent: (
        htmlDetails: MessageHtmlContentParameterInterface
    ) => string;
}
export interface MessageHtmlContentParameterInterface {
    name: string;
    linkBaseUrl: string;
    token: string;
}
export const emailMessageHtmlContent = (
    htmlDetails: MessageHtmlContentParameterInterface
): string => {
    const { name, linkBaseUrl, token } = htmlDetails;
    return `
    <h3>${name} just added you to ${name} project in Task Manager</h3>
    Click on this link to login with your password and continue.
    <a href='${linkBaseUrl}collaborator-invite/${token}'>Login</a>
    `;
};

export const addUserAsCollaboratorDefinition = (
    addUserAsCollaboratorArgs: AddUserAsCollaboratorParameterInterface
): ((
    userCollaboratorArgs: UserAsCollaboratorParameterInterface
) => Promise<Document>) => {
    return async ({ owner, projectId, collaboratorEmail }) => {
        // Check if collaborator exist on the platform if not return error.
        // user collaborator email. send email to collaborator after creating the collaborator.
        // send notification to collaborators board.
        const {
            project,
            user,
            userAsCollaboratorError: addUserAsCollaboratorError,
            signToken,
            sendEmail,
            getHtmlContent
        } = addUserAsCollaboratorArgs;

        const ownerDetail = (await user.findById(owner)) as UsersModelInterface;
        // create function that returns owner project (project);
        const ownerProject = (await project.findOne({
            owner,
            _id: projectId
        })) as ProjectsModelInterface;

        if (ownerDetail.email === collaboratorEmail) {
            throw addUserAsCollaboratorError(
                400,
                "Owner cannot be collaborator",
                "Add User to Project"
            );
        }
        if (!ownerProject) {
            throw addUserAsCollaboratorError(
                400,
                "Project does not exist",
                "Add user To Project"
            );
        }

        // Create function that returns collaborator
        let collaborator = (await user.findOne({
            email: collaboratorEmail
        })) as UsersModelInterface;
        if (!collaborator) {
            collaborator = (await user.create({
                email: collaboratorEmail,
                collaborationInviteStatus: "pending"
            })) as UsersModelInterface;

            const token = await signToken(
                {
                    email: collaboratorEmail,
                    id: collaborator.id,
                    name: collaborator.name
                },
                "1h"
            );
            const messageHtmlContent = getHtmlContent({
                name: ownerProject.name,
                linkBaseUrl: baseUrl,
                token
            });

            // TODO: Option to decline invite.
            // Experiment with event emitters for sending emails (Good or Bad idea?)
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
        return (await project
            .findByIdAndUpdate(
                projectId,
                { $set: { collaborators } },
                { new: true }
            )
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as ProjectsModelInterface;
    };
};

export const addUserAsCollaborator = addUserAsCollaboratorDefinition({
    project: Projects,
    user: Users,
    userAsCollaboratorError: error,
    sendEmail: sendMail,
    signToken: signJwt,
    getHtmlContent: emailMessageHtmlContent
});
