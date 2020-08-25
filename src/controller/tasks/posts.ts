import { NextFunction, Response } from "express";
import { Document } from "mongoose";
import { ObjectID } from "mongodb";

import { createTask, apiResponse } from "../../services";
import {
    IRequest,
    UsersModelInterface,
    TasksModelInterface
} from "../../types";

export const createTaskControllerDefinition = (
    createUserTask: (credentials: TasksModelInterface) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { description } = req.body;
            const { projectId } = req.params;
            const { id } = req.currentUser as UsersModelInterface;
            const taskDetail = {
                description,
                project: new ObjectID(projectId),
                userId: id
            } as TasksModelInterface;

            const task = await createUserTask(taskDetail);

            return apiResponse({
                message: "task successfully created",
                data: {
                    task
                },
                statusCode: 200,
                response: res
            });
        } catch (err) {
            next(err);
        }
    };
};

export const createTaskController = createTaskControllerDefinition(createTask);
