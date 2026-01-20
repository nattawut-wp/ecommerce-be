import {
  placeOrderStripeService,
  verifyStripeService,
  allOrdersService,
  userOrdersService,
  updateOrderStatusService,
  getStripeDashboardStats,
} from "../services/orderService.js";
import { validateOrderInput } from "../validators/orderValidator.js";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../utills/constants.js";

const placeOrderStripe = async (req, res) => {
  try {
    // 1. ดึงข้อมูลจาก request
    const { items, amount, address } = req.body;
    const userId = req.userId;
    const origin =
      req.headers.origin || req.headers.referer || "http://localhost:3000";

    // 2. Validate ข้อมูลที่จำเป็น
    const validation = validateOrderInput(userId, items, amount, address);
    if (!validation.isValid) {
      return res.json({ success: false, message: validation.errors[0] });
    }

    // 3. เรียก Service เพื่อสร้างคำสั่งซื้อ
    const { orderId, sessionUrl } = await placeOrderStripeService(
      userId,
      items,
      amount,
      address,
      origin
    );

    // 4. Return success พร้อม session URL
    res.json({ success: true, orderId, session_url: sessionUrl });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message || RESPONSE_MESSAGES.ORDER_NOT_FOUND,
    });
  }
};

const verifyStripe = async (req, res) => {
  const { orderId, success } = req.body;
  const userId = req.userId;

  try {
    // 1. ตรวจสอบข้อมูลที่จำเป็น
    if (!orderId || !userId) {
      return res.json({
        success: false,
        message: RESPONSE_MESSAGES.ORDER_ID_REQUIRED,
      });
    }

    const result = await verifyStripeService(orderId, success, userId);

    res.json({ success: result.verified });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

const userOrders = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.json({
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

const allOrders = async (req, res) => {
  try {
    const orders = await allOrdersService();

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    if (!orderId || !status) {
      return res.json({
        success: false,
        message: RESPONSE_MESSAGES.ORDER_ID_REQUIRED,
      });
    }

    const result = await updateOrderStatusService(orderId, status);

    res.json({ success: true, message: result.message });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: RESPONSE_MESSAGES.ORDER_NOT_FOUND });
  }
};

const getStripeStats = async (req, res) => {
  try {
    const stats = await getStripeDashboardStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
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
