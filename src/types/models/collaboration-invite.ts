import { ObjectId } from "mongodb";
import { Document } from "mongoose";

export interface CollaboratorInvitesModelInterface extends Document {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  status?: "pending" | "declined" | "accepted";
  collaborator?: string;
  owner?: string;
  project?: string;
}
