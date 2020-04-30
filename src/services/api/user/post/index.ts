import { Document } from "mongoose";

import { error } from "../../..";
import { Users } from "../../../../models";
import {
    AuthenticatedUserCredentialInterface,
    CreatedUserCredentialInterface,
    UsersModelInterface
} from "../../../../types";
import { hashPassword, saltPassword } from "../../../password";

import { signJwt } from "../../../jwt";
import { comparePassword } from "../../../password";

import { matchPassword, userWithEmailShouldExist, userWithEmailShouldNotExist } from "./helpers";
import { AuthenticationParameterInterface, CreateUserParameterInterface } from "./interfaces";

// Write a story of what is happening here. Use story as inspiration for naming functions.
export const createUserDefinition = (
    createUserArgs: CreateUserParameterInterface
): ((credentials: CreatedUserCredentialInterface) => Promise<Document | undefined>) => {
    return async (credentials: CreatedUserCredentialInterface) => {
        try {
            await createUserArgs.userDoesNotExist(
                credentials.email as string
            );
            const salt = await createUserArgs.saltPassword();
            const hashedPassword = await createUserArgs.hashPassword(
                credentials.password as string,
                salt
            );
            return await createUserArgs.user.create({
                ...credentials,
                salt,
                password: hashedPassword
            });
        } catch (error) {
            throw error;
        }
    };
};

export const userExist = userWithEmailShouldExist(Users);
export const userDoesNotExist = userWithEmailShouldNotExist(Users);

export const createUser = createUserDefinition({
    user: Users,
    createUserError: error,
    userDoesNotExist,
    hashPassword,
    saltPassword
});

export const authenticateUserDefinition = (
    authenticationArgs: AuthenticationParameterInterface
) => {
    return async (credentials: AuthenticatedUserCredentialInterface) => {
        try {
            const {
                existingUser,
                authenticateUserError,
                matchPassword: passwordIsMatched,
                signToken
            } = authenticationArgs;
            const user = await existingUser(
                credentials.email
            ) as UsersModelInterface;

            await passwordIsMatched(
                credentials.password,
                user.password as string
            );

            return await signToken(
                {
                    name: user.name,
                    email: user.email,
                    id: user._id
                },
                "24h"
            );
        } catch (error) {
            throw error;
        }
    };
};

export const authenticateUser = authenticateUserDefinition({
    matchPassword,
    signToken: signJwt,
    authenticateUserError: error,
    existingUser: userExist
});
