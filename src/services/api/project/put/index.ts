import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";
import { ProjectCredentials } from "types";

import { CustomError } from "../../..";
import { Visibility } from "../../../../constants";
import { Projects } from "../../../../models";
import { projectDbUpdate } from "./helpers";

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

interface EditProjectRequestProps {
    description?: string;
    title?: string;
    isFavourite?: boolean;
    color?: string;
}

export const editProject = async (
    requestProps: EditProjectRequestProps,
    id: { projectId: string; ownerId: string }
): Promise<any> => {
    let updatedProject;
    const projectUpdateValues = {
        ...(requestProps.description && {
            description: requestProps.description
        }),
        ...(requestProps.title && { title: requestProps.title }),
        ...(typeof requestProps.isFavourite !== "undefined" && {
            isFavourite: requestProps.isFavourite
        }),
        ...(requestProps.color && { color: requestProps.color })
    } as ProjectCredentials;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId: id.projectId,
        ownerId: id.ownerId,
        projectUpdateValues
    });
    return updatedProject;
};
