import userRouter from "./user";

import express from "express";

const router = express.Router();

router.use("/api/v1", userRouter);

export default router;
