import { Document, Model } from "mongoose";
import { CustomError } from "../../..";
import { UsersModelInterface } from "../../../../types";

export interface CreateUserParameterInterface {
  user: Model<Document>;
  userDoesNotExist: (email: string) => Promise<boolean>;
  hashPassword: (password: string, salt: string) => Promise<string>;
  saltPassword: () => Promise<string>;
}

export interface AuthenticationParameterInterface {
  existingUser: (email: string) => Promise<UsersModelInterface>;
  matchPassword: (
    providedPassword: string,
    storedPassword: string
  ) => Promise<boolean>;
  signToken: (
    tokenDetails: any,
    expiryDuration: string | number
  ) => Promise<string>;
}
