import * as dotenv from "dotenv";
import { createAppLogger } from "./middlewares";
import { init } from "./server";

dotenv.config();
init().listen(3300);
createAppLogger("Task Manager Start up").log({
    level: "info",
    message: `Application is starting at port 3300`
});
