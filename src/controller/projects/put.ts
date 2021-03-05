import { NextFunction, Response } from "express";

import { editProject, apiResponse, addCollaborators } from "../../services";
import { IRequest, UsersModelInterface } from "../../types";

// export interface EditProjectArgsInterface {
//     owner: ObjectId;
//     projectId: ObjectId;
// }
// export interface AddCollaboratorsArgsInterface
//     extends EditProjectArgsInterface {
//     collaboratorEmail: string;
// }
export const addCollaboratorsController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const { collaboratorsEmails } = req.body;
        const project = await addCollaborators(
            {
                collaboratorsEmails
            },
            projectId,
            id
        );

        return apiResponse({
            message: "user successfully added to project as collaborator",
            data: {
                project
            },
            response: res,
            statusCode: 200
        });
    } catch (err) {
        next(err);
    }
};

// export interface EditArgsInterface extends EditProjectArgsInterface {
//     description: string;
//     favourite: boolean;
//     title: string;
//     color: string;
// }
export const editProjectController = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const { id: ownerId } = req.currentUser as UsersModelInterface;
        const { projectId } = req.params;
        const project = await editProject(
            { ...req.body },
            { projectId, ownerId }
        );

        return apiResponse({
            message: "user successfully edited project description",
            data: {
                project
            },
            statusCode: 200,
            response: res
        });
    } catch (err) {
        next(err);
    }
};

// export interface ArchiveProjectArgsInterface extends EditProjectArgsInterface {
//     title: string;
// }
// export const archiveProjectController = async (
//     req: IRequest,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const { id } = req.currentUser as UsersModelInterface;
//         const { projectId } = req.params;
//         const project = await updateProject(
//             req.body as any,
//             projectId,
//             id,
//             "archiveProject",
//             "isArchived"
//         );
//         return apiResponse({
//             message: "project is successfully archived",
//             data: {
//                 project
//             },
//             statusCode: 200,
//             response: res
//         });
//     } catch (err) {
//         next(err);
//     }
// };
