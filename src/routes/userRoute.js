import express from "express";
import {
  registerUserController,
  loginUserController,
  verifyAdminController,
} from "../controllers/userController.js";

const userRouter = express.Router();
// user routes
userRouter.post("/register", registerUserController);
userRouter.post("/login", loginUserController);
// admin routes
userRouter.post("/admin", verifyAdminController);

export default userRouter;
