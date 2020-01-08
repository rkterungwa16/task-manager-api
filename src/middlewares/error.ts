import { NextFunction, Response } from "express";
import { CustomError } from "../services";
import { IRequest } from "../types";

export const apiErrorHandler = (
    err: CustomError,
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    const response = {
        code: err.statusCode,
        message: err.message
    };

    res.status(err.statusCode);
    res.send(response);
};
