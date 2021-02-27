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

import {
    matchPassword,
    confirmUserWithEmailExists,
    comfirmUserWithEmailDoesNotExist
} from "./helpers";
import {
    AuthenticationParameterInterface,
    CreateUserParameterInterface
} from "./interfaces";

// Write a story of what is happening here. Use story as inspiration for naming functions.
export const createUserDefinition = (
    createUserArgs: CreateUserParameterInterface
): ((
    credentials: CreatedUserCredentialInterface
) => Promise<Document | undefined>) => {
    return async (credentials: CreatedUserCredentialInterface) => {
        try {
            // Make sure the user is not yet registered
            // If user exists throw an error
            // If User does not exist throw an error
            await createUserArgs.userDoesNotExist(credentials.email as string);

            // Create salt for users password
            // Hash users password with the salt
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

export const confirmUserExist = confirmUserWithEmailExists(Users);
export const confirmUserDoesNotExist = comfirmUserWithEmailDoesNotExist(Users);

export const createUser = createUserDefinition({
    user: Users,
    userDoesNotExist: confirmUserDoesNotExist,
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
                matchPassword: passwordIsMatched,
                signToken
            } = authenticationArgs;
            const user = (await existingUser(
                credentials.email
            )) as UsersModelInterface;

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
    existingUser: confirmUserExist
});
