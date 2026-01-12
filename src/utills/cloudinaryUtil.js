/**
 * Cloudinary Image Upload Utility Module
 * โมดูลสำหรับอัพโหลดรูปภาพไปยัง Cloudinary
 *
 * ใช้สำหรับอัพโหลดรูปภาพสินค้าจาก server ไปเก็บบน cloud
 */
import { v2 as cloudinary } from "cloudinary";

/**
 * อัพโหลดหลายรูปภาพไปยัง Cloudinary พร้อมกัน
 * Upload multiple images to Cloudinary in parallel
 *
 * หน้าที่:
 * - ตรวจสอบว่ามีรูปภาพที่ต้องการอัพโหลดหรือไม่
 * - อัพโหลดรูปภาพทั้งหมดแบบ parallel (พร้อมกัน) ด้วย Promise.all
 * - รับ secure URL ของรูปภาพที่อัพโหลดสำเร็จ
 * - จัดการ error ถ้าการอัพโหลดล้มเหลว
 *
 * @param {Array<Object>} images - Array ของ image objects จาก multer middleware
 * @param {string} images[].path - File path ของรูปภาพแต่ละไฟล์
 *
 * @returns {Promise<string[]>} Array ของ secure URLs จาก Cloudinary
 * @returns {Promise<[]>} Empty array ถ้าไม่มีรูปภาพ
 *
 * @throws {Error} ถ้าการอัพโหลดล้มเหลว พร้อม error message
 *
 * ตัวอย่างการใช้งาน:
 * const imageUrls = await uploadImages(req.files);
 */
const uploadImages = async (images) => {
  try {
    // ตรวจสอบว่า images array มีค่าและไม่ว่าง
    if (!images || !Array.isArray(images) || images.length === 0) {
      return [];
    }

    // อัพโหลดรูปภาพทั้งหมดแบบ parallel processing
    // ใช้ Promise.all เพื่อให้อัพโหลดพร้อมกันและรอจนครบทุกไฟล์
    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        // อัพโหลดแต่ละรูปภาพไปยัง Cloudinary
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        // คืนค่า secure HTTPS URL ของรูปภาพที่อัพโหลดสำเร็จ
        return result.secure_url;
      })
    );
    return imagesUrl;
  } catch (error) {
    // ถ้าเกิด error ในการอัพโหลด ให้ throw error พร้อมข้อความ
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

export { uploadImages };
