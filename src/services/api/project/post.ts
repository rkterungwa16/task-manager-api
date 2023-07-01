import { Document, Model } from "mongoose";

import { Projects } from "../../../models";
import { ProjectsModelInterface, ProjectCredentials } from "../../../types";

export interface CreateProjectParameterInterface {
  project: Model<Document>;
}

export const createProjectFactory = (
  createProjectsArgs: CreateProjectParameterInterface
): ((credentials: ProjectCredentials) => Promise<Document>) => {
  const { project } = createProjectsArgs;
  return async (credentials: ProjectCredentials) => {
    return await project.create(credentials);
  };
};

export const createProject = createProjectFactory({ project: Projects });
