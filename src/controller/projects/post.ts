import { NextFunction, Response } from "express";
import { Document } from "mongoose";

import { createProject, apiResponse } from "../../services";
import {
    IRequest,
    ProjectsModelInterface,
    UsersModelInterface
} from "../../types";

export const createProjectControllerDefinition = (
    createUserProject: (
        credentials: ProjectsModelInterface
    ) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { title, description, color } = req.body;
            const { id } = req.currentUser as UsersModelInterface;
            const project = await createUserProject({
                title,
                description,
                color,
                owner: id
            } as ProjectsModelInterface);
            return apiResponse({
                message: "project successfully created",
                data: {
                    project
                },
                response: res,
                statusCode: 201
            });
        } catch (err) {
            next(err);
        }
    };
};

export const createProjectController = createProjectControllerDefinition(
    createProject
);
