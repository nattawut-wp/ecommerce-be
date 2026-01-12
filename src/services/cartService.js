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
 * - เปลี่ยนจำนวนสินค้าในตะกร้าตามที่กำหนด
 * - ถ้ามีอยู่แล้ว: เพิ่มจำนวนตามที่ระบุ (quantity สามารถเป็นลบได้)
 * - ถ้ายังไม่มี: ตั้งจำนวนตามที่ระบุ
 *
 * Note: quantity สามารถเป็น:
 * - บวก (+) = เพิ่มจำนวน
 * - ลบ (-) = ลดจำนวน (แต่ต้อง validate ไม่ให้ติดลบก่อนเรียก function นี้)
 *
 * @param {string} userId - ID ของผู้ใช้
 * @param {string} itemId - ID ของสินค้า
 * @param {string} size - ขนาดที่เลือก
 * @param {number} quantity - จำนวนที่ต้องการเปลี่ยน (สามารถเป็นบวกหรือลบ)
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

    // 3. อัพเดตจำนวน
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // มีอยู่แล้ว -> เพิ่ม/ลด ตามจำนวนที่กำหนด
        cartData[itemId][size] += quantity;
      } else {
        // ขนาดนี้ยังไม่มี -> ตั้งค่าใหม่
        cartData[itemId][size] = quantity;
      }
    } else {
      // สินค้านี้ยังไม่มีในตะกร้า -> สร้างใหม่
      cartData[itemId] = {};
      cartData[itemId][size] = quantity;
    }

    // 4. บันทึกการเปลี่ยนแปลง
    await userModel.findByIdAndUpdate(userId, { cartData });
    return { message: RESPONSE_MESSAGES.CART_UPDATED };
  } catch (error) {
    throw error;
  }
};

/**
 * ลดจำนวนสินค้าในตะกร้า (ลบ 1 ชิ้น)
 * Delete/decrease item from cart
 *
 * หน้าที่:
 * - ลดจำนวนสินค้าลง 1 ชิ้น
 * - ถ้าจำนวนเหลือ 0 หรือติดลบ ควรจะลบ item นั้นออกจากตะกร้า
 *
 * Note: Function นี้มีบาง logic ที่อาจไม่ถูกต้อง (line 87-94)
 * - ควรจะลบ item ออกถ้าจำนวนเป็น 0
 * - ไม่ควรสร้าง item ใหม่ถ้ายังไม่มีในตะกร้า
 *

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

    // 3. ลดจำนวนสินค้า
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        // มีอยู่แล้ว -> ลดจำนวนลง 1
        cartData[itemId][size] -= 1;
      } else {
        // ขนาดนี้ไม่มี -> ไม่ควรทำอะไร (หรือควร throw error)
        // TODO: Fix logic - ไม่ควรสร้างใหม่
        cartData[itemId][size] = 1;
      }
    } else {
      // สินค้านี้ไม่มีในตะกร้า -> ไม่ควรทำอะไร
      // TODO: Fix logic - ไม่ควรสร้างใหม่
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
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
