import { isEmail, isAlphanumeric, hasMinLength } from "./helpers";
import { validate } from "./validator";

export const requiredLoginInputs = {
    password: {
        isAlphanumeric,
        hasMinLength
    },
    email: {
        isEmail
    }
};

export const validateLoginInputs = validate(requiredLoginInputs);
