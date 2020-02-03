import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";
import { CustomError, error, } from "../..";
import { Users } from "../../../models";
import { UsersModelInterface } from "../../../types";
import {
    hashPassword,
    saltPassword
} from "../../password";

export interface UserEditFieldsInterface {
    userId: ObjectId;
    name?: string;
    email?: string;
    password?: string;
    collaborationInviteStatus?: "pending" | "declined" | "accepted";
    resetPasswordToken?: string;
    favoriteProject: ObjectId;
}

export interface EditUserParameterInterface {
    user: Model<Document>;
    editUserError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
    modifyProjectFavorite: (
        projects: ObjectId[],
        project: ObjectId
    ) => ObjectId[];
    hashPassword: (password: string, salt: string) => Promise<string>;
    saltPassword: () => Promise<string>
}

export const editUserDefinition = (
    editUserArgs: EditUserParameterInterface
): ((credentials: UserEditFieldsInterface) => Promise<Document>) => {
    return async (credentials: UserEditFieldsInterface) => {

        try {
            const salt = await editUserArgs.saltPassword();
            const { userId } = credentials;
            const userDetails = await editUserArgs.user.findById(userId) as UsersModelInterface;
            delete credentials.userId;
            const updateDetails = {
                ...(credentials.name && { name: credentials.name }),
                ...(credentials.email && { email: credentials.email }),
                ...(credentials.password && {
                    password: await editUserArgs.hashPassword(credentials.password, salt)
                }),
                ...(credentials.password && {
                    salt
                }),
                ...(credentials.resetPasswordToken && {
                    resetPasswordToken: credentials.resetPasswordToken
                }),
                ...(credentials.collaborationInviteStatus && {
                    collaborationInviteStatus: credentials.collaborationInviteStatus
                }),
                ...(credentials.favoriteProject && {
                    favoriteProjects: modifyFavorites(userDetails.favoriteProjects, credentials.favoriteProject)
                })
            };

            let user = (await editUserArgs.user
                .findByIdAndUpdate(
                    userId,
                    {  ...updateDetails },
                    { new: true }
                )
                .populate("favoriteProjects", "-password -salt")
                .exec()) as UsersModelInterface;
            user = user.toObject();
            delete user.password;
            delete user.salt;
            return user;
        } catch (err) {
            throw editUserArgs.editUserError(
                400,
                "User Edit was not successful",
                "User Edit"
            );
        }
    };
}

export const modifyFavorites = (
    projects: ObjectId[],
    project: ObjectId
): ObjectId[] => {
    const isFavorite = projects.includes(project);
    if (isFavorite) {
        return projects.filter((id) => id !== project);
    }
    return [...projects, project];
}

export const editUser = editUserDefinition({
    user: Users,
    editUserError: error,
    modifyProjectFavorite: modifyFavorites,
    hashPassword,
    saltPassword
});
