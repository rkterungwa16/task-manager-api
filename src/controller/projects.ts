import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import {
    addUserAsCollaborator,
    createProject,
    viewOwnerProjects,
    viewSingleOwnerProject
} from "../services";
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

export interface AddUserControllerParamDefinition {
    owner: ObjectId;
    projectId: ObjectId;
    collaboratorEmail: string;
}
export const addUserAsCollaboratorControllerDefinition = (
    addUser: (
        addUserControllerArgs: AddUserControllerParamDefinition
    ) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const { projectId, collaboratorEmail } = req.body;
            const project = await addUser({
                owner: id as ObjectId,
                projectId,
                collaboratorEmail
            });
            return res.status(200).send({
                message: "user successfull added to project as collaborator",
                data: {
                    project
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const addUserAsCollaboratorController = addUserAsCollaboratorControllerDefinition(
    addUserAsCollaborator
);
