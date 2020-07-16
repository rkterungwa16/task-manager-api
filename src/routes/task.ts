import express from "express";

import {
    createTaskController
} from "../controller";
import { authenticateMiddleware } from "../middlewares";

const router = express.Router();

router
    .route("/tasks/:projectId")
    .post(
        authenticateMiddleware,
        createTaskController
    );

router
    .route("/task/:taskId/project/:projectId")
    .get(authenticateMiddleware)
    .put(authenticateMiddleware)

export default router;
