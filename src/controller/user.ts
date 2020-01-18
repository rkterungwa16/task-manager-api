import { NextFunction, Response } from "express";
import { Document } from "mongoose";

import { authenticateUser, createUser } from "../services";
import { IRequest } from "../types";
import { UsersModelInterface } from "../types";

export const registerControllerDefinition = (
    registerUser: (credentials: UsersModelInterface) => Promise<Document>
) => {
    return async (req: IRequest, res: Response, next: NextFunction) => {
        try {
            const userInfo = {
                password: req.body.password as string,
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
    createUser
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
