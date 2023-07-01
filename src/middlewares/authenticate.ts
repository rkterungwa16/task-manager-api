import { NextFunction, Response } from "express";
import { error, verifyJwt } from "../services";
import { IRequest, UsersModelInterface } from "../types";

export const authenticateMiddlewareDefinition = (
  verifyToken: (token: string) => Promise<UsersModelInterface>
) => {
  return async (
    req: IRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.headers.authorization) {
        throw error(401, "No Authorization properties", "Authentication");
      }
      let token = req.headers.authorization;
      if (!token.startsWith("Bearer ")) {
        throw error(401, "Token string not valid", "Authentication");
      }

      token = token.slice(7, token.length);

      // TODO: should throw error for expired token
      const user = await verifyToken(token);
      req.currentUser = user;
      next();
    } catch (err) {
      next(error(401, "Not Authorized!", "Authentication"));
    }
  };
};

export const authenticateMiddleware = authenticateMiddlewareDefinition(
  verifyJwt
);
