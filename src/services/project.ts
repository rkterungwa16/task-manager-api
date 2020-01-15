import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Projects } from "../models";
import { listOfUserAsOwnerAndColloaboratorProjects } from "../query";
import { ProjectsModelInterface } from "../types";

export interface CreateProjectParameterInterface {
    project: Model<Document>;
}

export const createProjectDefinition = (
    createProjectsArgs: CreateProjectParameterInterface
): ((credentials: ProjectsModelInterface) => Promise<Document>) => {
    const { project } = createProjectsArgs;
    return async (credentials: ProjectsModelInterface) => {
        return await project.create(credentials);
    };
};

export const createProject = createProjectDefinition({ project: Projects });

export const viewOwnerProjectsDefinition = (
    projects: Model<Document>
): ((owner: ObjectId) => Promise<Document[]>) => {
    return async owner => {
        return await projects.aggregate(
            listOfUserAsOwnerAndColloaboratorProjects(owner)
        );
    };
};

export const viewOwnerProjects = viewOwnerProjectsDefinition(Projects);

export const viewSingleOwnerProjectDefinition = (
    projects: Model<Document>
): ((owner: ObjectId, projectId: string) => Promise<Document>) => {
    // TODO: return error message for non existent project
    return async (owner, projectId) => {
        return (await projects.findOne({
            _id: projectId,
            owner
        })) as Document;
    };
};

export const viewSingleOwnerProject = viewSingleOwnerProjectDefinition(
    Projects
);

// Create a users project and assign ownership
// View a user's project [owner, collaborator]
// View a user's projects [owner, colloborator]
// Delete a user's project [owner]
// Edit a user's project [owner]
// View projects that he is a member of
