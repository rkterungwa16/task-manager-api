import { validateEmail, validatePassword } from "./helpers";
import { validate } from "./validator";

export const requiredLoginInputs = {
    password: {
        type: "password",
        validateMethod: validatePassword
    },
    email: {
        type: "email",
        validateMethod: validateEmail
    }
};

export const validateLoginInputs = validate(requiredLoginInputs);
