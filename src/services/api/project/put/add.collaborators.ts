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
    const project = (await Projects.findOne({
        _id: projectId,
        owner
    })
        .populate("owner", "-password -salt")
        .populate({
            path: "invites",
            populate: [
                {
                    path: "owner",
                    model: "Users",
                    select: "-password -salt"
                },
                {
                    path: "collaborator",
                    model: "Users",
                    select: "-password -salt"
                },
                {
                    path: "project",
                    model: "Projects"
                }
            ]
        })
        .exec()) as ProjectsModelInterface;
    let ownerProject;

    // Collaborator emails should not contain owners of the project.
    if (!project) {
        throw error(400, "Project does not exist", "Project update");
    }
    ownerProject = project.toObject() as ProjectCredentials;
    const ownerDetail = project.owner as any;
    if (collaboratorsEmails.includes(ownerDetail.email as string)) {
        throw error(422, "Owner cannot be a collaborator", "Project update");
    }

    // TODO: extract all constants to a file
    // find collaborators that are already registered.
    let registeredCollaborators = (await Users.find({
        email: { $in: collaboratorsEmails }
    })) as UsersModelInterface[];

    let newlyCreatedUsersById = [] as any[];
    // if non of the collaborators are already registered/activated
    // create all of them as users
    if (!registeredCollaborators.length) {
        newlyCreatedUsersById = (await collaboratorsHaveRegisteredUsers.false({
            collaboratorsEmails,
            users: Users
        })) as UsersModelInterface[];
    }

    // NOTE: collaboratorsEmails contains both created and non created users
    // Separate created and non created users
    // collaborators = RegisteredCollaborators + NonRegisteredCollaborators

    // if some of the collaborators are already registered
    // separate users already created from user not created
    // create users for collaborators that are not yet registered
    if (
        registeredCollaborators.length &&
        registeredCollaborators.length < collaboratorsEmails.length
    ) {
        newlyCreatedUsersById = (await collaboratorsHaveRegisteredUsers.true({
            collaboratorsEmails,
            users: Users,
            registeredCollaborators
        })) as UsersModelInterface[];

        newlyCreatedUsersById = newlyCreatedUsersById.concat(
            registeredCollaborators
        );
    }

    // If all collaborator emails are registered members
    if (
        registeredCollaborators.length &&
        registeredCollaborators.length === collaboratorsEmails.length
    ) {
        newlyCreatedUsersById = registeredCollaborators;
    }

    let usersInvites = newlyCreatedUsersById.map(user => {
        return {
            collaborator: user.id,
            owner,
            project: projectId,
            status: "pending"
        };
    }) as any[];

    // check if any user is already a collaborator and has an invite. if true throw error

    const isAlreadyACollaborator = checkUserIsAlreadyCollaborator(
        ownerProject.invites as any[],
        newlyCreatedUsersById
    );
    // In a list of collaborators, if any one is already a collaborator throw an error.
    if (isAlreadyACollaborator) {
        throw error(
            422,
            `${isAlreadyACollaborator.name} already a collaborator`,
            "Project update"
        );
    }

    usersInvites = [...(ownerProject.invites as string[]), ...usersInvites];

    const invites = await CollaboratorInvites.insertMany(usersInvites);
    const invitesIds = invites.map(invite => {
        return invite._id;
    }) as string[];

    sendCollaboratorsInviteEmails(ownerDetail, collaboratorsEmails as string[]);

    ownerProject = {
        ...ownerProject,
        invites: invitesIds
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

    return updatedProject;
};
