import { sign, verify } from "jsonwebtoken";
import { jwtSecret } from "../constants";
import { UsersModelInterface } from "../types";

export interface JwtTokenContentInterface {
    email: string;
    id: string;
}

export const signJwt = async (email: string, id: string): Promise<string> => {
    const token = await sign({ email, id }, jwtSecret as string, {
        expiresIn: "24h"
    });
    return token;
};

export const verifyJwt = async (
    token: string
): Promise<UsersModelInterface> => {
    return (await verify(token, jwtSecret)) as UsersModelInterface;
};
