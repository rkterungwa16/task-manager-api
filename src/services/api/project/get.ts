import { Document, Model } from "mongoose";

import { Projects } from "../../../models";
import {
    listOfUserAsOwnerAndColloaboratorProjects,
    singleProjectWithTasks
} from "../../../query";

export const fetchOwnerProjectsFactory = (
    projects: Model<Document>
): ((owner: string) => Promise<Document[]>) => {
    return async owner => {
        return await projects.aggregate(
            listOfUserAsOwnerAndColloaboratorProjects(owner)
        );
    };
};

export const fetchOwnerProjects = fetchOwnerProjectsFactory(Projects);

export const fetchOwnerProjectFactory = (
    projects: Model<Document>
): ((owner: string, projectId: string) => Promise<Document>) => {
    // TODO: return error message for non existent project
    return async (owner, projectId) => {
        const aggregatedProject = await projects.aggregate(
            singleProjectWithTasks(projectId, owner)
        );
        return aggregatedProject[0];
    };
};

export const fetchOwnerProject = fetchOwnerProjectFactory(Projects);
