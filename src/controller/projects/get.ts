import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import { viewOwnerProjects, viewSingleOwnerProject } from "../../services";
import { IRequest, UsersModelInterface } from "../../types";

export const viewOwnerProjectsControllerDefinition = (
    viewProjects: (owner: ObjectId) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const projects = await viewProjects(id as ObjectId);
            return res.status(200).send({
                message: "projects successfully fetched",
                data: {
                    projects
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewOwnerProjectsController = viewOwnerProjectsControllerDefinition(
    viewOwnerProjects
);

export const viewSingleOwnerProjectControllerDefinition = (
    viewProject: (owner: ObjectId, projectId: string) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const { projectId } = req.params;
            const project = await viewProject(id as ObjectId, projectId);
            return res.status(200).send({
                message: "project successfully fetched",
                data: {
                    project
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewSingleOwnerProjectController = viewSingleOwnerProjectControllerDefinition(
    viewSingleOwnerProject
);
