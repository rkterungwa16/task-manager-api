import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";

export const fetchProjectTasksDefinition = (
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

export const fetchProjectTasks = fetchProjectTasksDefinition(Tasks);

export const fetchTodaysTasksDefinition = (
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

export const fetchTodaysTasks = fetchTodaysTasksDefinition(Tasks);

export const fetchUsersOverDueTasksDefinition = (
    tasks: Model<Document>
): ((userId: ObjectId) => Promise<Document[]>) => {
    return async userId => {
        return (await tasks
            .find({
                dueDate: {
                    $lt: new Date()
                },
                userId
            })
            .populate("project")
            .exec()) as Document[];
    };
};

export const fetchUsersOverDueTasks = fetchUsersOverDueTasksDefinition(Tasks);
