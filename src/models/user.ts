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
                collaborationInviteStatus: {
                    type: String,
                    enum: ["pending", "declined", "accepted"]
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
