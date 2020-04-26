import { ObjectId } from "mongodb";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";
import {
    confirmExistingCollaborators,
    createNonExistingUsers,
    projectDbUpdate,
    sendCollaboratorsInviteEmails
} from "./helpers";

import { error } from "../../..";

export const editDescription = async (
    description: string,
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        description
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};

export const editTitle = async (
    title: string,
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        title
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};

export const setFavourite = async (
    isFavourite: boolean,
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        isFavourite
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};

export const archiveProject = async (
    isArchived: boolean,
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        isArchived
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};

export const deleteProject = async (
    isDeleted: boolean,
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
        isDeleted
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};

export const addCollaborators = async (
    collaboratorEmails: string[],
    projectId: string,
    ownerProject: ProjectsModelInterface,
    owner: ObjectId
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
                "Some users are already collaborators",
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

        // updatedProject = await projectDbUpdate({
        //     project: Projects,
        //     projectId,
        //     projectUpdateValues: ownerProject
        // });
        // sendCollaboratorsInviteEmails(
        //     ownerDetail,
        //     collaboratorEmails as string[]
        // );
        // return updatedProject;
    }

    if (!newlyCreatedUsers) {
        registeredCollaboratorsIds = [
            ...(ownerProject.collaborators as ObjectId[]),
            ...registeredCollaboratorsIds
        ];
        ownerProject = {
            ...ownerProject,
            collaborators: registeredCollaboratorsIds
        } as ProjectsModelInterface;
    }

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    sendCollaboratorsInviteEmails(ownerDetail, collaboratorEmails as string[]);
    return updatedProject;
};
