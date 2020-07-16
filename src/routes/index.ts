import express from "express";

import projectRouter from "./project";
import userRouter from "./user";
import taskRouter from "./task";

const router = express.Router();

router.use("/api/v1", userRouter);
router.use("/api/v1", projectRouter);
router.use("/api/v1", taskRouter);

export default router;
