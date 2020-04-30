import { NextFunction, Response } from "express";
import { ObjectId } from "mongodb";
import { Document } from "mongoose";

import {
    authenticateUser,
    createUser,
    editUser,
    UserEditFieldsInterface
} from "../services";
import { IRequest } from "../types";
import {
    AuthenticatedUserCredentialInterface,
    CreatedUserCredentialInterface,
    UsersModelInterface
} from "../types";

export const registerControllerDefinition = (
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
            const createdUser = await registerUser(userInfo) as Document;
            const createdUserModified = createdUser.toObject();
            delete createdUserModified.password;
            delete createdUserModified.salt;
            return res.status(201).send({
                message: "user successfully created",
                data: createdUserModified
            });
        } catch (err) {
            next(err);
        }
    };
};

export const registerController = registerControllerDefinition(createUser);

export const loginControllerDefinition = (
    loginUser: (
        credentials: AuthenticatedUserCredentialInterface
    ) => Promise<string>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const token = await loginUser(req.body);
            return res.status(201).send({
                message: "user successfully logged in",
                data: {
                    token
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const loginController = loginControllerDefinition(authenticateUser);

export const editUserControllerDefinition = (
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
            return res.status(200).send({
                message: "user successfull edited",
                data: {
                    user
                }
            });
        } catch (err) {
            next(err);
        }
    };
};

export const editUserController = editUserControllerDefinition(editUser);
