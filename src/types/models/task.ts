import { ObjectId, ObjectID } from "mongodb";
import { Document } from "mongoose";

enum Priority {
    low = 1,
    medium = 2,
    high = 3,
    highest = 4
}
export interface TasksModelInterface extends Document {
    description?: string;
    priority?: Priority;
    userId?: ObjectID;
    project?: ObjectId;
    label?: string[];
    completed?: boolean;
    dueDate?: string;
    createdAt?: string;
    updatedAt?: string;
}
