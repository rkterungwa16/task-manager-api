import express from "express";

import {
  addCollaboratorsController,
  // archiveProjectController,
  createProjectController,
  editProjectController,
  fetchOwnerProjectsController,
  fetchOwnerProjectController
} from "../controller";
import { authenticateMiddleware, validateProjectInputs } from "../middlewares";

const router = express.Router();

router
  .route("/projects")
  .get(authenticateMiddleware, fetchOwnerProjectsController)
  .post(authenticateMiddleware, validateProjectInputs, createProjectController);

router
  .route("/projects/:projectId")
  .get(authenticateMiddleware, fetchOwnerProjectController)
  .put(authenticateMiddleware, editProjectController);

router
  .route("/projects/:projectId/add/collaborators")
  .put(authenticateMiddleware, addCollaboratorsController);

// router
//     .route("/projects/:projectId/archive")
//     .put(authenticateMiddleware, archiveProjectController);

export default router;
