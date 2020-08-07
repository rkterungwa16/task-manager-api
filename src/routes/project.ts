import express from "express";

import {
    addCollaboratorsController,
    archiveProjectController,
    createProjectController,
    editController,
    viewOwnerProjectsController,
    viewSingleOwnerProjectController
} from "../controller";
import { authenticateMiddleware, validateProjectInputs } from "../middlewares";

const router = express.Router();

router
    .route("/projects")
    .get(authenticateMiddleware, viewOwnerProjectsController)
    .post(
        authenticateMiddleware,
        validateProjectInputs,
        createProjectController
    );

router
    .route("/projects/:projectId")
    .get(authenticateMiddleware, viewSingleOwnerProjectController)
    .put(authenticateMiddleware, editController);

router
    .route("/projects/:projectId/collaborators/add")
    .put(authenticateMiddleware, addCollaboratorsController);

router
    .route("/projects/:projectId/archive")
    .put(authenticateMiddleware, archiveProjectController);

export default router;
