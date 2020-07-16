import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";
import { TasksModelInterface } from "../../../types";

export interface CreateTaskParameterInterface {
    task: Model<Document>;
}

export const createTaskDefinition = (
    createTasksArgs: CreateTaskParameterInterface
): ((credentials: TasksModelInterface) => Promise<Document>) => {
    const { task } = createTasksArgs;
    return async (credentials: TasksModelInterface) => {
        return await task.create(credentials);
    };
};

export const createTask = createTaskDefinition({ task: Tasks });
