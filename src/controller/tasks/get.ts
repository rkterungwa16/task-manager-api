import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import {
    viewProjectTasks,
    viewTodaysTasks,
    viewUsersOverDueTasks,
    apiResponse
} from "../../services";
import { IRequest } from "../../types";

export const viewProjectTasksControllerDefinition = (
    viewProjectTasks: (projectId: string) => Promise<Document[]>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params as { projectId: string };
            const tasks = await viewProjectTasks(projectId);
            return apiResponse({
                message: "project tasks successfully fetched",
                data: {
                    tasks
                },
                statusCode: 200,
                response: res
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
            return apiResponse({
                message: "tasks due today successfull fetched",
                data: {
                    tasks
                },
                response: res,
                statusCode: 200
            });
        } catch (err) {
            next(err);
        }
    };
};

// TODO: Response should include title: today
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
            return apiResponse({
                message: "tasks over due successfully fetched",
                data: {
                    tasks
                },
                response: res,
                statusCode: 200
            });
        } catch (err) {
            next(err);
        }
    };
};

export const viewUsersOverDueTasksController = viewUsersOverDueTasksControllerDefinition(
    viewUsersOverDueTasks
);