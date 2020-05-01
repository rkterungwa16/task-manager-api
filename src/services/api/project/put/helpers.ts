import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { baseUrl } from "../../../../constants";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";

import { error, signJwt } from "../../..";
import { sendMail } from "../../../email";

export interface ProjectDbUpdateInterface {
    projectId: string;
    projectUpdateValues: ProjectsModelInterface;
    project: Model<Document>;
}

export const projectDbUpdate = async (
    projectUpdateDetails: ProjectDbUpdateInterface
): Promise<ProjectsModelInterface> => {
    try {
        const {
            projectId,
            project,
            projectUpdateValues
        } = projectUpdateDetails;
        const updatedProject = (await project
            .findByIdAndUpdate(
                projectId,
                {
                    $set: projectUpdateValues
                },
                { new: true }
            )
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as ProjectsModelInterface;
        return updatedProject;
    } catch (err) {
        throw error(500, "Could not update project", "Project");
    }
};

export const projectExists = async (
    owner: ObjectId,
    projectId: string,
    project: Model<Document>
): Promise<ProjectsModelInterface> => {
    try {
        const userProject = (await project
            .findOne({
                owner,
                _id: projectId
            })
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as ProjectsModelInterface;
        if (!userProject) {
            throw error(400, "Project does not exist", "Add user To Project");
        }
        return userProject.toObject();
    } catch (err) {
        throw error(400, "Project does not exist", "Add user To Project");
    }
};

export const hasValidProjectProperties = (
    projectRequestDetails: { [x: string]: string },
    projectProps: Array<{ [x: string]: string }>,
    projectUpdateProp: string
): boolean => {
    // check if request properties are amongst valid project project property
    // make sure prop types are valid
    const projectReqProps = Object.keys(projectRequestDetails);
    for (const requestedProp of projectReqProps) {
        const hasExpectedProp = projectProps.find(expectedProp => {
            return expectedProp.label === requestedProp;
        });
        if (!hasExpectedProp) {
            throw error(422, "Use valid project properties", "Project Update");
        }
    }

    // confirm if particular project property to be updated is in the request object.
    if (!projectReqProps.includes(projectUpdateProp)) {
        throw error(422, `${projectUpdateProp} is required`, "Project Update");
    }

    return true;
};

// ==================================================================================
// COLLABORATOR HELPERS
// ==================================================================================
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

export const sendCollaboratorsInviteEmails = async (
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

export const createNonExistingUsers = async (
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

export const confirmExistingCollaborators = (
    projectCollaboratorIds: ObjectId[],
    invitedCollaboratorIds: ObjectId[]
): boolean => {
    return invitedCollaboratorIds.every(invitedCollaborator => {
        return projectCollaboratorIds.includes(invitedCollaborator);
    });
};
