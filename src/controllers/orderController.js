import {
  placeOrderStripeService,
  verifyStripeService,
  allOrdersService,
  userOrdersService,
  updateOrderStatusService,
  getStripeDashboardStats,
} from "../services/orderService.js";
import { validateOrderInput } from "../validators/orderValidator.js";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../utils/constants.js";

const placeOrderStripe = async (req, res) => {
  try {
    // 1. get data from request
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const origin =
      req.headers.origin || req.headers.referer || "http://localhost:3000";

    // 2. Validate required data
    const validation = validateOrderInput(userId, items, amount, address);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.errors[0],
      });
    }

    // 3. call service to create order
    const { orderId, sessionUrl } = await placeOrderStripeService(
      userId,
      items,
      amount,
      address,
      origin,
    );

    // 4. Return success with session URL
    res.json({ success: true, orderId, session_url: sessionUrl });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: error.message || RESPONSE_MESSAGES.ORDER_NOT_FOUND,
    });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;

  try {
    // 1. check required data
    if (!orderId || !userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: RESPONSE_MESSAGES.ORDER_ID_REQUIRED,
      });
    }
    // verify stripe
    const result = await verifyStripeService(orderId, success, userId);

    res.json({ success: result.verified });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.NOT_FOUND).json({
      success: false,
      message: RESPONSE_MESSAGES.ORDER_NOT_FOUND,
    });
  }
};

// user orders
const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: RESPONSE_MESSAGES.ORDER_ID_REQUIRED,
      });
    }

    const orders = await userOrdersService(userId);

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

// all orders
const allOrders = async (req, res) => {
  try {
    const orders = await allOrdersService();

    res.status(HTTP_STATUS.OK).json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

// update status
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: RESPONSE_MESSAGES.ORDER_ID_REQUIRED,
      });
    }

    const result = await updateOrderStatusService(orderId, status);

    res.status(HTTP_STATUS.OK).json({ success: true, message: result.message });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

// get stripe stats for admin
const getStripeStats = async (req, res) => {
  try {
    const stats = await getStripeDashboardStats();
    res.status(HTTP_STATUS.OK).json({ success: true, stats });
  } catch (error) {
    console.log(error);
    res
      .status(HTTP_STATUS.NOT_FOUND)
      .json({ success: false, message: error.message });
  }
};

export {
  verifyStripe,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  getStripeStats,
};
