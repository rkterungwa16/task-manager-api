import { validateString } from "./helpers";
import { validate } from "./validator";

export const requiredProjectInputs = {
    title: {
        type: "text",
        validateMethod: validateString
    }
};

export const validateProjectInputs = validate(requiredProjectInputs);
