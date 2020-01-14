import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface ProjectsModelInterface extends Document {
    name: string;
    description?: string;
    color?: string;
    owner: ObjectId;
    tasks?: ObjectId[];
    collaborators?: ObjectId[];
    createdAt?: string;
    updatedAt?: string;
}
