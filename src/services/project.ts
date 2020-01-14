import { Document, Model } from "mongoose";

import { Projects } from "../models";
import { ProjectsModelInterface } from "../types";

export interface CreateProjectParameterInterface {
    project: Model<Document>;
}

export const createProject = ((
    createProjectsArgs: CreateProjectParameterInterface
): ((credentials: ProjectsModelInterface) => Promise<Document>) => {
    const { project } = createProjectsArgs;
    return async (credentials: ProjectsModelInterface) => {
        return await project.create(credentials);
    };
})({ project: Projects });

// Create a users project and assign ownership
// View a user's project [owner, collaborator]
// View a user's projects [owner, colloborator]
// Delete a user's project [owner]
// Edit a user's project [owner]
