
import { Document, Model } from "mongoose";
import { CustomError } from "../../..";
import {
    UsersModelInterface
} from "../../../../types";

export interface CreateUserParameterInterface {
    user: Model<Document>;
    createUserError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
    userDoesNotExist: (email: string) => Promise<boolean>;
    hashPassword: (password: string, salt: string) => Promise<string>;
    saltPassword: () => Promise<string>;
}

export interface AuthenticationParameterInterface {
    authenticateUserError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
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
