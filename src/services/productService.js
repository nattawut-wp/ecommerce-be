/**
 * Product Service Module
 * โมดูล Service สำหรับจัดการ Business Logic ของสินค้า
 *
 * หน้าที่หลัก:
 * - เพิ่มสินค้าใหม่ (พร้อมอัพโหลดรูปภาพไปยัง Cloudinary)
 * - ดึงรายการสินค้าทั้งหมด
 * - ดึงข้อมูลสินค้าแต่ละตัว
 * - ลบสินค้า
 */
import produtModel from "../models/productModel.js";
import { uploadImages } from "../utills/cloudinaryUtil.js";

/**
 * เพิ่มสินค้าใหม่
 * Add new product
 *
 * หน้าที่:
 * 1. อัพโหลดรูปภาพไปยัง Cloudinary (ถ้ามี)
 * 2. แปลงข้อมูลให้ถูก type (price เป็น Number, sizes เป็น Array, etc.)
 * 3. สร้างสินค้าใหม่ในฐานข้อมูล
 *
 * การจัดการข้อมูล:
 * - price: แปลงเป็น Number
 * - bestseller: แปลงเป็น Boolean (รองรับทั้ง string และ boolean)
 * - sizes: แปลงจาก JSON string เป็น Array (ถ้าเป็น string)
 * - image: ใช้ URLs จาก Cloudinary หรือ empty array
 * - date: ใช้ Date.now() (timestamp)
 *
 * @param {Object} productData - ข้อมูลสินค้าจาก request body
 * @param {string} productData.name - ชื่อสินค้า
 * @param {string} productData.description - รายละเอียดสินค้า
 * @param {string|number} productData.price - ราคา (จะถูกแปลงเป็น Number)
 * @param {string} productData.category - หมวดหมู่หลัก
 * @param {string} productData.subCategory - หมวดหมู่ย่อย
 * @param {string|Array} productData.sizes - ขนาดที่มี (JSON string or Array)
 * @param {string|boolean} productData.bestseller - สินค้าขายดีหรือไม่
 * @param {Array<Object>} images - Array ของ image files จาก multer
 * @returns {Promise<Object>} product object ที่สร้างสำเร็จ
 * @throws {Error} ถ้าอัพโหลดรูปภาพหรือบันทึกข้อมูลล้มเหลว
 */
const addProductService = async (productData, images) => {
  try {
    // 1. อัพโหลดรูปภาพไปยัง Cloudinary (ถ้ามี)
    let imagesUrl = [];
    if (images && images.length > 0) {
      imagesUrl = await uploadImages(images);
    }

    // 2. เตรียมข้อมูลสินค้า (แปลง types ให้ถูกต้อง)
    const newProductData = {
      ...productData,
      // แปลง price จาก string เป็น Number
      price: Number(productData.price),
      // แปลง bestseller เป็น Boolean
      bestseller:
        typeof productData.bestseller === "string"
          ? productData.bestseller === "true"
          : Boolean(productData.bestseller),
      // แปลง sizes จาก JSON string เป็น Array (ถ้าเป็น string)
      sizes:
        typeof productData.sizes === "string"
          ? JSON.parse(productData.sizes)
          : productData.sizes,
      // ใช้ URLs จาก Cloudinary หรือข้อมูลเดิม หรือ empty array
      image: imagesUrl.length > 0 ? imagesUrl : productData.image || [],
      // เพิ่ม timestamp
      date: Date.now(),
    };

    // 3. สร้างและบันทึกสินค้าใหม่
    const product = new produtModel(newProductData);
    await product.save();

    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงรายการสินค้าทั้งหมด
 * Get all products
 *
 * หน้าที่:
 * - ดึงสินค้าทั้งหมดจากฐานข้อมูล
 *
 * @returns {Promise<Array>} Array ของสินค้าทั้งหมด
 * @throws {Error} ถ้าดึงข้อมูลล้มเหลว
 */
const listProductsService = async () => {
  try {
    // ดึงสินค้าทั้งหมด (ไม่มี filter)
    const products = await produtModel.find({});
    return products;
  } catch (error) {
    throw error;
  }
};

/**
 * ดึงข้อมูลสินค้าแต่ละตัว
 * Get product by ID
 *
 * หน้าที่:
 * - ค้นหาสินค้าจาก product ID
 *
 * @param {string} productId - ID ของสินค้า
 * @returns {Promise<Object|null>} product object หรือ null ถ้าไม่พบ
 * @throws {Error} ถ้า ID ไม่ถูกต้องหรือดึงข้อมูลล้มเหลว
 */
const getProductByIdService = async (productId) => {
  try {
    // ค้นหาสินค้าจาก ID
    const product = await produtModel.findById(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

/**
 * ลบสินค้า (สำหรับ Admin)
 * Delete product
 *
 * หน้าที่:
 * - ลบสินค้าออกจากฐานข้อมูล
 *
 * Note: รูปภาพใน Cloudinary จะยังคงอยู่
 * (ควรมี function สำหรับลบรูปภาพจาก Cloudinary ด้วย)
 *
 * @param {string} productId - ID ของสินค้าที่ต้องการลบ
 * @returns {Promise<Object|null>} product ที่ถูกลบ หรือ null ถ้าไม่พบ
 * @throws {Error} ถ้า ID ไม่ถูกต้องหรือลบล้มเหลว
 */
const deleteProductService = async (productId) => {
  try {
    // ลบสินค้าจาก database
    const product = await produtModel.findByIdAndDelete(productId);
    return product;
  } catch (error) {
    throw error;
  }
};

export {
  addProductService,
  listProductsService,
  getProductByIdService,
  deleteProductService,
};
