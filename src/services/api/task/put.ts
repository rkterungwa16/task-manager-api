import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";
import { TasksModelInterface } from "../../../types";

export interface EditTaskParameterInterface {
    task: Model<Document>;
}

export const editTaskDefinition = (
    createTasksArgs: EditTaskParameterInterface
): ((credentials: TasksModelInterface, taskId: string) => Promise<Document>) => {
    const { task } = createTasksArgs;
    return async (credentials: TasksModelInterface, taskId) => {
        return (await task
            .findByIdAndUpdate(
                taskId,
                {
                    $set: credentials
                },
                { new: true }
            )
        ) as Document;
    };
};

export const editTask = editTaskDefinition({ task: Tasks });
