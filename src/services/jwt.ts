import { sign } from 'jsonwebtoken';
import { jwtSecret } from '../constants';


export const signJwt = async (email: string, id: string): Promise<string> => {
    const token = await sign( { email, id },
        jwtSecret as string,
        { expiresIn: "24h" }
    );
    return token;
}
