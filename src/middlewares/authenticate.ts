import { NextFunction, Request, Response } from "express";
import {
    CustomError,
    error,
    JwtTokenContentInterface,
    verifyJwt
} from "../services";
import { IRequest } from "../types";

export const authenticate = (
    verifyToken: (token: string) => Promise<JwtTokenContentInterface>,
    authenticationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError
) => {
    return async (
        req: IRequest,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        try {
            let token = req.query.access_token || req.headers.authorization;
            if (!token) {
                throw authenticationError(
                    400,
                    "No access token Found",
                    "Authentication"
                );
            }

            if (token.startsWith("Bearer ")) {
                token = token.slice(7, token.length);
            }
            const user = await verifyToken(token);
            req.currentUser = user;
            next();
        } catch (err) {
            next(authenticationError(401, "Not Authorized!", "Authentication"));
        }
    };
};
