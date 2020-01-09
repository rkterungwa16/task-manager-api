import { Document, Model } from "mongoose";

import { CustomError, error } from ".";
import { Users } from "../models";
import { UsersModelInterface } from "../types";

import { signJwt } from './jwt';
import { comparePassword } from './password';

export interface CreateUserParameterInterface {
    user: Model<Document>;
    createUserError: (statusCode: number, message: string, name: string) => CustomError;
    findUserByEmail: (email: string) => Promise<boolean | Document>;
}

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
        const userExists = await createUserArgs.findUserByEmail(credentials.email);
        if (!userExists) {
            return await createUserArgs.user.create(credentials);
        }
        throw createUserArgs.createUserError(400, "User Already Exists", "User Registration");
    };
})({ user: Users, createUserError: error, findUserByEmail });

export interface AuthenticationCredentialsInterface {
    email: string;
    password: string;
}

export interface AuthenticationParameterInterface {
    authenticateUserError: (
        statusCode: number,
        message: string, name: string
    ) => CustomError;
    findUser: (email: string) => Promise<boolean | UsersModelInterface>;
    compareUserPassword: (
        providedPassword: string,
        storedPassword: string
    ) => Promise<boolean>;
    signToken: (email: string, id: string) => Promise<string>;
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
        } = authenticationArgs
        const userExists = await findUser(credentials.email) as UsersModelInterface;
        if (!userExists) {
            throw authenticateUserError(400, "User Does not Exist", "User Authentication");;
        }

        const passwordMatched = await compareUserPassword(
            credentials.password,
            userExists.password
        );

        if (!passwordMatched) {
            throw authenticateUserError(400, "wrong password", "User Authentication");
        }

        return await signToken(userExists.email, userExists.id);
    }
})({
    compareUserPassword: comparePassword,
    signToken: signJwt,
    authenticateUserError: error,
    findUser: findUserByEmail
});

// export const = findAndGenerateToken = (credentials: {
//     email: string;
//     password: string;
// }): Promise<string> => {
//     const foundUser = await this.findOne({
//         email: credentials.email
//     });

//     if (!foundUser) {
//         throw new ClubManagerError({
//             message: "User does not exist",
//             name: "User Login",
//             statusCode: 400
//         });
//     }

//     const passwordMatched = await this.passwordHashService.comparePassword(
//         credentials.password,
//         foundUser.password
//     );

//     if (!passwordMatched) {
//         throw new ClubManagerError({
//             message: "wrong password",
//             name: "User login",
//             statusCode: 400
//         });
//     }

//     const token = await sign(
//         {
//             email: foundUser.email,
//             id: foundUser.id
//         },
//         this.jwtSecret,
//         { expiresIn: "24h" }
//     );

//     return token;
// }
