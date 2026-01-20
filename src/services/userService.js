import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { RESPONSE_MESSAGES } from "../utills/constants.js";

const registerUserService = async (name, email, password) => {
  try {
    // 1. ตรวจสอบว่าอีเมลมีในระบบแล้วหรือไม่
    const exists = await userModel.findOne({ email });
    if (exists) {
      throw new Error(RESPONSE_MESSAGES.USER_ALREADY_EXISTS);
    }

    // 2. Hash password ด้วย bcrypt
    const salt = await bcrypt.genSalt(10); // สร้าง salt (random string)
    const hashedPassword = await bcrypt.hash(password, salt); // Hash password with salt

    // 3. สร้าง user object ใหม่
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword, // เก็บ hashed password (ไม่ใช่ plain text)
    });

    // 4. บันทึกลง database
    const user = await newUser.save();
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Login ผู้ใช้
 * Login user
 *
 * หน้าที่:
 * 1. ค้นหา user จากอีเมล
 * 2. เปรียบเทียบ password ด้วย bcrypt.compare
 * 3. Return user object ถ้า login สำเร็จ
 *
 * วิธีการทำงาน bcrypt.compare:
 * - รับ plain text password และ hashed password
 * - Hash plain text password ด้วย salt เดียวกับที่ใช้ตอน register
 * - เปรียบเทียบผลลัพธ์กับ hashed password ในฐานข้อมูล
 * - Return true ถ้าตรงกัน, false ถ้าไม่ตรง
 *
 * @param {string} email - อีเมลผู้ใช้
 * @param {string} password - รหัสผ่าน plain text
 * @returns {Promise<Object>} user object ถ้า login สำเร็จ
 * @throws {Error} ถ้าไม่พบ user หรือ password ไม่ถูกต้อง
 */
const loginUserService = async (email, password) => {
  try {
    // 1. ค้นหา user จากอีเมล
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. เปรียบเทียบ password
    // bcrypt.compare จะ hash plain text password แล้วเปรียบเทียบกับ hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. Login สำเร็จ - return user
    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * ตรวจสอบสิทธิ์ admin
 * Verify admin credentials
 *
 * หน้าที่:
 * 1. ค้นหา user จากอีเมล
 * 2. ตรวจสอบ password
 * 3. ตรวจสอบว่ามี role เป็น "admin" หรือไม่
 * 4. Return user object ถ้าผ่านทุกเงื่อนไข
 *
 * ความแตกต่างจาก loginUserService:
 * - ต้องมี role = "admin" ด้วย
 * - ใช้สำหรับ admin login เท่านั้น
 *
 * @param {string} email - อีเมล admin
 * @param {string} password - รหัสผ่าน plain text
 * @returns {Promise<Object>} admin user object
 * @throws {Error} ถ้าไม่พบ user, password ผิด, หรือไม่ใช่ admin
 */
const verifyAdminService = async (email, password) => {
  try {
    // 1. ค้นหา user
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // 2. ตรวจสอบ password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    // 3. ตรวจสอบว่ามี admin role หรือไม่
    if (user.role !== "admin") {
      throw new Error("Access Denied - Admin role required");
    }

    // 4. ผ่านทุกเงื่อนไข - return admin user
    return user;
  } catch (error) {
    throw error;
  }
};

export { loginUserService, registerUserService, verifyAdminService };
