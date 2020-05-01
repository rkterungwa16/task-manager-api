import { Document, Model } from "mongoose";

import { error } from "../../..";
import { UsersModelInterface } from "../../../../types";
import { comparePassword } from "../../../password";

export const userWithEmailShouldExist = (
    user: Model<Document>
): ((email: string) => Promise<UsersModelInterface>) => {
    return async (email: string) => {
        const hasUser = await user.findOne({ email });
        if (!hasUser) {
            throw error(400, "User Does not Exist", "User Authentication");
        }
        return hasUser as UsersModelInterface;
    };
};

export const userWithEmailShouldNotExist = (
    user: Model<Document>
): ((email: string) => Promise<boolean>) => {
    return async (email: string) => {
        const hasUser = await user.findOne({ email });
        if (hasUser) {
            throw error(400, "User Already Exists", "User Registration");
        }
        return true;
    };
};

export const matchPasswordDefinition = (
    compareUserPassword: (
        providedPassword: string,
        storedPassword: string
    ) => Promise<boolean>
) => {
    return async (
        credentialPassword: string,
        userPassword: string
    ): Promise<boolean> => {
        const passwordMatched = await compareUserPassword(
            credentialPassword,
            userPassword as string
        );
        if (!passwordMatched) {
            throw error(400, "wrong password", "User Authentication");
        }
        return true;
    };
};

export const matchPassword = matchPasswordDefinition(comparePassword);
