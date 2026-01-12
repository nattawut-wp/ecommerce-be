
Backend API สำหรับระบบ E-Commerce พัฒนาด้วย Node.js, Express และ MongoDB

## 📋 สารบัญ

- [คุณสมบัติ](#คุณสมบัติ)
- [เทคโนโลยีที่ใช้](#เทคโนโลยีที่ใช้)
- [โครงสร้างโปรเจค](#โครงสร้างโปรเจค)
- [การติดตั้ง](#การติดตั้ง)
- [การตั้งค่า Environment Variables](#การตั้งค่า-environment-variables)
- [การรันโปรเจค](#การรันโปรเจค)
- [API Endpoints](#api-endpoints)
- [การจัดการไฟล์](#การจัดการไฟล์)

## ✨ คุณสมบัติ

### User Management

- 🔐 สมัครสมาชิก / เข้าสู่ระบบ (Register/Login)
- 👤 จัดการข้อมูลผู้ใช้
- 🔑 JWT Authentication
- 👑 Admin Role Management

### Product Management

- 📦 เพิ่ม/แก้ไข/ลบสินค้า
- 🖼️ อัพโหลดรูปภาพสินค้าผ่าน Cloudinary
- 📝 จัดการข้อมูลสินค้า (ชื่อ, ราคา, หมวดหมู่, ฯลฯ)

### Shopping Cart

- 🛒 เพิ่ม/ลบสินค้าในตะกร้า
- 📊 แสดงรายการสินค้าในตะกร้า
- 🔄 อัพเดทจำนวนสินค้า

### Order Management

- 💳 สั่งซื้อสินค้า (Cash on Delivery / Stripe Payment)
- 📋 ดูประวัติการสั่งซื้อ
- 🔄 อัพเดทสถานะคำสั่งซื้อ (Admin)
- 📊 ดูคำสั่งซื้อทั้งหมด (Admin)

## 🛠️ เทคโนโลยีที่ใช้

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **File Upload:** Multer
- **Cloud Storage:** Cloudinary
- **Payment:** Stripe
- **Validation:** Validator.js
- **Environment Variables:** dotenv
- **Dev Tools:** Nodemon

## 📁 โครงสร้างโปรเจค

```
backend/
├── src/
│   ├── config/              # การตั้งค่าต่างๆ
│   │   ├── cloudinary.js    # Cloudinary configuration
│   │   └── mongodb.js       # MongoDB connection
│   │
│   ├── controllers/         # Business logic handlers
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   │
│   ├── middlewares/         # Express middlewares
│   │   ├── authMiddleware.js  # JWT authentication
│   │   └── multer.js         # File upload handling
│   │
│   ├── models/              # MongoDB schemas
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   │
│   ├── routes/              # API route definitions
│   │   ├── cartRoute.js
│   │   ├── orderRoute.js
│   │   ├── productRoute.js
│   │   └── userRoute.js
│   │
│   ├── services/            # Service layer (database operations)
│   │   ├── cartService.js
│   │   ├── orderService.js
│   │   ├── productService.js
│   │   └── userService.js
│   │
│   ├── validators/          # Input validation
│   │   ├── cartValidator.js
│   │   ├── orderValidator.js
│   │   ├── productValidator.js
│   │   └── userValidator.js
│   │
│   └── utills/              # Utility functions
│       ├── cloudinaryUtil.js  # Cloudinary helpers
│       ├── constants.js      # Constants & messages
│       └── tokenUtil.js      # JWT helpers
│
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## 🚀 การติดตั้ง

### ข้อกำหนดเบื้องต้น

- Node.js (v14 ขึ้นไป)
- MongoDB (Local หรือ MongoDB Atlas)
- บัญชี Cloudinary (สำหรับจัดเก็บรูปภาพ)
- บัญชี Stripe (สำหรับการชำระเงิน)

### ขั้นตอนการติดตั้ง

1. Clone repository

```bash
git clone <repository-url>
cd phamacy-e/backend
```

2. ติดตั้ง dependencies

```bash
npm install
```

3. สร้างไฟล์ `.env` (ดูตัวอย่างด้านล่าง)

4. รันโปรเจค

```bash
npm run dev
```

## ⚙️ การตั้งค่า Environment Variables

สร้างไฟล์ `.env` ใน root directory ของ backend:

```env
# Server Configuration
PORT=4000

# MongoDB Configuration
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/<dbname>

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
```

## 🏃 การรันโปรเจค

### Development Mode (hot reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server จะรันที่: `http://localhost:4000`

## 📡 API Endpoints

### 🔐 User Routes (`/api/v1/user`)

| Method | Endpoint       | Description        | Auth Required |
| ------ | -------------- | ------------------ | ------------- |
| POST   | `/register`    | สมัครสมาชิกใหม่    | ❌            |
| POST   | `/login`       | เข้าสู่ระบบ        | ❌            |
| POST   | `/admin`       | Admin login        | ❌            |
| GET    | `/profile`     | ดูข้อมูลโปรไฟล์    | ✅ User       |
| PUT    | `/update-role` | อัพเดทสิทธิ์ผู้ใช้ | ✅ Admin      |

### 📦 Product Routes (`/api/v1/product`)

| Method | Endpoint  | Description           | Auth Required |
| ------ | --------- | --------------------- | ------------- |
| POST   | `/add`    | เพิ่มสินค้าใหม่       | ✅ Admin      |
| GET    | `/list`   | ดูรายการสินค้าทั้งหมด | ❌            |
| POST   | `/remove` | ลบสินค้า              | ✅ Admin      |
| POST   | `/single` | ดูรายละเอียดสินค้า    | ❌            |

### 🛒 Cart Routes (`/api/v1/cart`)

| Method | Endpoint       | Description         | Auth Required |
| ------ | -------------- | ------------------- | ------------- |
| POST   | `/get`         | ดูตะกร้าสินค้า      | ✅ User       |
| POST   | `/add`         | เพิ่มสินค้าลงตะกร้า | ✅ User       |
| POST   | `/update`      | อัพเดทจำนวนสินค้า   | ✅ User       |
| DELETE | `/delete-cart` | ลบสินค้าจากตะกร้า   | ✅ User       |

### 🛍️ Order Routes (`/api/v1/order`)

| Method | Endpoint        | Description                  | Auth Required |
| ------ | --------------- | ---------------------------- | ------------- |
| POST   | `/list`         | ดูประวัติคำสั่งซื้อของตัวเอง | ✅ User       |
| POST   | `/status`       | อัพเดทสถานะคำสั่งซื้อ        | ✅ Admin      |
| GET    | `/all-orders`   | ดูคำสั่งซื้อทั้งหมด          | ✅ Admin      |
| POST   | `/place`        | สั่งซื้อ (Cash on Delivery)  | ✅ User       |
| POST   | `/stripe`       | สั่งซื้อ (Stripe Payment)    | ✅ User       |
| POST   | `/verifyStripe` | ยืนยันการชำระเงิน Stripe     | ✅ User       |

## 🔒 Authentication

API ใช้ JWT (JSON Web Token) สำหรับการยืนยันตัวตน

### การส่ง Token

ส่ง token ผ่าน Header ในรูปแบบใดรูปแบบหนึ่ง:

```
Authorization: Bearer <your_jwt_token>
```

หรือ

```
token: <your_jwt_token>
```

### User Roles

- **User**: ผู้ใช้ทั่วไป (สามารถซื้อสินค้า, จัดการตะกร้า)
- **Admin**: ผู้ดูแลระบบ (สามารถจัดการสินค้า, คำสั่งซื้อทั้งหมด)

## 📤 การจัดการไฟล์

### การอัพโหลดรูปภาพสินค้า

ใช้ Multer สำหรับรับไฟล์และ Cloudinary สำหรับจัดเก็บ

**Endpoint:** `POST /api/v1/product/add`

**Form Data:**

- `image1`, `image2`, `image3`, `image4` - ไฟล์รูปภาพ
- `name` - ชื่อสินค้า
- `description` - รายละเอียด
- `price` - ราคา
- `category` - หมวดหมู่
- `subCategory` - หมวดหมู่ย่อย
- `sizes` - ขนาดที่มี (JSON array)
- `bestseller` - สินค้าขายดี (true/false)

## 🧪 การทดสอบ API

แนะนำให้ใช้:

- **Postman** - สำหรับทดสอบ API
- **ไฟล์ Mock Data** - ดู `CART_API_MOCK_DATA.md` สำหรับตัวอย่างข้อมูล

## 📝 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message here"
}
```

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit การเปลี่ยนแปลง (`git commit -m 'Add some AmazingFeature'`)
4. Push ไปยัง Branch (`git push origin feature/AmazingFeature`)
5. เปิด Pull Request

## 📄 License

ISC

## 👨‍💻 Author

Your Name

---

**หมายเหตุ:** อย่าลืม `.gitignore` ไฟล์ `.env` เพื่อความปลอดภัยของข้อมูลสำคัญ
