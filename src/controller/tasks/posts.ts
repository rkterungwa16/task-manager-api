import { NextFunction, Response } from "express";
import { Document } from "mongoose";
import { ObjectID } from "mongodb";

import { createTask } from "../../services";
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
            const { content } = req.body;
            const { projectId } = req.params;
            const { id } = req.currentUser as UsersModelInterface;
            const taskDetail = {
                content,
                projectId: new ObjectID(projectId),
                userId: id
            } as TasksModelInterface;

            const task = await createUserTask(taskDetail);

            return res.status(201).send({
                message: "task successfully created",
                data: {
                    task
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const createTaskController = createTaskControllerDefinition(createTask);
