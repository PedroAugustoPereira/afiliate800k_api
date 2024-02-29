import express from "express";

import authController from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { createUserSchema, loginUserSchema } from "../schema/user.schema";

const authRoute = express.Router();

authRoute.post(
  "/register",
  validate(createUserSchema),
  authController.register
);

authRoute.post("/login", validate(loginUserSchema), authController.login);

export default authRoute;
