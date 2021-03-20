import { isEmail, isAlphanumeric, hasMinLength } from "./helpers";
import { validate } from "./validator";

export const requiredRegistrationInputs = {
    password: {
        isAlphanumeric,
        hasMinLength
    },
    email: {
        isEmail
    },
    name: {
        isAlphanumeric
    }
};

export const validateRegistrationInputs = validate(requiredRegistrationInputs);
