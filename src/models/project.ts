import { ObjectId, ObjectID } from "mongodb";
import { connect } from "../datasources";
import { ProjectsModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class ProjectsSchema {
    static get schema() {
        return new Schema(
            {
                name: {
                    type: String,
                    required: true
                },
                owner: {
                    type: ObjectID,
                    ref: "Users"
                },
                tasks: {
                    type: [ObjectId],
                    ref: "Tasks"
                },
                collaborators: {
                    type: [ObjectId],
                    ref: "Users"
                }
            },
            {
                timestamps: true
            }
        );
    }
}

export const Projects = mongooseConnection().model<ProjectsModelInterface>(
    "Projects",
    ProjectsSchema.schema
);
