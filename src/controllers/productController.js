import {
  addProductService,
  listProductsService,
  getProductByIdService,
  deleteProductService,
} from "../services/productService.js";
import { HTTP_STATUS } from "../utills/constants.js";
import { validateProductInput } from "../validators/productValidator.js";

const addProductController = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes } = req.body;
    const validation = validateProductInput(
      name,
      description,
      price,
      category,
      subCategory,
      sizes
    );

    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        errors: validation.errors,
      });
    }

    let images = [];
    if (req.files) {
      const { image1, image2, image3, image4 } = req.files;
      images = [image1, image2, image3, image4]
        .filter((item) => item !== undefined)
        .map((item) => item[0]);
    }

    const product = await addProductService(req.body, images);

    res.status(HTTP_STATUS.CREATED).json({ success: true, product });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

const listProductsController = async (req, res) => {
  try {
    const products = await listProductsService();

    res.status(HTTP_STATUS.OK).json(products);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const getProductByIdController = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    res.status(HTTP_STATUS.OK).json(product);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const product = await deleteProductService(req.params.id);

    res.status(HTTP_STATUS.OK).json({ success: true, product });
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ success: false, message: error.message });
  }
};

export {
  addProductController,
  listProductsController,
  getProductByIdController,
  deleteProductController,
};
