import { sign, verify } from "jsonwebtoken";
import { jwtSecret } from "../constants";

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
): Promise<JwtTokenContentInterface> => {
    return (await verify(token, jwtSecret)) as JwtTokenContentInterface;
};
