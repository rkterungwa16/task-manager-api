import express from "express";

import { viewProjectColorsController } from "../controller";
import { authenticateMiddleware } from "../middlewares";

const router = express.Router();

router
    .route("/colors")
    .get(authenticateMiddleware, viewProjectColorsController);

export default router;
