import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";

import { updateProject } from "../../services";
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
        return res.status(200).send({
            message: "user successfully added to project as collaborator",
            data: {
                project
            }
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
        return res.status(200).send({
            message: "user successfully edited project description",
            data: {
                project
            }
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
        return res.status(200).send({
            message: "user successfully edited project title",
            data: {
                project
            }
        });
    } catch (err) {
        next(err);
    }
};
