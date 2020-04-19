import { ObjectId, ObjectID } from "mongodb";
import { Document, Model } from "mongoose";

import { error } from "../../..";
import { baseUrl, projectProperties, Visibility } from "../../../../constants";
import { Projects, Users } from "../../../../models";
import { ProjectsModelInterface, UsersModelInterface } from "../../../../types";

export interface ProjectDbUpdateInterface {
    projectId: string;
    projectUpdateValues: ProjectsModelInterface;
    project: Model<Document>;
}

export interface UpdateProjectUtilsInterface {
    project: Model<Document>;
    user: Model<Document>;
    hasValidProperties: (
        projectReqProps: string[],
        projectProps: string[]
    ) => boolean;

    projectDbUpdate: (
        projectUpdateDetails: ProjectDbUpdateInterface
    ) => Promise<ProjectsModelInterface>;

    projectExists: (
        owner: UsersModelInterface,
        projectId: string,
        project: Model<Document>
    ) => Promise<ProjectsModelInterface>;

    sendEmails: (
        ownerDetails: UsersModelInterface,
        collaboratorsEmail: string[]
    ) => Promise<boolean>;

    createNonExistingUsers: (
        collaboratorsEmails: string[],
        user: Model<Document>,
        userCollaborators: UsersModelInterface[]
    ) => Promise<boolean | UsersModelInterface[]>;
}

export const projectDbUpdate = async (
    projectUpdateDetails: ProjectDbUpdateInterface
): Promise<ProjectsModelInterface> => {
    try {
        const {
            projectId,
            project,
            projectUpdateValues
        } = projectUpdateDetails;
        return (await project
            .findByIdAndUpdate(
                projectId,
                {
                    $set: projectUpdateValues
                },
                { new: true }
            )
            .populate("owner", "-password -salt")
            .populate("collaborators", "-password -salt")
            .exec()) as ProjectsModelInterface;
    } catch (err) {
        throw error(500, "Could not update project", "Project");
    }
};

export const projectExists = async (
    owner: ObjectId,
    projectId: string,
    project: Model<Document>
): Promise<ProjectsModelInterface> => {
    const userProject = (await project
        .findOne({
            owner,
            _id: projectId
        })
        .populate("owner", "-password -salt")
        .populate("collaborators", "-password -salt")
        .exec()) as ProjectsModelInterface;
    if (!userProject) {
        throw error(400, "Project does not exist", "Add user To Project");
    }
    return userProject;
};

export const hasValidProjectProperties = (
    projectReqProps: string[],
    projectProps: string[],
    projectUpdateProp: string
): boolean => {
    // check if request properties are amongst valid project project property
    for (const prop of projectReqProps) {
        if (!projectProps.includes(prop)) {
            throw error(422, "Use valid project properties", "Project Update");
        }
    }

    // confirm if particular project property to be updated is in the request object.
    if (!projectReqProps.includes(projectUpdateProp)) {
        throw error(422, `${projectUpdateProp} is required`, "Project Update");
    }

    return true;
};
