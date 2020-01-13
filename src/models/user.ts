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
                    type: String,
                    require: true
                },
                password: {
                    type: String,
                    required: true
                }
            },
            {
                timestamps: true
            }
        );
    }
}

export const Users = mongooseConnection().model<UsersModelInterface>(
    "Users",
    UsersSchema.schema
);
