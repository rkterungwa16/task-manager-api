import express from "express";

import {
    createProjectController,
    viewOwnerProjectsController
} from "../controller";
import { authenticateMiddleware, validateProjectInputs } from "../middlewares";

const router = express.Router();

router
    .route("/projects")
    .get(authenticateMiddleware, viewOwnerProjectsController)
    .post(
        validateProjectInputs,
        authenticateMiddleware,
        createProjectController
    );

export default router;
