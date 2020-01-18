import { Document, Model } from "mongoose";

import { Projects } from "../../../models";
import { ProjectsModelInterface } from "../../../types";

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
