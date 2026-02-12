import userModel from "../models/userModel.js";
import { RESPONSE_MESSAGES } from "../utils/constants.js";

// get user's cart data
const getCartService = async (userId) => {
  try {
    // find user from database
    const userData = await userModel.findById(userId);
    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    return userData.cartData;
  } catch (error) {
    throw error;
  }
};

// add item to cart
const addToCartService = async (userId, itemId, size) => {
  try {
    // 1. find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. get cartData or create empty object if not exists
    let cartData = userData.cartData || {};

    // 3. check and add item
    if (cartData[itemId]) {
      // item already exists
      if (cartData[itemId][size]) {
        // size already exists -> increment quantity
        cartData[itemId][size] += 1;
      } else {
        // size does not exist -> create new
        cartData[itemId][size] = 1;
      }
    } else {
      // item does not exist -> create new
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // 4. save changes
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.ADDED_TO_CART };
  } catch (error) {
    throw error;
  }
};

// update cart item quantity
const updateCartService = async (userId, itemId, size, quantity) => {
  try {
    // 1. find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. get cartData or create empty object if not exists
    let cartData = userData.cartData || {};

    // 3. set quantity (SET not ADD)
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = quantity;

    // 4. save changes
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.CART_UPDATED };
  } catch (error) {
    throw error;
  }
};

//delete item from cart
const deleteFromCartService = async (userId, itemId, size) => {
  try {
    // 1. find user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. get cartData
    let cartData = userData.cartData || {};

    // 3. delete item from cart
    if (cartData[itemId] && cartData[itemId][size]) {
      // delete size
      delete cartData[itemId][size];

      // if item has no other sizes, delete the item
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    // 4. save changes
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.CART_CLEARED };
  } catch (error) {
    throw error;
  }
};

export {
  getCartService,
  addToCartService,
  updateCartService,
  deleteFromCartService,
};
