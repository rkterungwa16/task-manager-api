import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import { createProject, viewOwnerProjects } from "../services";
import { IRequest } from "../types";
import { ProjectsModelInterface, UsersModelInterface } from "../types";

export const createProjectControllerDefinition = (
    createUserProject: (
        credentials: ProjectsModelInterface
    ) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { name, description, color } = req.body;
            const { id } = req.currentUser as UsersModelInterface;
            const project = await createUserProject({
                name,
                description,
                color,
                owner: id
            } as ProjectsModelInterface);
            return res.status(201).send({
                message: "project successfully created",
                data: {
                    project
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const createProjectController = createProjectControllerDefinition(
    createProject
);

export const viewOwnerProjectsControllerDefinition = (
    viewProjects: (owner: ObjectId) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const projects = await viewProjects(id);
            return res.status(201).send({
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
