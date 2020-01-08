import { Document, Model } from "mongoose";

import { CustomError, error } from ".";
import { Users } from "../models";
import { UsersModelInterface } from "../types";

export interface CreateUserParameterInterface {
    user: Model<Document>;
    createUserError: (statusCode: number, message: string, name: string) => CustomError;
    findUserByEmail: (email: string) => Promise<boolean | Document>
}

export const findUserByEmail = ((
    user: Model<Document>
): ((email: string) => Promise<boolean | Document>) => {
    return async (email: string) => {
        const userExists = await user.findOne({ email });
        if (!userExists) {
            return false;
        }
        return userExists;
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
})({user: Users, createUserError: error, findUserByEmail});

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
