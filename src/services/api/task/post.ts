import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";
import { TasksModelInterface, TasksCredentials } from "../../../types";

export interface CreateTaskParameterInterface {
  task: Model<Document>;
}

export const createTaskDefinition = (
  createTasksArgs: CreateTaskParameterInterface
): ((credentials: TasksCredentials) => Promise<Document>) => {
  const { task } = createTasksArgs;
  return async (credentials: TasksCredentials) => {
    return await task.create(credentials);
  };
};

export const createTask = createTaskDefinition({ task: Tasks });
