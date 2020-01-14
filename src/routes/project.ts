import express from "express";

import { createProjectController } from "../controller";
import { authenticateMiddleware, validateProjectInputs } from "../middlewares";

const router = express.Router();

router
    .route("/projects")
    .post(
        validateProjectInputs,
        authenticateMiddleware,
        createProjectController
    );

export default router;
