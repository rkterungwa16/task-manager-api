import validator from "validator";
import { error } from "../../services";

interface Props<T> {
  prop: T;
  minLength?: number;
}

export const isEmail = (props: Props<string>): boolean => {
  if (!validator.isEmail(props.prop)) {
    throw error(400, "User has an invalid email", "Input Validation Error");
  }
  return true;
};

export const isAlphanumeric = (props: Props<string>): boolean => {
  if (!validator.isAlphanumeric(props.prop)) {
    throw error(400, "must be alphanumeric", "Input Validation Error");
  }
  return true;
};

export const hasMinLength = (props: Props<string>): boolean => {
  if (!validator.isLength(props.prop, { min: props.minLength })) {
    throw error(
      400,
      "length must be greater than or equal to 6",
      "Input Validation Error"
    );
  }

  return true;
};
