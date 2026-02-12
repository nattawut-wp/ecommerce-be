import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

// ดึง token จาก headers (รองรับทั้ง custom header และ Bearer token)
const extractToken = (headers) => {
  if (headers.token) return headers.token;

  const authHeader = headers.authorization || headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    // ตัด "Bearer " ออกและเอาเฉพาะ token (7 ตัวอักษรแรก = "Bearer ")
    return authHeader.substring(7);
  }
  return null;
};

// auth user
const authUser = async (req, res, next) => {
  try {
    //  ดึง token จาก headers
    const token = extractToken(req.headers);

    // ตรวจสอบว่ามี token หรือไม่
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized - Please login",
      });
    }

    //  Verify token และ decode ข้อมูล
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  ดึง user ID จาก decoded token (รองรับหลายรูปแบบ)
    const userId = decoded.id || decoded._id || decoded.userId;

    // 5. ตรวจสอบว่ามี user ID ใน token หรือไม่
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token - No user ID found",
      });
    }

    // 6. ดึงข้อมูลผู้ใช้จาก database (ไม่รวม password)
    const user = await userModel.findById(userId).select("-password");

    // 7. ตรวจสอบว่าพบผู้ใช้ในระบบหรือไม่
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    // 8. แนบข้อมูลผู้ใช้เข้ากับ request object เพื่อให้ controller ใช้งาน
    req.user = user;
    req.userId = userId;
    // 9. ผ่านการตรวจสอบ ไปต่อที่ controller
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);

    // จัดการ error แบบ specific ตามประเภท

    // Token ไม่ถูกต้อง (signature ผิด, format ผิด)
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // Token หมดอายุ
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired - Please login again",
      });
    }

    // Error อื่นๆ
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

// auth admin
const authAdmin = async (req, res, next) => {
  try {
    // ตรวจสอบว่าผ่าน authUser มาหรือยัง
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "User not authenticated" });
    }

    // ตรวจสอบ Role
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Access Denied - Admin only" });
    }

    next();
  } catch (error) {
    console.log("Admin Auth Error:", error.message);
    res.status(401).json({ success: false, message: "Authorization failed" });
  }
};

export { authUser, authAdmin };
