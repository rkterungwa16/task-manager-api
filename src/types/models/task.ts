import { ObjectId, ObjectID } from "mongodb";
import { Document } from "mongoose";

enum Priority {
    low = 4,
    medium = 3,
    high = 2,
    highest = 1
}
export interface TasksModelInterface extends Document {
    description?: string;
    priority?: Priority;
    userId?: string;
    project?: string;
    label?: string[];
    completed?: boolean;
    dueDate?: string;
    createdAt?: string;
    updatedAt?: string;
}
