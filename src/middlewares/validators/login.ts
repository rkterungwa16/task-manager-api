import { error } from "../../services"
import { validateEmail, validatePassword } from "./helpers";
import { validate } from "./validator";

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

export const validateLoginInputs = validate(error, requiredLoginInputs);
