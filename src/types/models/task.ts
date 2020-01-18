import { ObjectId, ObjectID } from "mongodb";
import { Document } from "mongoose";

enum Priority {
    low = 1,
    medium = 2,
    high = 3,
    highest = 4
}
export interface TasksModelInterface extends Document {
    content: string;
    priority: Priority;
    userId: ObjectID;
    projectId: ObjectId;
    label: string[];
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}