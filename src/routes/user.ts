import express from "express";

import { loginController, registerController } from "../controller";
import {
    validateLoginInputs,
    validateRegistrationInputs
} from "../middlewares";

const router = express.Router();

router.post("/register", validateRegistrationInputs, registerController);
router.post("/login", validateLoginInputs, loginController);

export default router;
