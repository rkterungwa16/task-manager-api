import { NextFunction, Request, Response } from "express";
import { CustomError } from "../../services";

export interface RequiredPropertiesInterface {
    [x: string]: {
        type: string;
        validateMethod: (
            prop: any,
            validationError: (
                statusCode: number,
                message: string,
                name: string
            ) => CustomError
        ) => boolean;
    };
}

export const validate = (
    validationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError,
    requiredProperties?: RequiredPropertiesInterface
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestBody = req.body as { [x: string]: any };
        if (!Object.entries(requestBody).length) {
            throw validationError(
                400,
                "inputs must not be empty",
                "Input Validation Error"
            )
        }
        // flexible fields. If it contains email or password validate properly
        if (requiredProperties) {
            const listOfRequiredProperties = Object.keys(requiredProperties);
            for (const prop of listOfRequiredProperties) {
                if (!requestBody[prop]) {
                    throw validationError(
                        400,
                        `${prop} must not be empty`,
                        "Input Validation Error"
                    );
                }
                requiredProperties[prop].validateMethod(
                    requestBody[prop],
                    validationError
                );
            }
        }

        next();
    };
};
