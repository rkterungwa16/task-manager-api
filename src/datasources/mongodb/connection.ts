import mongoose, { Connection } from "mongoose";

import { databaseConfig } from "../../constants";
import { createAppLogger } from "../../middlewares/logger";

const databaseConnectionStartup = createAppLogger(
    "Database connection startup"
).log({
    level: "info",
    message: "Mongodb connection started"
});

const env = process.env.NODE_ENV || "development";

export const connect = (): Connection => {
    mongoose.connect(
        databaseConfig[env].databaseUri || "mongodb://localhost:27017/task-manager",
        { useNewUrlParser: true }
    );

    return mongoose.connection.once("open", () => {
        databaseConnectionStartup.log({
            level: "info",
            message: "database successfully connected"
        });
    });
};
