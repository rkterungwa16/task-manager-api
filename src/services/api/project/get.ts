import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";

import { Projects } from "../../../models";
import { listOfUserAsOwnerAndColloaboratorProjects } from "../../../query";

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
        return (await projects
            .findOne({
                _id: projectId,
                owner
            })
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as Document;
    };
};

export const viewSingleOwnerProject = viewSingleOwnerProjectDefinition(
    Projects
);
