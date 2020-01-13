import express from "express";

import { login, register } from "../controller";
import {
    validateLoginInputs,
    validateRegistrationInputs
} from "../middlewares";

const router = express.Router();

router.post("/register", validateRegistrationInputs, register);
router.post("/login", validateLoginInputs, login);

export default router;
