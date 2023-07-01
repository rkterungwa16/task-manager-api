import { ObjectId } from "mongodb";
import { Document, Model } from "mongoose";
import { CustomError, error } from "../..";
import { Users } from "../../../models";
import { UsersModelInterface } from "../../../types";
import { hashPassword, saltPassword } from "../../password";

export interface UserEditFieldsInterface {
  userId: ObjectId;
  name?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
}

export interface EditUserParameterInterface {
  user: Model<Document>;
  editUserError: (
    statusCode: number,
    message: string,
    name: string
  ) => CustomError;
  hashPassword: (password: string, salt: string) => Promise<string>;
  saltPassword: () => Promise<string>;
}

export const editUserDefinition = (
  editUserArgs: EditUserParameterInterface
): ((credentials: UserEditFieldsInterface) => Promise<Document>) => {
  return async (credentials: UserEditFieldsInterface) => {
    try {
      const salt = await editUserArgs.saltPassword();
      const { userId } = credentials;
      if (credentials.password || credentials.confirmPassword) {
        if (credentials.confirmEmail !== credentials.email) {
          editUserArgs.editUserError(400, "Email must match", "User Edit");
        }
      }

      if (credentials.email || credentials.confirmEmail) {
        if (credentials.confirmPassword !== credentials.password) {
          editUserArgs.editUserError(400, "Password must match", "User Edit");
        }
      }
      const updateDetails = {
        ...(credentials.name && { name: credentials.name }),
        ...(credentials.email && { email: credentials.email }),
        ...(credentials.password && {
          password: await editUserArgs.hashPassword(credentials.password, salt)
        })
      };

      let user = (await editUserArgs.user.findByIdAndUpdate(
        userId,
        { ...updateDetails },
        { new: true }
      )) as UsersModelInterface;
      user = user.toObject();
      delete user.password;
      delete user.salt;
      return user;
    } catch (err) {
      throw err;
    }
  };
};

export const editUser = editUserDefinition({
  user: Users,
  editUserError: error,
  hashPassword,
  saltPassword
});
