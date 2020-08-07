import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { CustomError } from "../../..";
import { projectProperties, Visibility } from "../../../../constants";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";
import * as projectActions from "./actions";
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
    isDeleted?: boolean;
    isArchived?: boolean;
    isFavourite?: boolean;
    [x: string]: any;
}

interface UpdateInterface {
    [x: string]: () => (
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
    addCollaborators: projectActions.addCollaborators,
    edit: projectActions.edit,
    archiveProject: projectActions.archiveProject
} as UpdateActionsInterface;

const update = {
    addCollaborator() {
        return actions.addCollaborator;
    },
    edit() {
        return actions.edit;
    },
    archiveProject() {
        return actions.archiveProject;
    }
    // tasks: "",
} as UpdateInterface;

export interface UpdateProjectUtilsInterface {
    project: Model<Document>;
    user: Model<Document>;
    hasValidProperties: (
        projectReqProps: { [x: string]: string },
        projectProps: Array<{ [x: string]: string }>,
        projectUpdateProp: string | string[]
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
        projectUpdateProp: string | string[]
    ): Promise<any> => {
        try {
            hasValidProperties(
                projectRequestDetails,
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

            const updateProjectAction = update[projectUpdateAction]();
            const updatedProject = await updateProjectAction(
                projectRequestDetails,
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
