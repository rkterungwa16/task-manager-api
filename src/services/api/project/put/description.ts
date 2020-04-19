import { Projects } from "../../../../models";
import { ProjectsModelInterface } from "../../../../types";
import { projectDbUpdate } from "./helpers";

export const editDescription = async (
    description: string,
    projectId: string,
    ownerProject: ProjectsModelInterface
): Promise<any> => {
    let updatedProject;
    ownerProject = {
        ...ownerProject,
        description
    } as ProjectsModelInterface;

    updatedProject = await projectDbUpdate({
        project: Projects,
        projectId,
        projectUpdateValues: ownerProject
    });
    return updatedProject;
};
