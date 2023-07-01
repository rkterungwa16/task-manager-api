import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { baseUrl } from "../../../../constants";
import {
  ProjectsModelInterface,
  UsersModelInterface,
  ProjectCredentials,
  CollaboratorInvitesModelInterface
} from "../../../../types";

import { error, signJwt } from "../../..";
import { sendMail } from "../../../email";
export interface ProjectDbUpdateInterface {
  projectId: string;
  ownerId: string;
  projectUpdateValues: ProjectCredentials;
  project: Model<Document>;
}

export const projectDbUpdate = async (
  projectUpdateDetails: ProjectDbUpdateInterface
): Promise<ProjectsModelInterface> => {
  try {
    const {
      ownerId,
      projectId,
      project,
      projectUpdateValues
    } = projectUpdateDetails;

    const updatedProject = (await project
      .findOneAndUpdate(
        {
          _id: projectId,
          owner: ownerId
        },
        { $set: projectUpdateValues },
        { new: true }
      )
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

// export const hasValidProjectProperties = (
//     projectRequestDetails: { [x: string]: string },
//     projectProps: Array<{ [x: string]: string }>,
//     projectUpdateProp: string | string[]
// ): boolean => {
//     // check if request properties are amongst valid project project property
//     // make sure prop types are valid
//     const projectReqProps = Object.keys(projectRequestDetails);
//     for (const requestedProp of projectReqProps) {
//         const hasExpectedProp = projectProps.find(expectedProp => {
//             return expectedProp.label === requestedProp;
//         });
//         if (!hasExpectedProp) {
//             throw error(422, "Use valid project properties", "Project Update");
//         }
//     }

//     if (typeof projectUpdateProp === "string") {
//         // confirm if particular project property to be updated is in the request object.
//         if (!projectReqProps.includes(projectUpdateProp)) {
//             throw error(
//                 422,
//                 `${projectUpdateProp} is required`,
//                 "Project Update"
//             );
//         }
//     }

//     if (Array.isArray(projectUpdateProp)) {
//         // make sure all the required properties to be updated are in the request object
//         // all request object properties must be contained in the project update properties.
//         const hasRequiredProps = projectReqProps.every(prop => {
//             if (projectUpdateProp.includes(prop)) return true;
//             return false;
//         });

//         if (!hasRequiredProps) {
//             throw error(422, "missing update properties", "Project Update");
//         }
//     }

//     return true;
// };

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

export const collaboratorsHaveRegisteredUsers = {
  /**
   * Create users that don't already exist on the platform but have an invite.
   * This method handles the scenario where some members are registered while others are not
   * filter out collaborators that are not yet registered and create them with collaborator invite as pending
   * @param collaboratorsEmails list of emails to be added as collaborators
   * @param user user database model
   * @param registeredCollaborators list of collaborators that are already registered
   */
  true: async (args: {
    collaboratorsEmails: string[];
    registeredCollaborators: UsersModelInterface[];
    users: Model<Document>;
  }): Promise<UsersModelInterface[]> => {
    const nonRegisteredCollaborators = args.collaboratorsEmails
      .filter(collaborator => {
        const registeredCollaborator = args.registeredCollaborators.find(
          userCollaborator => {
            const email = userCollaborator.email as string;
            return email === collaborator;
          }
        );
        return !registeredCollaborator;
      })
      .map(email => {
        return {
          email
        };
      }) as Array<{
      email: string;
    }>;

    return (await args.users.create(nonRegisteredCollaborators)) as any;
  },
  /**
   * Create users that don't already exist on the platform but have an invite.
   * This method handles the scenario where all of the invited collaborators are not registered members
   * @param collaboratorsEmails list of emails to be added as collaborators
   * @param user user database model
   * @param registeredCollaborators list of collaborators that are already registered
   */
  false: async (args: {
    collaboratorsEmails: string[];
    users: Model<Document>;
  }): Promise<UsersModelInterface[]> => {
    const nonRegisteredCollaborators = args.collaboratorsEmails.map(email => {
      return {
        email
      };
    }) as Array<{
      email: string;
    }>;

    return (await args.users.create(nonRegisteredCollaborators)) as any;
  }
} as {
  [x: string]: any;
};

/**
 * Create users that don't already exist on the platform but have an invite.
 * @param collaboratorsEmails list of emails to be added as collaborators
 * @param user user database model
 * @param registeredCollaborators list of collaborators that are already registered
 */
export const createNonRegisteredCollaborators = async (
  collaboratorsEmails: string[],
  user: Model<Document>,
  registeredCollaborators: UsersModelInterface[] = []
): Promise<UsersModelInterface[]> => {
  try {
    return await collaboratorsHaveRegisteredUsers[
      `${Boolean(registeredCollaborators.length)}`
    ]({
      collaboratorsEmails,
      user,
      registeredCollaborators
    });
  } catch (err) {
    throw error(500, "Could not create users", "Project");
  }
};

/**
 * Scan through the current invites in the project
 * Make sure a user is already not on the invite (user should not be invited twice)
 * @param currentProjectInvites
 * @param invitedCollaborators
 */
export const checkUserIsAlreadyCollaborator = (
  currentProjectInvites: any[],
  invitedCollaborators: UsersModelInterface[]
): UsersModelInterface => {
  // for each invited collaborator, if they already exists in the project collaborator return their details
  return invitedCollaborators.find(invitedCollaborator => {
    return currentProjectInvites.some(invite => {
      if (String(invitedCollaborator._id) === String(invite.collaborator._id))
        return true;
      return false;
    });
  }) as UsersModelInterface;
};
