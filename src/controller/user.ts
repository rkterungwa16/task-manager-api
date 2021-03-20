import { NextFunction, Response } from "express";
import { Document } from "mongoose";

import {
    authenticateUser,
    createUser,
    editUser,
    UserEditFieldsInterface,
    apiResponse
} from "../services";
import { IRequest } from "../types";
import {
    AuthenticatedUserCredentialInterface,
    CreatedUserCredentialInterface,
    UsersModelInterface
} from "../types";

export const registerControllerFactory = (
    registerUser: (
        credentials: CreatedUserCredentialInterface
    ) => Promise<Document | undefined>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const userInfo = {
                password: req.body.password as string,
                email: req.body.email as string,
                name: req.body.name as string
            } as CreatedUserCredentialInterface;
            const createdUser = (await registerUser(userInfo)) as Document;
            const createdUserModified = createdUser.toObject();
            delete createdUserModified.password;
            delete createdUserModified.salt;
            return apiResponse({
                message: "user successfully created",
                data: createdUserModified,
                statusCode: 201,
                response: res
            });
        } catch (err) {
            next(err);
        }
    };
};

export const registerController = registerControllerFactory(createUser);

export const loginControllerFactory = (
    loginUser: (
        credentials: AuthenticatedUserCredentialInterface
    ) => Promise<string>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const token = await loginUser(req.body);
            return apiResponse({
                message: "user successfully logged in",
                data: {
                    token
                },
                statusCode: 201,
                response: res
            });
        } catch (err) {
            next(err);
        }
    };
};

export const loginController = loginControllerFactory(authenticateUser);

export const editUserControllerFactory = (
    userEditor: (
        editUserControllerArgs: UserEditFieldsInterface
    ) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const { id } = req.currentUser as UsersModelInterface;
            const user = await userEditor({
                ...req.body,
                userId: id
            });
            return apiResponse({
                message: "user successfull edited",
                data: {
                    user
                },
                statusCode: 200,
                response: res
            });
        } catch (err) {
            next(err);
        }
    };
};

export const editUserController = editUserControllerFactory(editUser);
