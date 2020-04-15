import { error } from "../../services";
import { validateEmail, validatePassword, validateString } from "./helpers";
import { validate } from "./validator";

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

export const validateRegistrationInputs = validate(
    error,
    requiredRegistrationInputs
);
