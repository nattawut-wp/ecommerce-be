import express from "express";
import { authUser } from "../middlewares/authMiddleware.js";
import {
  getCartController,
  addToCartController,
  updateCartController,
  deleteFromCartController,
} from "../controllers/cartController.js";

const cartRouter = express.Router();
// cart routes
cartRouter.get("/get-cart", authUser, getCartController);
cartRouter.post("/add-cart", authUser, addToCartController);
cartRouter.post("/update-cart", authUser, updateCartController);
cartRouter.delete("/delete-cart", authUser, deleteFromCartController);

export default cartRouter;
