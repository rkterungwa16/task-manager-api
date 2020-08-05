import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";

import { updateProject, apiResponse } from "../../services";
import { IRequest, UsersModelInterface } from "../../types";

export interface EditProjectArgsInterface {
    owner: ObjectId;
    projectId: ObjectId;
}
export interface AddCollaboratorsArgsInterface
    extends EditProjectArgsInterface {
    collaboratorEmail: string;
}
export const addCollaboratorsController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = updateProject(
            req.body as any,
            projectId,
            id as ObjectId,
            "addCollaborators",
            "collaborators"
        );
        return apiResponse({
            message: "user successfully added to project as collaborator",
            data: {
                project
            },
            response: res,
            statusCode: 200
        });
    } catch (err) {
        next(err);
    }
};

export interface EditDescriptionArgsInterface extends EditProjectArgsInterface {
    description: string;
}
export const editDescriptionController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = await updateProject(
            req.body as any,
            projectId,
            id as ObjectId,
            "editDescription",
            "description"
        );
        return apiResponse({
            message: "user successfully edited project description",
            data: {
                project
            },
            statusCode: 200,
            response: res
        });
    } catch (err) {
        next(err);
    }
};

export interface EditTitleArgsInterface extends EditProjectArgsInterface {
    title: string;
}
export const editTitleController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = await updateProject(
            req.body as any,
            projectId,
            id as ObjectId,
            "editTitle",
            "title"
        );
        return apiResponse({
            message: "user successfully edited project title",
            data: {
                project
            },
            response: res,
            statusCode: 200
        });
    } catch (err) {
        next(err);
    }
};

export interface FavouriteArgsInterface extends EditProjectArgsInterface {
    title: string;
}
export const setProjectAsFavouriteController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = await updateProject(
            req.body as any,
            projectId,
            id as ObjectId,
            "setFavourite",
            "isFavourite"
        );
        return apiResponse({
            message: "user successfully set project as a favourite",
            data: {
                project
            },
            statusCode: 200,
            response: res
        });
    } catch (err) {
        next(err);
    }
};

export interface ArchiveProjectArgsInterface extends EditProjectArgsInterface {
    title: string;
}
export const archiveProjectController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = await updateProject(
            req.body as any,
            projectId,
            id as ObjectId,
            "archiveProject",
            "isArchived"
        );
        return apiResponse({
            message: "project is successfully archived",
            data: {
                project
            },
            statusCode: 200,
            response: res
        });
    } catch (err) {
        next(err);
    }
};
