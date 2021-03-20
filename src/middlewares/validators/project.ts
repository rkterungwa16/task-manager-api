import { isAlphanumeric } from "./helpers";
import { validate } from "./validator";

export const requiredProjectInputs = {
    title: {
        isAlphanumeric
    }
};

export const validateProjectInputs = validate(requiredProjectInputs);
