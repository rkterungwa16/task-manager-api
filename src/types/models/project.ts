import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface ProjectsModelInterface extends Document {
    title: string;
    description?: string;
    color?: string;
    owner: ObjectId;
    tasks?: ObjectId[];
    isFavourite?: boolean;
    isArchived?: boolean;
    isDeleted?: boolean;
    collaborators?: ObjectId[];
    createdAt?: string;
    updatedAt?: string;
}
