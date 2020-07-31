import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";

export const viewProjectTasksDefinition = (
    tasks: Model<Document>
): ((project: string) => Promise<Document[]>) => {
    return async project => {
        return (await tasks
            .find({
                project
            })
            .populate("project")
            .exec()) as Document[];
    };
};

export const viewProjectTasks = viewProjectTasksDefinition(Tasks);

export const viewTodaysTasksDefinition = (
    tasks: Model<Document>
): ((userId: ObjectId) => Promise<Document[]>) => {
    return async userId => {
        return (await tasks
            .find({
                dueDate: new Date(),
                userId
            })
            .populate("project")
            .exec()) as Document[];
    };
};

export const viewTodaysTasks = viewTodaysTasksDefinition(Tasks);
