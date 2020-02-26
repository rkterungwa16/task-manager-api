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

export const validateLoginInputs = validate(error, requiredLoginInputs);
export const validateRegistrationInputs = validate(
    error,
    requiredRegistrationInputs,
);
export const validateProjectInputs = validate(error, requiredProjectInputs);

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
    error,
    requiredAddCollaboratorInputs
);

export const validateUserEditInputs = validate(error);
