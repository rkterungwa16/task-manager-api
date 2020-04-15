import { ObjectId, ObjectID } from "mongodb";
import { Document, Model } from "mongoose";

import { CustomError, EmailDetailsInterface, error, signJwt } from "../../..";
import { baseUrl, projectProperties, Visibility } from "../../../../constants";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";
import { sendMail } from "../../../email";
import { projectDbUpdate, ProjectDbUpdateInterface } from "./helpers";

export interface MessageHtmlContentParameterInterface {
    name: string;
    linkBaseUrl: string;
    token: string;
}

const emailMessageHtmlContent = (
    htmlDetails: MessageHtmlContentParameterInterface
): string => {
    const { name, linkBaseUrl, token } = htmlDetails;
    return `
    <h3>${name} just added you to ${name} project in Task Manager</h3>
    Click on this link to login with your password and continue.
    <a href='${linkBaseUrl}collaborator-invite/${token}'>Login</a>
    `;
};

const sendCollaboratorsInviteEmails = async (
    ownerDetails: UsersModelInterface,
    collaboratorsEmail: string[]
): Promise<boolean> => {
    let emailSent = [] as Array<Promise<any>>;

    for (const email of collaboratorsEmail) {
        const token = await signJwt({ email }, "1h");
        const messageHtmlContent = emailMessageHtmlContent({
            name: ownerDetails.name as string,
            linkBaseUrl: baseUrl,
            token
        });
        const messageSubject = "Task Manager Project Collaboration invite";

        emailSent = emailSent.concat([
            sendMail({
                senderEmail: ownerDetails.email as string,
                recieverEmail: email,
                recieverName: "",
                messageHtmlContent,
                messageSubject
            })
        ]);
    }
    await Promise.all(emailSent);
    return true;
};

const createNonExistingUsers = async (
    collaboratorsEmails: string[],
    user: Model<Document>,
    registeredCollaborators: UsersModelInterface[] = []
): Promise<boolean | UsersModelInterface[]> => {
    try {
        let nonRegisteredCollaborators;
        if (registeredCollaborators.length) {
            nonRegisteredCollaborators = collaboratorsEmails.filter(
                collaborator => {
                    const collaboratorIsRegistered = registeredCollaborators.find(
                        userCollaborator => {
                            const email = userCollaborator.email as string;
                            return email === collaborator;
                        }
                    );
                    return !collaboratorIsRegistered;
                }
            ) as any[];

            nonRegisteredCollaborators = nonRegisteredCollaborators.map(
                email => {
                    return {
                        email,
                        collaborationInviteStatus: "pending"
                    };
                }
            ) as Array<{
                email: string;
                collaborationInviteStatus: string;
            }>;

            return await user.create(nonRegisteredCollaborators);
        }

        if (!registeredCollaborators.length) {
            nonRegisteredCollaborators = collaboratorsEmails.map(email => {
                return {
                    email,
                    collaborationInviteStatus: "pending"
                };
            }) as Array<{
                email: string;
                collaborationInviteStatus: string;
            }>;

            return await user.create(nonRegisteredCollaborators);
        }

        return false;
    } catch (err) {
        throw error(500, "Could not create users", "Project");
    }
};

const confirmExistingCollaborators = (
    projectCollaboratorIds: ObjectId[],
    invitedCollaboratorIds: ObjectId[]
): boolean => {
    return invitedCollaboratorIds.every(invitedCollaborator => {
        return projectCollaboratorIds.includes(invitedCollaborator);
    });
};

export const addCollaborators = async (
    collaboratorEmails: string[],
    projectId: string,
    owner: ObjectId,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    // TODO: check number of collaborator emails should not exceed 5;
    // TODO: list out all actions to be performed by add collaborator method
    // TODO: list out all error scenarios and their corresponding actions
    const ownerDetail = (await Users.findById(owner)) as UsersModelInterface;

    if (collaboratorEmails.includes(ownerDetail.email as string)) {
        throw error(422, "Owner cannot be a collaborator", "Project update");
    }

    let registeredCollaborators = (await Users.find({
        email: { $in: collaboratorEmails }
    })) as UsersModelInterface[];

    let registeredCollaboratorsIds = registeredCollaborators.map(
        collaborator => {
            return collaborator.id;
        }
    ) as ObjectId[];

    let newlyCreatedUsers;

    // if non of the collaborators are already registered
    // create all of them as users
    if (!registeredCollaborators) {
        newlyCreatedUsers = (await createNonExistingUsers(
            collaboratorEmails,
            Users
        )) as UsersModelInterface[];
    }

    // if some of the collaborators are already registered
    // create users for collaborators that are not yet registered
    if (registeredCollaborators.length < collaboratorEmails.length) {
        newlyCreatedUsers = (await createNonExistingUsers(
            collaboratorEmails,
            Users,
            registeredCollaborators
        )) as UsersModelInterface[];
    }

    // update project collaborators for newly created users
    if (newlyCreatedUsers) {
        registeredCollaborators = registeredCollaborators.concat(
            newlyCreatedUsers
        );
        const newlyCreatedUsersIds = newlyCreatedUsers.map(user => {
            return user.id;
        }) as ObjectId[];
        let collaboratorsIds = registeredCollaboratorsIds.concat(
            newlyCreatedUsersIds
        );
        // check if any user is already a collaborator. if true throw error
        const hasExistingCollaborators = confirmExistingCollaborators(
            ownerProject.collaborators as ObjectId[],
            collaboratorsIds
        );
        if (hasExistingCollaborators) {
            throw error(
                422,
                "Some users already collaborators",
                "Project update"
            );
        }
        collaboratorsIds = [
            ...(ownerProject.collaborators as ObjectId[]),
            ...collaboratorsIds
        ];
        ownerProject = {
            ...ownerProject,
            collaborators: collaboratorsIds
        } as ProjectsModelInterface;

        updatedProject = await projectDbUpdate({
            project: Projects,
            projectId,
            projectUpdateValues: ownerProject
        });
        sendCollaboratorsInviteEmails(
            ownerDetail,
            collaboratorEmails as string[]
        );
        return updatedProject;
    }

    registeredCollaboratorsIds = [
        ...(ownerProject.collaborators as ObjectId[]),
        ...registeredCollaboratorsIds
    ];
    ownerProject = {
        ...ownerProject,
        collaborators: registeredCollaboratorsIds
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    sendCollaboratorsInviteEmails(ownerDetail, collaboratorEmails as string[]);
    return updatedProject;
};
