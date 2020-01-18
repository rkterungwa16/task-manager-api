import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { CustomError, error } from "../services";

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
    requiredProperties: RequiredPropertiesInterface,
    validationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const requestBody = req.body as { [x: string]: any };
        const propertiesToValidate = requiredProperties;
        const listOfRequiredProperties = Object.keys(propertiesToValidate);
        const listOfRequestBodyProperties = Object.keys(requestBody);
        for (const prop of listOfRequiredProperties) {
            if (!listOfRequestBodyProperties.includes(prop)) {
                throw validationError(
                    400,
                    `${prop} is missing`,
                    "Input Validation Error"
                );
            }

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

        const requestBodyHasAllRequiredProps = listOfRequiredProperties.every(
            prop => {
                return listOfRequestBodyProperties.includes(prop);
            }
        );

        if (!requestBodyHasAllRequiredProps) {
            throw new Error("a required property is missing");
        }
        next();
    };
};

export const validateEmail = (
    email: string,
    emailValidationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError
): boolean => {
    if (!validator.isEmail(email)) {
        throw emailValidationError(
            400,
            "User has an invalid email",
            "Input Validation Error"
        );
    }
    return true;
};

export const validatePassword = (
    password: string,
    passwordValidationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError
): boolean => {
    if (password.length < 6) {
        throw passwordValidationError(
            400,
            "Password length must be greater than or equal to 6",
            "Input Validation Error"
        );
    }
    return true;
};

export const validateString = (
    prop: string,
    stringValidationError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError
): boolean => {
    if (!validator.isAscii(prop)) {
        throw stringValidationError(
            400,
            "Value must be a string",
            "Input Validation Error"
        );
    }
    return true;
};

const requiredLoginInputs = {
    password: {
        type: "password",
        validateMethod: validatePassword
    },
    email: {
        type: "email",
        validateMethod: validateEmail
    }
};

const requiredRegistrationInputs = {
    password: {
        type: "password",
        validateMethod: validatePassword
    },
    email: {
        type: "email",
        validateMethod: validateEmail
    },
    name: {
        type: "text",
        validateMethod: validateString
    }
};

const requiredProjectInputs = {
    name: {
        type: "text",
        validateMethod: validateString
    }
};

export const validateLoginInputs = validate(requiredLoginInputs, error);
export const validateRegistrationInputs = validate(
    requiredRegistrationInputs,
    error
);
export const validateProjectInputs = validate(requiredProjectInputs, error);

const requiredAddCollaboratorInputs = {
    projectId: {
        type: "text",
        validateMethod: validateString
    },
    collaboratorEmail: {
        type: "email",
        validateMethod: validateEmail
    }
};

export const validateAddCollaboratorInputs = validate(
    requiredAddCollaboratorInputs,
    error
);
