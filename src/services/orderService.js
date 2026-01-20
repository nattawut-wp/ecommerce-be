import orderModel from "../models/orderModel.js";
import { RESPONSE_MESSAGES } from "../utills/constants.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

/**
 * ตัวแปร Global สำหรับการตั้งค่า
 * Global configuration variables
 */
// สกุลเงินที่ใช้ในระบบ (บาท)
const currency = "thb";
// ค่าจัดส่ง (บาท)
const deliveryCharge = 10;

/**
 * Stripe Gateway Instance
 * สร้าง instance ของ Stripe สำหรับการชำระเงิน
 * ใช้ Secret Key จาก environment variables
 */
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * สร้างคำสั่งซื้อและ Stripe Checkout Session
 * Create order and Stripe checkout session
 *
 * หน้าที่:
 * 1. สร้างคำสั่งซื้อในฐานข้อมูล (สถานะ payment: false)
 * 2. สร้าง line items สำหรับ Stripe (สินค้า + ค่าจัดส่ง)
 * 3. สร้าง Stripe Checkout Session
 * 4. Return Order ID และ Session URL
 *
 * วิธีการทำงาน:
 * - บันทึกข้อมูลคำสั่งซื้อก่อน (payment = false)
 * - สร้าง Stripe session พร้อม success/cancel URLs
 * - ถ้า user ชำระเงินสำเร็จ: จะ redirect ไป success_url
 * - ถ้า user ยกเลิก: จะ redirect ไป cancel_url
 *
 * @param {string} userId - ID ของผู้สั่งซื้อ
 * @param {Array<Object>} items - สินค้าในคำสั่งซื้อ
 * @param {number} amount - ยอดเงินรวม
 * @param {Object} address - ที่อยู่จัดส่ง
 * @param {string} origin - Frontend URL (สำหรับ redirect URLs)
 * @returns {Promise<Object>} { orderId, sessionUrl }
 * @throws {Error} ถ้าสร้างคำสั่งซื้อหรือ session ล้มเหลว
 */
const placeOrderStripeService = async (
  userId,
  items,
  amount,
  address,
  origin
) => {
  try {
    // 1. เตรียมข้อมูลคำสั่งซื้อ
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false, // ยังไม่ชำระเงิน
      date: Date.now(),
    };

    // 2. บันทึกคำสั่งซื้อลง database
    const newOrder = new orderModel(orderData);
    await newOrder.save();

    // 3. สร้าง line items สำหรับ Stripe (แปลงสินค้าเป็น format ของ Stripe)
    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100, // Stripe ใช้หน่วยสตางค์ (x100)
      },
      quantity: item.quantity,
    }));

    // 4. เพิ่มค่าจัดส่งเป็น line item
    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: deliveryCharge * 100, // แปลงเป็นสตางค์
      },
      quantity: 1,
    });

    // 5. สร้าง Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    // 6. Return Order ID และ Session URL สำหรับ redirect
    return { orderId: newOrder._id, sessionUrl: session.url };
  } catch (error) {
    throw error;
  }
};

/**
 * ตรวจสอบและอัพเดตสถานะการชำระเงินผ่าน Stripe
 * Verify Stripe payment and update order status
 *
 * หน้าที่:
 * - ถ้าชำระเงินสำเร็จ: อัพเดต payment = true และล้างตะกร้าสินค้า
 * - ถ้ายกเลิก: ลบคำสั่งซื้อออกจากระบบ
 *
 * @param {string} orderId - ID ของคำสั่งซื้อ
 * @param {string} success - "true" = สำเร็จ, "false" = ยกเลิก
 * @param {string} userId - ID ของผู้ใช้งาน
 * @returns {Promise<Object>} { verified: boolean }
 * @throws {Error} ถ้าอัพเดตล้มเหลว
 */
const verifyStripeService = async (orderId, success, userId) => {
  try {
    if (success === "true") {
      // ชำระเงินสำเร็จ
      // 1. อัพเดตสถานะการชำระเงินในคำสั่งซื้อ
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      // 2. ล้างตะกร้าสินค้าของ user
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      return { verified: true };
    } else {
      // ยกเลิกการชำระเงิน
      // ลบคำสั่งซื้อที่ยังไม่ชำระเงินออก
      await orderModel.findByIdAndDelete(orderId);
      return { verified: false };
    }
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงคำสั่งซื้อทั้งหมดในระบบ (สำหรับ Admin)
 * Get all orders for admin panel
 *
 * @returns {Promise<Array>} Array ของคำสั่งซื้อทั้งหมด
 * @throws {Error} ถ้าดึงข้อมูลล้มเหลว
 */
const allOrdersService = async () => {
  try {
    const orders = await orderModel.find({});
    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงคำสั่งซื้อของ user คนหนึ่ง (สำหรับ User)
 * Get orders for a specific user
 *
 * @param {string} userId - ID ของผู้ใช้
 * @returns {Promise<Array>} Array ของคำสั่งซื้อของ user
 * @throws {Error} ถ้าดึงข้อมูลล้มเหลว
 */
const userOrdersService = async (userId) => {
  try {
    const orders = await orderModel.find({ userId });
    return orders;
  } catch (error) {
    throw error;
  }
};

/**
 * อัพเดตสถานะคำสั่งซื้อ (สำหรับ Admin)
 * Update order status for admin
 *
 * สถานะที่เป็นไปได้:
 * - "Order Placed" = สั่งซื้อแล้ว
 * - "Packing" = กำลังบรรจุ
 * - "Shipped" = จัดส่งแล้ว
 * - "Out for delivery" = กำลังจัดส่ง
 * - "Delivered" = ส่งถึงแล้ว
 *
 * @param {string} orderId - ID ของคำสั่งซื้อ
 * @param {string} status - สถานะใหม่
 * @returns {Promise<Object>} คำสั่งซื้อที่อัพเดตแล้ว
 * @throws {Error} ถ้าไม่พบคำสั่งซื้อหรืออัพเดตล้มเหลว
 */
const updateOrderStatusService = async (orderId, status) => {
  try {
    // 1. ค้นหาคำสั่งซื้อ
    const order = await orderModel.findById(orderId);
    if (!order) {
      throw new Error(RESPONSE_MESSAGES.ORDER_NOT_FOUND);
    }
    // 2. อัพเดตสถานะ
    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงข้อมูลสถิติสำหรับ Dashboard
 * Get dashboard stats (Total sales, Balance, etc.)
 *
 * @returns {Promise<Object>} ข้อมูลสถิติ
 */
const getStripeDashboardStats = async () => {
  try {
    // 1. ดึงยอดเงินคงเหลือจาก Stripe
    const balance = await stripe.balance.retrieve();
    const availableBalance = balance.available[0].amount / 100; // แปลงเป็นบาท

    // 2. คำนวณยอดขายรวมจากคำสั่งซื้อที่ชำระเงินแล้วในระบบ
    const orders = await orderModel.find({ payment: true });
    const totalSales = orders.reduce((sum, order) => sum + order.amount, 0);

    // 3. นับจำนวนคำสั่งซื้อที่รอดำเนินการ (ยังไม่ส่ง)
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
