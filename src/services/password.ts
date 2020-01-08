import { genSalt, hash } from "bcryptjs";
import { compare } from "bcryptjs";

export const rounds = 10;

export const hashPassword = async (
    password: string,
    salt: string
): Promise<string> => {
    return await hash(password, salt);
};

export const saltPassword = async (): Promise<string> => {
    return await genSalt(rounds);
};

export const comparePassword = (
    providedPass: string,
    storedPass: string
): Promise<boolean> => {
    const passwordIsMatched = compare(providedPass, storedPass);
    return passwordIsMatched;
};
