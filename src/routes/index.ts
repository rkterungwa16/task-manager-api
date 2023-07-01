import express from "express";

import projectRouter from "./project";
import userRouter from "./user";
import taskRouter from "./task";
import colorRouter from "./color";

const router = express.Router();

router.use("/api/v1", userRouter);
router.use("/api/v1", projectRouter);
router.use("/api/v1", taskRouter);
router.use("/api/v1", colorRouter);

export default router;
