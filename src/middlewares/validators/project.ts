import { error } from "../../services";
import { validateString } from "./helpers";
import { validate } from "./validator";

const requiredProjectInputs = {
    title: {
        type: "text",
        validateMethod: validateString
    }
};

export const validateProjectInputs = validate(requiredProjectInputs);
