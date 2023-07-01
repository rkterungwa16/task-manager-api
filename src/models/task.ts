import { ObjectId, ObjectID } from "mongodb";
import { connect } from "../datasources";
import { TasksModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class TasksSchema {
  static get schema() {
    return new Schema(
      {
        description: {
          type: String,
          required: true
        },
        priority: {
          type: Number,
          enum: [1, 2, 3, 4],
          default: 4
        },
        userId: {
          type: ObjectID,
          ref: "Users"
        },
        project: {
          type: ObjectId,
          ref: "Projects"
        },
        dueDate: {
          type: Date
        },
        label: {
          type: [String]
        },
        completed: {
          type: Boolean,
          default: false
        }
      },
      {
        timestamps: true
      }
    );
  }
}

export const Tasks = mongooseConnection.model<TasksModelInterface>(
  "Tasks",
  TasksSchema.schema
);
