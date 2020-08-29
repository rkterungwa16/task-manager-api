import { NextFunction, Response } from "express";
import { Document } from "mongoose";
import { ObjectID } from "mongodb";

import { editTask, apiResponse } from "../../services";
import {
    IRequest,
    UsersModelInterface,
    TasksModelInterface
} from "../../types";

export const editTaskControllerDefinition = (
    editUserTask: (credentials: TasksModelInterface, taskId: string) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const {
                description,
                label,
                priority,
                completed,
                dueDate
            } = req.body;
            const { projectId, taskId } = req.params;
            const { id } = req.currentUser as UsersModelInterface;

            const taskDetail = {
                description,
                ...(label && { label }),
                ...(priority && { priority }),
                ...(completed && { completed }),
                ...(dueDate && { dueDate }),
                project: new ObjectID(projectId),
                userId: id
            } as TasksModelInterface;

            const task = await editUserTask(taskDetail, taskId);

            return apiResponse({
                message: "task successfully edited",
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

export const editTaskController = editTaskControllerDefinition(editTask);
