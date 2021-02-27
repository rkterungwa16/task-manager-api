import { NextFunction, Request, Response } from "express";
import { error } from "../../services";

export interface RequiredPropertiesInterface {
    [x: string]: {
        type: string;
        validateMethod: (prop: any) => boolean;
    };
}

export const validate = (requiredProperties?: RequiredPropertiesInterface) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestBody = req.body as { [x: string]: any };
        if (!Object.entries(requestBody).length) {
            throw error(
                400,
                "inputs must not be empty",
                "Input Validation Error"
            );
        }
        // flexible fields. If it contains email or password validate properly
        if (requiredProperties) {
            const listOfRequiredProperties = Object.keys(requiredProperties);
            for (const prop of listOfRequiredProperties) {
                if (!requestBody[prop]) {
                    throw error(
                        400,
                        `${prop} must not be empty`,
                        "Input Validation Error"
                    );
                }
                requiredProperties[prop].validateMethod(requestBody[prop]);
            }
        }
        next();
    };
};
