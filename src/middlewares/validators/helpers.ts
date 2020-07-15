import validator from "validator";
import { error } from "../../services";

export const validateEmail = (email: string): boolean => {
    if (!validator.isEmail(email)) {
        throw error(400, "User has an invalid email", "Input Validation Error");
    }
    return true;
};

export const validatePassword = (password: string): boolean => {
    if (password.length < 6) {
        throw error(
            400,
            "Password length must be greater than or equal to 6",
            "Input Validation Error"
        );
    }
    return true;
};

export const validateString = (prop: any): boolean => {
    if (typeof prop !== 'string') {
        throw error(400, `${prop} must be a string`, "Input Validation Error");
    }
    return true;
};
