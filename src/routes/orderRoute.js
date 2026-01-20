import express from "express";
import {
  verifyStripe,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  getStripeStats,
} from "../controllers/orderController.js";
import { authAdmin, authUser } from "../middlewares/authMiddleware.js";

const orderRouter = express.Router();

orderRouter.post("/place-order-stripe", authUser, placeOrderStripe);
orderRouter.post("/verify-stripe", authUser, verifyStripe);
orderRouter.get("/user-orders", authUser, userOrders);
orderRouter.get("/all-orders", authAdmin, allOrders);
orderRouter.get("/stripe-stats", authAdmin, getStripeStats);
orderRouter.post("/update-status", authAdmin, updateStatus);

export default orderRouter;
