import express from "express";
import {
  addProductController,
  listProductsController,
  getProductByIdController,
  deleteProductController,
} from "../controllers/productController.js";
import upload from "../middlewares/multer.js";
import { authAdmin } from "../middlewares/authMiddleware.js";

const productRouter = express.Router();
//User Routes
productRouter.get("/list", listProductsController);
productRouter.get("/:id", getProductByIdController);

//Admin Routes
productRouter.post(
  "/add",
  authAdmin,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
  addProductController
);
productRouter.delete("/:id", authAdmin, deleteProductController);

export default productRouter;
