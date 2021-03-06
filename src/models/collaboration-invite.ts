import { ObjectID } from "mongodb";
import { connect } from "../datasources";
import { CollaboratorInvitesModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class CollaboratorInvitesSchema {
    static get schema() {
        return new Schema(
            {
                owner: {
                    type: ObjectID,
                    ref: "Users"
                },
                collaborator: {
                    type: ObjectID,
                    ref: "Users"
                },
                status: {
                    type: String,
                    enum: ["pending", "declined", "accepted"]
                },
                project: {
                    type: ObjectID,
                    ref: "Projects"
                }
            },
            {
                timestamps: true
            }
        );
    }
}

export const CollaboratorInvites = mongooseConnection.model<
    CollaboratorInvitesModelInterface
>("CollaborationInvites", CollaboratorInvitesSchema.schema);
