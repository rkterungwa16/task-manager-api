import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import {
    viewProjectTasks,
    viewTodaysTasks,
    viewUsersOverDueTasks
} from "../../services";
import { IRequest } from "../../types";

export const viewProjectTasksControllerDefinition = (
    viewProjectTasks: (projectId: string) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params as { projectId: string };
            const tasks = await viewProjectTasks(projectId);
            return res.status(200).send({
                message: "project tasks successfully fetched",
                data: {
                    tasks
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewProjectTasksController = viewProjectTasksControllerDefinition(
    viewProjectTasks
);

export const viewTodaysTasksControllerDefinition = (
    viewTodaysTasks: (userId: ObjectId) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as { id: ObjectId };
            const tasks = await viewTodaysTasks(id);
            return res.status(200).send({
                message: "tasks due today successfull fetched",
                data: {
                    tasks
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewTodaysTasksController = viewTodaysTasksControllerDefinition(
    viewTodaysTasks
);

export const viewUsersOverDueTasksControllerDefinition = (
    viewUsersOverDueTasks: (userId: ObjectId) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as { id: ObjectId };
            const tasks = await viewUsersOverDueTasks(id);
            return res.status(200).send({
                message: "tasks over due successfully fetched",
                data: {
                    tasks
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewUsersOverDueTasksController = viewUsersOverDueTasksControllerDefinition(
    viewUsersOverDueTasks
);
