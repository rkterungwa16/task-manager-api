import express from "express";

import {
  editUserController,
  loginController,
  registerController
} from "../controller";
import {
  authenticateMiddleware,
  validateLoginInputs,
  validateRegistrationInputs
} from "../middlewares";

const router = express.Router();

router.post("/register", registerController);
router.post("/login", validateLoginInputs, loginController);
router.route("/users").put(authenticateMiddleware, editUserController);

export default router;
