import { ObjectId } from "mongodb";
import { Projects, Users } from "../../../../models";
import {
    ProjectsModelInterface,
    UsersModelInterface,
    ProjectCredentials
} from "../../../../types";
import {
    checkUserIsAlreadyCollaborator,
    createNonRegisteredCollaborators,
    projectDbUpdate,
    sendCollaboratorsInviteEmails,
    collaboratorsHaveRegisteredUsers
} from "./helpers";

import { error } from "../../..";
import { registerController } from "controller";

export const archiveProject = async (
    requestProps: { isArchived: boolean },
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        isArchived: requestProps.isArchived
    } as ProjectsModelInterface;

    // updatedProject = await projectDbUpdate({
    //     project: Projects,
    //     projectId,
    //     projectUpdateValues: ownerProject
    // });
    return;
};

export const deleteProject = async (
    requestProps: { isDeleted: boolean },
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    const { isDeleted: deleted } = ownerProject;
    if (deleted) {
        throw error(422, "Project already deleted", "Project delete");
    }
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        isDeleted: requestProps.isDeleted
    } as ProjectsModelInterface;

    // updatedProject = await projectDbUpdate({
    //     project: Projects,
    //     projectId,
    //     projectUpdateValues: ownerProject
    // });
    return;
};

export const addCollaborators = async (
    requestProps: { collaboratorsEmails: string[] },
    projectId: string,
    ownerProject: ProjectCredentials,
    owner: string
): Promise<any> => {
    let updatedProject;
    // TODO: check number of collaborator emails should not exceed 5;
    // TODO: list out all actions to be performed by add collaborator method
    // TODO: list out all error scenarios and their corresponding actions
    const { collaboratorsEmails } = requestProps;
    const ownerDetail = (await Users.findById(owner)) as UsersModelInterface;

    // Collaborator emails should not contain owners of the project.
    if (collaboratorsEmails.includes(ownerDetail.email as string)) {
        throw error(422, "Owner cannot be a collaborator", "Project update");
    }

    // TODO: extract all constants to a file
    // find collaborators that are already registered.
    let registeredCollaborators = (await Users.find({
        email: { $in: collaboratorsEmails }
    })) as UsersModelInterface[];

    let registeredCollaboratorsIds = registeredCollaborators.map(
        collaborator => {
            return collaborator.id;
        }
    ) as any[];

    let newlyCreatedUsersByInvite = [] as any[];

    const rC = collaboratorsHaveRegisteredUsers;

    // if non of the collaborators are already registered/activated
    // create all of them as users
    if (!registeredCollaborators) {
        newlyCreatedUsersByInvite = collaboratorsHaveRegisteredUsers.false({
            collaboratorsEmails,
            users: Users
        }) as UsersModelInterface[];
    }

    // if some of the collaborators are already registered
    // separate users already created from user not created
    // create users for collaborators that are not yet registered
    if (
        registeredCollaborators &&
        registeredCollaborators.length < collaboratorsEmails.length
    ) {
        newlyCreatedUsersByInvite = collaboratorsHaveRegisteredUsers.true({
            collaboratorsEmails,
            users: Users,
            registeredCollaborators
        }) as UsersModelInterface[];

        newlyCreatedUsersByInvite = newlyCreatedUsersByInvite.concat(
            registeredCollaborators
        );
    }

    // If all collaborator emails are registered members
    if (
        registeredCollaborators &&
        registeredCollaborators.length === collaboratorsEmails.length
    ) {
        newlyCreatedUsersByInvite = registeredCollaborators;
    }

    const newlyCreatedUsersIds = newlyCreatedUsersByInvite.map(user => {
        return user.id;
    }) as any[];
    let collaboratorsIds = registeredCollaboratorsIds.concat(
        newlyCreatedUsersIds
    );
    // check if any user is already a collaborator. if true throw error
    const isAlreadyACollaborator = checkUserIsAlreadyCollaborator(
        ownerProject.collaborators as any[],
        newlyCreatedUsersByInvite
    );
    // In a list of collaborators, if any one is already a collaborator throw an error.
    if (isAlreadyACollaborator) {
        throw error(
            422,
            `${isAlreadyACollaborator.name} already collaborators`,
            "Project update"
        );
    }
    collaboratorsIds = [
        ...(ownerProject.collaborators as string[]),
        ...collaboratorsIds
    ];
    ownerProject = {
        ...ownerProject,
        collaborators: collaboratorsIds
    } as ProjectsModelInterface;

    if (!newlyCreatedUsersByInvite) {
        registeredCollaboratorsIds = [
            ...(ownerProject.collaborators as string[]),
            ...registeredCollaboratorsIds
        ];
        ownerProject = {
            ...ownerProject,
            collaborators: registeredCollaboratorsIds
        } as ProjectCredentials;
    }

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId: projectId,
        ownerId: owner,
        projectUpdateValues: ownerProject
    });

    sendCollaboratorsInviteEmails(ownerDetail, collaboratorsEmails as string[]);
    return updatedProject;
};
