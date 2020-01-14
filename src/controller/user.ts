import { NextFunction, Response } from "express";
import { Document } from "mongoose";

import { authenticateUser, createUser } from "../services";
import * as password from "../services";
import { IRequest } from "../types";
import { UsersModelInterface } from "../types";

export const registerControllerDefinition = (
    registerUser: (credentials: UsersModelInterface) => Promise<Document>,
    hashPassword: (password: string, salt: string) => Promise<string>,
    saltPassword: () => Promise<string>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const salt = await saltPassword();
            const hashedPassword = await hashPassword(req.body.password, salt);
            const userInfo = {
                salt,
                password: hashedPassword,
                email: req.body.email as string,
                name: req.body.name as string
            } as UsersModelInterface;
            const createdUser = await registerUser(userInfo);
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

export const registerController = registerControllerDefinition(
    createUser,
    password.hashPassword,
    password.saltPassword
);

export const loginControllerDefinition = (
    loginUser: (credentials: UsersModelInterface) => Promise<string>
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
