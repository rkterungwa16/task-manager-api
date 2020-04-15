import validator from "validator";
import { CustomError, error } from "../../services";

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
