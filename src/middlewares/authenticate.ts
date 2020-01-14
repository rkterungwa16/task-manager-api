import { NextFunction, Response } from "express";
import { CustomError, error, verifyJwt } from "../services";
import { IRequest, UsersModelInterface } from "../types";

export const authenticateMiddlewareDefinition = (
    verifyToken: (token: string) => Promise<UsersModelInterface>,
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
            // TODO: should throw error for expired token
            const user = await verifyToken(token);
            req.currentUser = user;
            next();
        } catch (err) {
            next(authenticationError(401, "Not Authorized!", "Authentication"));
        }
    };
};

export const authenticateMiddleware = authenticateMiddlewareDefinition(
    verifyJwt,
    error
);
