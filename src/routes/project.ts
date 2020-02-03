import express from "express";

import {
    addUserAsCollaboratorController,
    createProjectController,
    viewOwnerProjectsController,
    viewSingleOwnerProjectController
} from "../controller";
import {
    authenticateMiddleware,
    validateAddCollaboratorInputs,
    validateProjectInputs
} from "../middlewares";

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
    .route("/project/:projectId")
    .get(authenticateMiddleware, viewSingleOwnerProjectController);

router
    .route("/project/collaborator")
    .put(
        authenticateMiddleware,
        validateAddCollaboratorInputs,
        addUserAsCollaboratorController
    );

export default router;
