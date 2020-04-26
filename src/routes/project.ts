import express from "express";

import {
    addCollaboratorsController,
    archiveProjectController,
    createProjectController,
    editDescriptionController,
    editTitleController,
    setProjectAsFavouriteController,
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
    .get(authenticateMiddleware, viewSingleOwnerProjectController);

router
    .route("/projects/:projectId/collaborators/add")
    .put(authenticateMiddleware, addCollaboratorsController);

router
    .route("/projects/:projectId/description")
    .put(authenticateMiddleware, editDescriptionController);

router
    .route("/projects/:projectId/title")
    .put(authenticateMiddleware, editTitleController);

router
    .route("/projects/:projectId/favourite")
    .put(authenticateMiddleware, setProjectAsFavouriteController);

router
    .route("/projects/:projectId/archive")
    .put(authenticateMiddleware, archiveProjectController);

export default router;
