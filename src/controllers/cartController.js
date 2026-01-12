import {
  getCartService,
  addToCartService,
  updateCartService,
  deleteFromCartService,
} from "../services/cartService.js";

import {
  validateCartInput,
  validateUpdateCartInput,
} from "../validators/cartValidator.js";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../utills/constants.js";

const getCartController = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res
        .status(HTTP_STATUS.BAD_REQUEST)
        .json({ message: RESPONSE_MESSAGES.USER_ID_REQUIRED });
    }
    const cart = await getCartService(userId);
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const addToCartController = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;
    const validation = validateCartInput(userId, itemId, size);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation });
    }
    const cart = await addToCartService(userId, itemId, size);
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const updateCartController = async (req, res) => {
  try {
    const { itemId, size, quantity } = req.body;
    const userId = req.userId;
    const validation = validateUpdateCartInput(userId, itemId, size, quantity);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation });
    }
    const cart = await updateCartService(userId, itemId, size, quantity);
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

const deleteFromCartController = async (req, res) => {
  try {
    const { itemId, size } = req.body;
    const userId = req.userId;
    const validation = validateCartInput(userId, itemId, size);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: validation });
    }
    const cart = await deleteFromCartService(userId, itemId, size);
    res.status(HTTP_STATUS.OK).json(cart);
  } catch (error) {
    res
      .status(HTTP_STATUS.INTERNAL_SERVER_ERROR)
      .json({ message: error.message });
  }
};

export {
  getCartController,
  addToCartController,
  updateCartController,
  deleteFromCartController,
};
