import { Document, Model } from "mongoose";

import { error } from '.';
import { Users } from '../models';
import { UsersModelInterface } from '../types';

export const createUser = ((
    user: Model<Document>,
    createUserError: (statusCode: number, message: string, name: string) => void
    ): (credentials: UsersModelInterface) => Promise<Document> => {
    return async (credentials: UsersModelInterface) => {
        const userExists = await findUserByEmail(credentials.email);
        if (!userExists) {
            return await user.create(credentials);
        }
        throw createUserError(400, 'User Already Exists', 'User Registration');
    }
})(Users, error);

export const findUserByEmail = ((
    user: Model<Document>
): (email: string) => Promise<boolean | Document> => {
    return async (email: string) => {
        const userExists = await user.findOne({ email });
        if (!userExists) {
            return false;
        }
        return userExists;
    }
})(Users);
