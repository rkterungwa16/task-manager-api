import express from "express";

import { register } from "../controller";
import { validateRegistrationInputs } from "../middlewares";

const router = express.Router();

router.post("/register", validateRegistrationInputs, register);

export default router;
