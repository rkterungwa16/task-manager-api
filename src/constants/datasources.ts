import * as dotenv from "dotenv";
dotenv.config();
export interface DatabaseConfigInterface {
    [x: string]: {
        databaseUri: string;
    };
    production: {
        databaseUri: string;
    };
    development: {
        databaseUri: string;
    };
    test: {
        databaseUri: string;
    };
}

export const databaseConfig: DatabaseConfigInterface = {
    production: {
        databaseUri: process.env.PROD_DATABASE_URI as string
    },
    development: {
        databaseUri: process.env.DEV_DATABASE_URI as string
    },
    test: {
        databaseUri: process.env.TEST_DATABASE_URI as string
    }
};
