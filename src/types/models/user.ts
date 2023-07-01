import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface UsersModelInterface extends Document {
  _id: string;
  name?: string;
  email?: string;
  salt?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  collaborationInvites?: ObjectId[];
  resetPasswordToken?: string;
  favoriteProjects?: ObjectId[];
  isActivated?: boolean;
}
export interface CreatedUserCredentialInterface {
  name: string;
  email: string;
  password: string;
}

export interface AuthenticatedUserCredentialInterface {
  email: string;
  password: string;
}
