import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface ProjectsModelInterface extends Document {
  title: string;
  description?: string;
  color?: string;
  owner: string;
  tasks?: string[];
  isFavourite?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  collaborators?: string[];
  invites?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectCredentials {
  title?: string;
  description?: string;
  color?: string;
  owner: string;
  tasks?: string[];
  isFavourite?: boolean;
  isArchived?: boolean;
  isDeleted?: boolean;
  collaborators?: string[];
  invites?: string[];
  createdAt?: string;
  updatedAt?: string;
}
