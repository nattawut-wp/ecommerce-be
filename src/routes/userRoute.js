import express from "express";
import {
  registerUserController,
  loginUserController,
  verifyAdminController,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
userRouter.post("/admin", verifyAdminController);

export default userRouter;
