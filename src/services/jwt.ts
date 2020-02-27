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
    const token = await sign(tokenDetails, jwtSecret as string, {
        expiresIn: expiryDuration
    });
    return token;
};

export const verifyJwtDefinition = (
    jwtError: (statusCode: number, message: string, name: string) => CustomError
) => {
    return async (token: string): Promise<UsersModelInterface> => {
        try {
            return (await verify(token, jwtSecret)) as UsersModelInterface;
        } catch (err) {
            throw jwtError(400, "Invalid token", "Jwt");
        }
    };
};

export const verifyJwt = verifyJwtDefinition(error);
