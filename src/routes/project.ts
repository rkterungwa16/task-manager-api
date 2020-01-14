import express from "express";

import {
    createProjectController,
    viewOwnerProjectsController,
    viewSingleOwnerProjectController
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

router
    .route("/project/:projectId")
    .get(authenticateMiddleware, viewSingleOwnerProjectController);

export default router;
