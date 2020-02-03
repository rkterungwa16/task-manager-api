import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface UsersModelInterface extends Document {
    id: ObjectId;
    name: string;
    email: string;
    salt: string;
    password: string;
    createdAt: string;
    updatedAt: string;
    collaborationInviteStatus: "pending" | "declined" | "accepted";
    resetPasswordToken: string;
    favoriteProjects: ObjectId[];
}
