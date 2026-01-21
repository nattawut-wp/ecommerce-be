import orderModel from "../models/orderModel.js";
import { RESPONSE_MESSAGES } from "../utills/constants.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

// currency
const currency = "thb";
// delivery charge
const deliveryCharge = 10;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// place order stripe service
const placeOrderStripeService = async (
  userId,
  items,
  amount,
  address,
  origin
) => {
  try {
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false, // ยังไม่ชำระเงิน
      date: Date.now(),
    };

    //  save order to database
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // create line items for Stripe (convert products to Stripe format)
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe uses cents (x100)
      },
      quantity: item.quantity,
    }));

    //  add delivery charge to line item
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100, // Stripe uses cents (x100)
      },
      quantity: 1,
    });

    // create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    return { orderId: newOrder._id, sessionUrl: session.url };
  } catch (error) {
    throw error;
  }
};

// verify stripe payment and update order status
const verifyStripeService = async (orderId, success, userId) => {
  try {
    if (success === "true") {
      // 1. update payment status in order
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      // 2. clear user cart
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return { verified: true };
    } else {
      // cancel payment
      // delete order
      await orderModel.findByIdAndDelete(orderId);
      return { verified: false };
    }
  } catch (error) {
    throw error;
  }
};

// get all orders for admin
const allOrdersService = async () => {
  try {
    const orders = await orderModel.find({});
    return orders;
  } catch (error) {
    throw error;
  }
};

// get user orders for user
const userOrdersService = async (userId) => {
  try {
    const orders = await orderModel.find({ userId });
    return orders;
  } catch (error) {
    throw error;
  }
};

// update order status for admin
const updateOrderStatusService = async (orderId, status) => {
  try {
    // 1. find order
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error(RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }
    // 2. update order status
    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

// get stripe dashboard stats
const getStripeDashboardStats = async () => {
  try {
    // 1. get available balance from stripe ดึงยอดเงินคงเหลือจาก stripe
    const balance = await stripe.balance.retrieve();
    const availableBalance = balance.available[0].amount / 100; // convert to baht แปลงเป็นบาท

    // 2. calculate total sales from orders that have been paid คำนวณยอดขายรวมจากคำสั่งซื้อที่ชำระเงินแล้ว
    const orders = await orderModel.find({ payment: true });
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

    // 3. count number of orders that are pending (not sent) นับจำนวนคำสั่งซื้อที่ยังไม่ส่ง
    const pendingOrders = await orderModel.countDocuments({
      status: { $ne: "Delivered" },
    });

    return {
      totalSales,
      availableBalance,
      pendingOrders,
      totalOrders: orders.length,
    };
  } catch (error) {
    throw error;
  }
};

export {
  placeOrderStripeService,
  verifyStripeService,
  allOrdersService,
  userOrdersService,
  updateOrderStatusService,
  getStripeDashboardStats,
};
