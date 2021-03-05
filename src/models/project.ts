import { ObjectId } from "mongodb";
import { connect } from "../datasources";
import { ProjectsModelInterface } from "../types";

const mongooseConnection = connect;

import { Schema } from "mongoose";

class ProjectsSchema {
    static get schema() {
        return new Schema(
            {
                title: {
                    type: String,
                    required: true
                },
                description: {
                    type: String
                },
                owner: {
                    type: ObjectId,
                    ref: "Users"
                },
                tasks: [{ type: ObjectId, ref: "Tasks" }],
                collaborators: [
                    {
                        type: ObjectId,
                        ref: "Users"
                    }
                ],
                visibility: {
                    type: String,
                    enum: ["PRIVATE", "PUBLIC"],
                    default: "PUBLIC"
                },
                color: {
                    type: String,
                    default: "#8d8d8d"
                },
                isDeleted: {
                    type: Boolean,
                    default: false
                },
                isArchived: {
                    type: Boolean,
                    default: false
                },
                isFavourite: {
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

export const Projects = mongooseConnection.model<ProjectsModelInterface>(
    "Projects",
    ProjectsSchema.schema
);
