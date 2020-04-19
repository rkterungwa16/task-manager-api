import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { CustomError } from "../../..";
import { projectProperties, Visibility } from "../../../../constants";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";
import { addCollaborators, editDescription, editTitle } from "./actions";
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
        projectPropName: any,
        projectId: string,
        ownerProject: ProjectsModelInterface,
        owner?: ObjectId
    ) => Promise<any>;
}
interface UpdateActionsInterface {
    [x: string]: (
        projectPropValue: any,
        projectId: string,
        ownerProject: ProjectsModelInterface,
        owner?: ObjectId
    ) => Promise<any>;
}

const actions = {
    addCollaborators,
    editDescription,
    editTitle
} as UpdateActionsInterface;

const update = {
    collaborator(action: string) {
        return actions[action];
    },
    description(action: string) {
        return actions[action];
    },
    title(action: string) {
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
        projectProps: string[],
        projectUpdateProp: string
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
        try {
            const requestProperties = Object.keys(projectRequestDetails);
            hasValidProperties(
                requestProperties,
                projectProperties,
                projectUpdateProp
            );
            const ownerDetail = (await user.findById(
                owner
            )) as UsersModelInterface;
            const ownerProject = (await exists(
                ownerDetail.id as ObjectId,
                projectId,
                project
            )) as ProjectsModelInterface;

            const updateProjectAction = update[projectUpdateProp](
                projectUpdateAction
            );
            const updatedProject = await updateProjectAction(
                projectRequestDetails[projectUpdateProp],
                projectId,
                ownerProject,
                ownerDetail.id as ObjectId
            );
            return updatedProject;
        } catch (err) {
            throw err;
        }
    };
})({
    project: Projects,
    user: Users,
    projectExists,
    hasValidProperties: hasValidProjectProperties
});
