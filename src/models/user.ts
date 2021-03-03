import { ObjectId } from "mongodb";
import { connect } from "../datasources";
import { UsersModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class UsersSchema {
    static get schema() {
        return new Schema(
            {
                name: {
                    type: String
                },
                email: {
                    type: String,
                    required: true
                },
                salt: {
                    type: String
                },
                password: {
                    type: String
                },
                isActivated: {
                    type: Boolean
                },
                collaborationInvites: {
                    type: [ObjectId],
                    ref: "CollaboratorInvites"
                },
                resetPasswordToken: {
                    type: String
                }
            },
            {
                timestamps: true
            }
        );
    }
}

export const Users = mongooseConnection.model<UsersModelInterface>(
    "Users",
    UsersSchema.schema
);
