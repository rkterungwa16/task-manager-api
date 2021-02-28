import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import {
    fetchOwnerProjects,
    fetchOwnerProject,
    apiResponse
} from "../../services";
import { IRequest, UsersModelInterface } from "../../types";

export const fetchOwnerProjectsControllerFactory = (
    fetchProjects: (owner: string) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const projects = await fetchProjects(id);
            return apiResponse({
                message: "projects successfully fetched",
                data: {
                    projects
                },
                response: res,
                statusCode: 200
            });
        } catch (err) {
            next(err);
        }
    };
};

export const fetchOwnerProjectsController = fetchOwnerProjectsControllerFactory(
    fetchOwnerProjects
);

export const fetchOwnerProjectControllerFactory = (
    fetchProject: (owner: string, projectId: string) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const { projectId } = req.params;
            const project = await fetchProject(id, projectId);
            return apiResponse({
                message: "project successfully fetched",
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
};

export const fetchOwnerProjectController = fetchOwnerProjectControllerFactory(
    fetchOwnerProject
);
