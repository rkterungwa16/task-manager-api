import express from "express";

import {
  createTaskController,
  viewProjectTasksController,
  viewTodaysTasksController,
  viewUsersOverDueTasksController,
  editTaskController
} from "../controller";
import { authenticateMiddleware } from "../middlewares";

const router = express.Router();

router
  .route("/tasks/today")
  .get(authenticateMiddleware, viewTodaysTasksController);

router
  .route("/tasks/overdue")
  .get(authenticateMiddleware, viewUsersOverDueTasksController);

router
  .route("/tasks/:projectId")
  .post(authenticateMiddleware, createTaskController)
  .get(authenticateMiddleware, viewProjectTasksController);

router
  .route("/task/:taskId/project/:projectId")
  .get(authenticateMiddleware)
  .put(authenticateMiddleware, editTaskController);

export default router;
