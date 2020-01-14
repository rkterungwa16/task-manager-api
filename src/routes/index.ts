import express from "express";

import projectRouter from "./project";
import userRouter from "./user";

const router = express.Router();

router.use("/api/v1", userRouter);
router.use("/api/v1", projectRouter);

export default router;
