import { sign, verify } from "jsonwebtoken";
import { jwtSecret } from "../constants";
import { UsersModelInterface } from "../types";
import { CustomError, error } from "./";

export interface JwtTokenContentInterface {
    email: string;
    id: string;
}

export const signJwt = async (
    tokenDetails: any,
    expiryDuration: string | number
): Promise<string> => {
    try {
        return await sign(tokenDetails, jwtSecret as string, {
            expiresIn: expiryDuration
        });
    } catch (err) {
        throw error(400, err.message, err.name);
    }
};

export const verifyJwt = async (
    token: string
): Promise<UsersModelInterface> => {
    try {
        return (await verify(token, jwtSecret)) as UsersModelInterface;
    } catch (err) {
        throw error(400, err.message, err.name);
    }
};
