import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { CustomError } from "../../..";
import { projectProperties, Visibility } from "../../../../constants";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";
import { addCollaborators } from "./collaborators";
import { hasValidProjectProperties, projectExists } from "./helpers";

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

export interface UpdateRequestObject {
    title?: string;
    description?: string;
    owner?: string;
    tasks?: string;
    collaborators?: string[];
    visibility?: Visibility;
    deleted?: boolean;
    archived?: boolean;
    favourite?: boolean;
    [x: string]: any;
}

interface UpdateInterface {
    [x: string]: (
        action: string
    ) => (
        projectProp: any,
        projectId: string,
        owner: ObjectId,
        ownerProject: ProjectsModelInterface
    ) => Promise<any>;
}
interface UpdateActionsInterface {
    [x: string]: (
        collaboratorEmails: string[],
        projectId: string,
        owner: ObjectId,
        ownerProject: ProjectsModelInterface
    ) => Promise<any>;
}

const update = {
    collaborator(action: string) {
        const actions = {
            addCollaborators
        } as UpdateActionsInterface;
        return actions[action];
    }
    // favourites: "",
    // tasks: "",
} as UpdateInterface;

export interface UpdateProjectUtilsInterface {
    project: Model<Document>;
    user: Model<Document>;
    hasValidProperties: (
        projectReqProps: string[],
        projectProps: string[]
    ) => boolean;

    projectExists: (
        owner: ObjectId,
        projectId: string,
        project: Model<Document>
    ) => Promise<ProjectsModelInterface>;
}

export const updateProject = ((
    updateProjectUtils: UpdateProjectUtilsInterface
) => {
    const {
        projectExists: exists,
        hasValidProperties,
        project,
        user
    } = updateProjectUtils;
    return async (
        projectRequestDetails: UpdateRequestObject,
        projectId: string,
        owner: ObjectId,
        projectUpdateAction: string,
        projectUpdateProp: string
    ): Promise<any> => {
        const requestProperties = Object.keys(projectRequestDetails);
        hasValidProperties(requestProperties, projectProperties);
        const ownerDetail = (await user.findById(owner)) as UsersModelInterface;
        const ownerProject = (await exists(
            ownerDetail.id as ObjectId,
            projectId,
            project
        )) as ProjectsModelInterface;

        const updatedProject = update[projectUpdateProp](projectUpdateAction);
        return await updatedProject(
            projectRequestDetails[projectUpdateProp],
            projectId,
            ownerDetail.id as ObjectId,
            ownerProject
        );
    };
})({
    project: Projects,
    user: Users,
    projectExists,
    hasValidProperties: hasValidProjectProperties
});
