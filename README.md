# Backend API for E-Commerce System / ระบบ Backend API สำหรับระบบ E-Commerce

Backend API developed with Node.js, Express, and MongoDB.
ระบบ Backend API พัฒนาด้วย Node.js, Express และ MongoDB

## Table of Contents / สารบัญ

- [Features / คุณสมบัติ](#features--คุณสมบัติ)
- [Technologies Used / เทคโนโลยีที่ใช้](#technologies-used--เทคโนโลยีที่ใช้)
- [Project Structure / โครงสร้างโปรเจค](#project-structure--โครงสร้างโปรเจค)
- [Installation / การติดตั้ง](#installation--การติดตั้ง)
- [Environment Variables / การตั้งค่า Environment Variables](#environment-variables--การตั้งค่า-environment-variables)
- [Running the Project / การรันโปรเจค](#running-the-project--การรันโปรเจค)
- [API Endpoints](#api-endpoints)
- [File Management / การจัดการไฟล์](#file-management--การจัดการไฟล์)
- [Response Format / รูปแบบการตอบกลับ](#response-format--รูปแบบการตอบกลับ)

## Features / คุณสมบัติ

### User Management / การจัดการผู้ใช้

- Register / Login: สมัครสมาชิกและเข้าสู่ระบบ
- User Profile Management: จัดการข้อมูลส่วนตัว
- JWT Authentication: ยืนยันตัวตนด้วย JSON Web Token
- Admin Role Management: การจัดการสิทธิ์ผู้ดูแลระบบ

### Product Management / การจัดการสินค้า

- CRUD Operations: เพิ่ม แก้ไข และลบสินค้า
- Image Upload via Cloudinary: อัพโหลดรูปภาพผ่าน Cloudinary
- Product Details: จัดการข้อมูลสินค้า (ชื่อ, ราคา, หมวดหมู่, ฯลฯ)

### Shopping Cart / ตะกร้าสินค้า

- Add/Remove items: เพิ่มและลบสินค้าในตะกร้า
- View Cart items: แสดงรายการสินค้าในตะกร้า
- Update quantity: อัพเดทจำนวนสินค้า

### Order Management / การจัดการคำสั่งซื้อ

- Checkout Options: ชำระเงินปลายทาง (COD) และ Stripe
- Order History: ดูประวัติการสั่งซื้อ
- Update Order Status (Admin): อัพเดทสถานะคำสั่งซื้อ (สำหรับ Admin)
- View All Orders (Admin): ดูคำสั่งซื้อทั้งหมด (สำหรับ Admin)

## Technologies Used / เทคโนโลยีที่ใช้

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB (Mongoose)
- Authentication: JWT (jsonwebtoken)
- Password Hashing: bcrypt
- File Upload: Multer
- Cloud Storage: Cloudinary
- Payment: Stripe
- Validation: Validator.js
- Environment Variables: dotenv
- Dev Tools: Nodemon

## Project Structure / โครงสร้างโปรเจค

```
backend/
├── src/
│   ├── config/              # Configurations (Cloudinary, MongoDB)
│   ├── controllers/         # Business logic handlers
│   ├── middlewares/         # Express middlewares (Auth, Multer)
│   ├── models/              # MongoDB schemas
│   ├── routes/              # API route definitions
│   ├── services/            # Service layer (Database operations)
│   ├── validators/          # Input validation
│   └── utills/              # Utility functions
├── .env                     # Environment variables
├── .gitignore
├── package.json
├── server.js                # Entry point
└── README.md
```

## Installation / การติดตั้ง

### Prerequisites / ข้อกำหนดเบื้องต้น

- Node.js (v14+)
- MongoDB (Local or Atlas)
- Cloudinary Account
- Stripe Account

### Steps / ขั้นตอนการติดตั้ง

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecommerce/backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (see below).
4. Run the project:
   ```bash
   npm run dev
   ```

## Environment Variables / การตั้งค่า Environment Variables

Create a `.env` file in the root directory / สร้างไฟล์ `.env` ในโฟลเดอร์หลัก:

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

## Running the Project / การรันโปรเจค

### Development Mode (hot reload)

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

Server runs at / เซิร์ฟเวอร์ทำงานที่: `http://localhost:4000`

## API Endpoints

### User Routes (`/api/v1/user`)

| Method | Endpoint       | Description       | Auth Required |
| ------ | -------------- | ----------------- | ------------- |
| POST   | `/register`    | Register new user | No            |
| POST   | `/login`       | User login        | No            |
| POST   | `/admin`       | Admin login       | No            |
| GET    | `/profile`     | Get user profile  | Yes (User)    |
| PUT    | `/update-role` | Update user role  | Yes (Admin)   |

### Product Routes (`/api/v1/product`)

| Method | Endpoint  | Description               | Auth Required |
| ------ | --------- | ------------------------- | ------------- |
| POST   | `/add`    | Add new product           | Yes (Admin)   |
| GET    | `/list`   | List all products         | No            |
| POST   | `/remove` | Remove product            | Yes (Admin)   |
| POST   | `/single` | Get single product detail | No            |

### Cart Routes (`/api/v1/cart`)

| Method | Endpoint       | Description      | Auth Required |
| ------ | -------------- | ---------------- | ------------- |
| POST   | `/get`         | View cart        | Yes (User)    |
| POST   | `/add`         | Add to cart      | Yes (User)    |
| POST   | `/update`      | Update quantity  | Yes (User)    |
| DELETE | `/delete-cart` | Remove from cart | Yes (User)    |

### Order Routes (`/api/v1/order`)

| Method | Endpoint        | Description           | Auth Required |
| ------ | --------------- | --------------------- | ------------- |
| POST   | `/list`         | User order history    | Yes (User)    |
| POST   | `/status`       | Update order status   | Yes (Admin)   |
| GET    | `/all-orders`   | View all orders       | Yes (Admin)   |
| POST   | `/place`        | Place order (COD)     | Yes (User)    |
| POST   | `/stripe`       | Place order (Stripe)  | Yes (User)    |
| POST   | `/verifyStripe` | Verify Stripe payment | Yes (User)    |

## File Management / การจัดการไฟล์

### Product Image Upload / การอัพโหลดรูปภาพสินค้า

Use Multer for handling files and Cloudinary for storage.
ใช้ Multer สำหรับรับไฟล์และ Cloudinary สำหรับจัดเก็บ

Endpoint: `POST /api/v1/product/add`

Form Data:

- `image1`, `image2`, `image3`, `image4` - Image files
- `name` - Product name / ชื่อสินค้า
- `description` - Details / รายละเอียด
- `price` - Price / ราคา
- `category` - Category / หมวดหมู่
- `subCategory` - Sub-category / หมวดหมู่ย่อย
- `sizes` - Available sizes (JSON array) / ขนาดข้อมูล JSON array
- `bestseller` - Bestseller status / สินค้าขายดี

## Response Format / รูปแบบการตอบกลับ

### Success Response / เมื่อดำเนินการสำเร็จ

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...}
}
```

### Error Response / เมื่อเกิดข้อผิดพลาด

```json
{
  "success": false,
  "message": "Error message here"
}
```

## License

ISC

## Author

Your Name
