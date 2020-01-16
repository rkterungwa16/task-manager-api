import { Document, Model } from "mongoose";

import { CustomError, error } from ".";
import { Users } from "../models";
import { UsersModelInterface } from "../types";

import { signJwt } from "./jwt";
import { comparePassword } from "./password";

export interface CreateUserParameterInterface {
    user: Model<Document>;
    createUserError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
    findUserByEmail: (email: string) => Promise<boolean | Document>;
}

// TODO: split into two for testing purpose 1: findUserByEmailDefinition 2: findUserByEmail
export const findUserByEmail = ((
    user: Model<Document>
): ((email: string) => Promise<boolean | UsersModelInterface>) => {
    return async (email: string) => {
        const userExists = await user.findOne({ email });
        if (!userExists) {
            return false;
        }
        return userExists as UsersModelInterface;
    };
})(Users);

export const createUser = ((
    createUserArgs: CreateUserParameterInterface
): ((credentials: UsersModelInterface) => Promise<Document>) => {
    return async (credentials: UsersModelInterface) => {
        const userExists = await createUserArgs.findUserByEmail(
            credentials.email
        );
        if (!userExists) {
            return await createUserArgs.user.create(credentials);
        }
        throw createUserArgs.createUserError(
            400,
            "User Already Exists",
            "User Registration"
        );
    };
})({ user: Users, createUserError: error, findUserByEmail });

export interface AuthenticationCredentialsInterface {
    email: string;
    password: string;
}

export interface AuthenticationParameterInterface {
    authenticateUserError: (
        statusCode: number,
        message: string,
        name: string
    ) => CustomError;
    findUser: (email: string) => Promise<boolean | UsersModelInterface>;
    compareUserPassword: (
        providedPassword: string,
        storedPassword: string
    ) => Promise<boolean>;
    signToken: (
        email: string,
        id: string,
        expiryDuration: string | number
    ) => Promise<string>;
}

export const authenticateUser = ((
    authenticationArgs: AuthenticationParameterInterface
) => {
    return async (credentials: AuthenticationCredentialsInterface) => {
        const {
            findUser,
            authenticateUserError,
            compareUserPassword,
            signToken
        } = authenticationArgs;
        const userExists = (await findUser(
            credentials.email
        )) as UsersModelInterface;
        if (!userExists) {
            throw authenticateUserError(
                400,
                "User Does not Exist",
                "User Authentication"
            );
        }

        const passwordMatched = await compareUserPassword(
            credentials.password,
            userExists.password
        );

        if (!passwordMatched) {
            throw authenticateUserError(
                400,
                "wrong password",
                "User Authentication"
            );
        }

        return await signToken(userExists.email, userExists._id, "24h");
    };
})({
    compareUserPassword: comparePassword,
    signToken: signJwt,
    authenticateUserError: error,
    findUser: findUserByEmail
});
