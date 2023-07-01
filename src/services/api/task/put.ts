import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";
import { TasksCredentials } from "../../../types";

export interface EditTaskParameterInterface {
  task: Model<Document>;
}

export const editTaskFactory = (
  createTasksArgs: EditTaskParameterInterface
): ((credentials: TasksCredentials, taskId: string) => Promise<Document>) => {
  const { task } = createTasksArgs;
  return async (credentials: TasksCredentials, taskId) => {
    return (await task.findByIdAndUpdate(
      taskId,
      {
        $set: credentials
      },
      { new: true }
    )) as Document;
  };
};

export const editTask = editTaskFactory({ task: Tasks });
