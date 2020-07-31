import express from "express";

import {
    createTaskController,
    viewProjectTasksController,
    viewTodaysTasksController
} from "../controller";
import { authenticateMiddleware } from "../middlewares";

const router = express.Router();

router
    .route("/tasks/today")
    .get(authenticateMiddleware, viewTodaysTasksController);

router
    .route("/tasks/:projectId")
    .post(authenticateMiddleware, createTaskController)
    .get(authenticateMiddleware, viewProjectTasksController);

router
    .route("/task/:taskId/project/:projectId")
    .get(authenticateMiddleware)
    .put(authenticateMiddleware);

export default router;
