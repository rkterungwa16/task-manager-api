import { Projects, Users, CollaboratorInvites } from "../../../../models";
import {
    ProjectsModelInterface,
    UsersModelInterface,
    ProjectCredentials
} from "../../../../types";
import {
    checkUserIsAlreadyCollaborator,
    projectDbUpdate,
    sendCollaboratorsInviteEmails,
    collaboratorsHaveRegisteredUsers
} from "./helpers";

import { error } from "../../..";

export const addCollaborators = async (
    requestProps: { collaboratorsEmails: string[] },
    projectId: string,
    owner: string
): Promise<any> => {
    let updatedProject;
    // TODO: check number of collaborator emails should not exceed 5;
    // TODO: list out all actions to be performed by add collaborator method
    // TODO: list out all error scenarios and their corresponding actions
    const { collaboratorsEmails } = requestProps;
    const project = (await Projects
        .findOne({
            _id: projectId,
            owner
        })
        .populate("collaborators", "-password -salt")
        .exec()
    ) as ProjectsModelInterface;
    let ownerProject = project.toObject() as ProjectCredentials;
    // Collaborator emails should not contain owners of the project.
    if (!ownerProject) {
        throw error(400, "Project does not exist", "Project update");
    }
    const ownerDetail = project.owner as any;
    if (collaboratorsEmails.includes(ownerDetail.email as string)) {
        throw error(422, "Owner cannot be a collaborator", "Project update");
    }

    // TODO: extract all constants to a file
    // find collaborators that are already registered.
    let registeredCollaborators = (await Users.find({
        email: { $in: collaboratorsEmails }
    })) as UsersModelInterface[];

    let newlyCreatedUsersByInvite = [] as any[];

    // if non of the collaborators are already registered/activated
    // create all of them as users
    if (!registeredCollaborators) {
        newlyCreatedUsersByInvite = collaboratorsHaveRegisteredUsers.false({
            collaboratorsEmails,
            users: Users
        }) as UsersModelInterface[];
    }

    // NOTE: collaboratorsEmails contains both created and non created users
    // Separate created and non created users
    // collaborators = RegisteredCollaborators + NonRegisteredCollaborators

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

    let newlyCreatedUsersIds = newlyCreatedUsersByInvite.map(user => {
        return user.id;
    }) as any[];


    // check if any user is already a collaborator. if true throw error
    const isAlreadyACollaborator = checkUserIsAlreadyCollaborator(
        ownerProject.collaborators as any[],
        newlyCreatedUsersByInvite
    );
    // In a list of collaborators, if any one is already a collaborator throw an error.
    if (isAlreadyACollaborator) {
        throw error(
            422,
            `${isAlreadyACollaborator.name} already a collaborator`,
            "Project update"
        );
    }

    newlyCreatedUsersIds = [
        ...(ownerProject.collaborators as string[]),
        ...newlyCreatedUsersIds
    ];

    const collaboratorInvitesDetails = newlyCreatedUsersIds.map((userId) => {
        return {
            collaborator: userId,
            project: projectId,
            status: "pending"
        }
    });

    ownerProject = {
        ...ownerProject,
        collaborators: newlyCreatedUsersIds
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId: projectId,
        ownerId: owner,
        projectUpdateValues: ownerProject
    });

    // TODO: Write method that implements the collaborator invites inserts
    // TODO: Should be able to create notification to all the users that are registered/activated
    // TODO: Implement a cron that checks users that are activated and have pending invites.
    // NOTE: notification types "invites, task created, task edited"
    // NOTE: make email part of the notification (email, inapp)
    CollaboratorInvites.insertMany(collaboratorInvitesDetails);

    // sendCollaboratorsInviteEmails(ownerDetail, collaboratorsEmails as string[]);
    return updatedProject;
};
