import { ObjectId, ObjectID } from "mongodb";
import { connect } from "../datasources";
import { TasksModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class TasksSchema {
    static get schema() {
        return new Schema(
            {
                content: {
                    type: String,
                    required: true
                },
                priority: {
                    type: Number,
                    enum: [1, 2, 3, 4],
                    default: 1
                },
                userId: {
                    type: ObjectID,
                    ref: "Users"
                },
                projectId: {
                    type: ObjectId,
                    ref: "Projects"
                },
                dueDate: {
                    type: Date
                }
            },
            {
                timestamps: true
            }
        );
    }
}

export const Tasks = mongooseConnection().model<TasksModelInterface>(
    "Tasks",
    TasksSchema.schema
);