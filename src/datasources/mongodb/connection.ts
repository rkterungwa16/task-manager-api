import * as dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";

import { databaseConfig } from "../../constants";
import { createAppLogger } from "../../middlewares/logger";

dotenv.config();

const databaseConnectionStartup = createAppLogger(
    "Database connection startup"
).log({
    level: "info",
    message: "Mongodb connection started"
});

export const connect = (): Connection => {
    const env = process.env.NODE_ENV as string;
    mongoose.connect(databaseConfig[env].databaseUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    return mongoose.connection.once("open", () => {
        databaseConnectionStartup.log({
            level: "info",
            message: "database successfully connected"
        });
    });
};
