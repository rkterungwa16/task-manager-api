import { NextFunction, Request, Response } from "express";
import { error } from "../../services";

export interface RequiredPropertiesInterface {
    [x: string]: {
        [x: string]: (prop: any) => boolean;
    };
}

/**
 *
 * @param requiredProperties describes the properties to be validated
 * these properties must exist in the request body.
 * @returns
 */
export const validate = (requiredProperties: RequiredPropertiesInterface) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // 1. make sure all required properties exist on the request body
        //   - if any one does not exist throw an error
        // 2. when all required properties are confirmed validate with the required method.
        //    - A property can have more than one validation methods
        //    - password validation: check if password is alphanumeric, check if length is greater than 6
        const requestBody = req.body as { [x: string]: any };
        // flexible fields. If it contains email or password validate properly
        const listOfRequiredProperties = Object.keys(requiredProperties);
            for (const prop of listOfRequiredProperties) {
                if (!requestBody[prop]) {
                    throw error(
                        400,
                        `${prop} must not be empty`,
                        "Input Validation Error"
                    );
                }
                Object.keys(requiredProperties[prop]).forEach((validationMethod) => {
                    requiredProperties[prop][validationMethod]({
                        prop: requestBody[prop],
                        minLength: 6
                    });
                });
            }
        next();
    };
};
