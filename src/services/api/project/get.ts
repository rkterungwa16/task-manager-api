import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Projects } from "../../../models";
import {
    listOfUserAsOwnerAndColloaboratorProjects,
    singleProjectWithTasks
} from "../../../query";

export const viewOwnerProjectsDefinition = (
    projects: Model<Document>
): ((owner: string) => Promise<Document[]>) => {
    return async owner => {
        return await projects.aggregate(
            listOfUserAsOwnerAndColloaboratorProjects(owner)
        );
    };
};

export const viewOwnerProjects = viewOwnerProjectsDefinition(Projects);

export const viewSingleOwnerProjectDefinition = (
    projects: Model<Document>
): ((owner: string, projectId: string) => Promise<Document>) => {
    // TODO: return error message for non existent project
    return async (owner, projectId) => {
        const aggregatedProject = await projects.aggregate(
            singleProjectWithTasks(projectId)
        );
        return aggregatedProject[0];
    };
};

export const viewSingleOwnerProject = viewSingleOwnerProjectDefinition(
    Projects
);
