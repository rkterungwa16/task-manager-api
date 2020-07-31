import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Tasks } from "../../../models";

export const viewProjectTasksDefinition = (
    tasks: Model<Document>
): ((projectId: string) => Promise<Document[]>) => {
    return async projectId => {
        return (await tasks
            .find({
                projectId
            })
            .populate("project")
            .exec()) as Document[];
    };
};

export const viewProjectTasks = viewProjectTasksDefinition(Tasks);
