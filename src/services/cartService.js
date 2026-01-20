/**
 * Cart Service Module
 * โมดูล Service สำหรับจัดการ Business Logic ของตะกร้าสินค้า
 *
 * หน้าที่หลัก:
 * - ดึงข้อมูลตะกร้าสินค้าของ user
 * - เพิ่มสินค้าเข้าตะกร้า
 * - อัพเดตจำนวนสินค้าในตะกร้า
 * - ลบสินค้าออกจากตะกร้า
 *
 * โครงสร้างข้อมูล cartData:
 * {
 *   "productId1": { "S": 2, "M": 1 },
 *   "productId2": { "L": 3 }
 * }
 * เก็บเป็น nested object โดย key แรกคือ itemId, key ที่สองคือ size, value คือจำนวน
 */
import userModel from "../models/userModel.js";
import { RESPONSE_MESSAGES } from "../utills/constants.js";

/**
 * ดึงข้อมูลตะกร้าสินค้าของ user
 * Get user's cart data
 *
 * หน้าที่:
 * - ค้นหา user จาก userId
 * - Return cartData object
 *
 * @param {string} userId - ID ของผู้ใช้
 * @returns {Promise<Object>} cartData object
 * @throws {Error} ถ้าไม่พบ user
 */
const getCartService = async (userId) => {
  try {
    // ค้นหา user จาก database
    const userData = await userModel.findById(userId);
    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }
    // Return ข้อมูลตะกร้าสินค้า
    return userData.cartData;
  } catch (error) {
    throw error;
  }
};

/**
 * เพิ่มสินค้าเข้าตะกร้า
 * Add item to cart
 *
 * หน้าที่:
 * - ตรวจสอบว่าสินค้ามีในตะกร้าแล้วหรือไม่
 * - ถ้ามีแล้ว: เพิ่มจำนวน +1
 * - ถ้ายังไม่มี: สร้าง entry ใหม่และตั้งจำนวนเป็น 1
 * - บันทึกการเปลี่ยนแปลงลง database
 *
 * Logic:
 * - cartData[itemId][size] += 1 (ถ้ามีอยู่แล้ว)
 * - cartData[itemId][size] = 1 (ถ้ายังไม่มี)
 *
 * @param {string} userId - ID ของผู้ใช้
 * @param {string} itemId - ID ของสินค้า
 * @param {string} size - ขนาดที่เลือก (S, M, L, etc.)
 * @returns {Promise<Object>} { message: "Added To Cart" }
 * @throws {Error} ถ้าไม่พบ user
 */
const addToCartService = async (userId, itemId, size) => {
  try {
    // 1. ค้นหา user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. ดึง cartData หรือสร้าง empty object ถ้ายังไม่มี
    let cartData = userData.cartData || {};

    // 3. ตรวจสอบและเพิ่มสินค้า
    if (cartData[itemId]) {
      // สินค้านี้มีในตะกร้าแล้ว
      if (cartData[itemId][size]) {
        // ขนาดนี้มีอยู่แล้ว -> เพิ่มจำนวน
        cartData[itemId][size] += 1;
      } else {
        // ขนาดนี้ยังไม่มี -> สร้างใหม่
        cartData[itemId][size] = 1;
      }
    } else {
      // สินค้านี้ยังไม่มีในตะกร้า -> สร้างใหม่ทั้งหมด
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    // 4. บันทึกการเปลี่ยนแปลง
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.ADDED_TO_CART };
  } catch (error) {
    throw error;
  }
};

/**
 * อัพเดตจำนวนสินค้าในตะกร้า
 * Update cart item quantity
 *
 * หน้าที่:
 * - ตั้งค่าจำนวนสินค้าในตะกร้าตามที่กำหนด
 * - ถ้ามีอยู่แล้ว: ตั้งค่าจำนวนใหม่ตามที่ระบุ
 * - ถ้ายังไม่มี: สร้างใหม่และตั้งจำนวนตามที่ระบุ
 *
 * @param {string} userId - ID ของผู้ใช้
 * @param {string} itemId - ID ของสินค้า
 * @param {string} size - ขนาดที่เลือก
 * @param {number} quantity - จำนวนที่ต้องการตั้งค่า (ค่าใหม่ไม่ใช่ค่าที่ต้องการเพิ่ม/ลด)
 * @returns {Promise<Object>} { message: "Cart Updated" }
 * @throws {Error} ถ้าไม่พบ user
 */
const updateCartService = async (userId, itemId, size, quantity) => {
  try {
    // 1. ค้นหา user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. ดึง cartData
    let cartData = userData.cartData || {};

    // 3. ตั้งค่าจำนวน (SET ไม่ใช่ ADD)
    if (!cartData[itemId]) {
      cartData[itemId] = {};
    }
    cartData[itemId][size] = quantity;

    // 4. บันทึกการเปลี่ยนแปลง
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.CART_UPDATED };
  } catch (error) {
    throw error;
  }
};

/**
 * ลบสินค้าออกจากตะกร้า
 * Delete item from cart
 *
 * หน้าที่:
 * - ลบสินค้า (ตาม size ที่ระบุ) ออกจากตะกร้าทั้งหมด
 * - ถ้าสินค้า itemId ไม่มี size อื่นเหลือ ให้ลบ itemId ออกด้วย
 *
 * @param {string} userId - ID ของผู้ใช้
 * @param {string} itemId - ID ของสินค้า
 * @param {string} size - ขนาดที่ต้องการลบ
 * @returns {Promise<Object>} { message: "Cart Cleared" }
 * @throws {Error} ถ้าไม่พบ user
 */
const deleteFromCartService = async (userId, itemId, size) => {
  try {
    // 1. ค้นหา user
    const userData = await userModel.findById(userId);

    if (!userData) {
      throw new Error("User not found");
    }

    // 2. ดึง cartData
    let cartData = userData.cartData || {};

    // 3. ลบสินค้าออกจากตะกร้า
    if (cartData[itemId] && cartData[itemId][size]) {
      // ลบ size นี้ออกจาก item
      delete cartData[itemId][size];

      // ถ้า item นี้ไม่มี size อื่นเหลือ ให้ลบ item ออกด้วย
      if (Object.keys(cartData[itemId]).length === 0) {
        delete cartData[itemId];
      }
    }

    // 4. บันทึกการเปลี่ยนแปลง
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
