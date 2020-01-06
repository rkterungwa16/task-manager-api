import { NextFunction, Response } from "express";
import { IRequest } from "../types";

export const register = async (
    req: IRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        return res.status(201).send({
            message: "user successfully created",
            data: { name: "Richard" }
        });
    } catch (err) {
        next(err);
    }
};
