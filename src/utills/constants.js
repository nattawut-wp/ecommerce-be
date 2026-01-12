// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200, //สำเร็จ
  CREATED: 201, //สร้างใหม่
  BAD_REQUEST: 400, //ข้อมูลไม่ถูกต้อง
  UNAUTHORIZED: 401, //ไม่ได้รับอนุญาต
  NOT_FOUND: 404, //ไม่พบ
  INTERNAL_SERVER_ERROR: 500, //ข้อผิดพลาดภายในเซิร์ฟเวอร์
};

// Response Messages
export const RESPONSE_MESSAGES = {
  // User Messages
  USER_REGISTERED_SUCCESS: "User registered successfully",
  USER_LOGGED_IN_SUCCESS: "User logged in successfully",
  USER_NOT_FOUND: "User doesn't exist",
  USER_ALREADY_EXISTS: "User already exists",
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_EMAIL: "Please enter a valid email",
  WEAK_PASSWORD: "Please enter a strong password (at least 8 characters)",
  INVALID_NAME: "Name must be at least 2 characters",

  // Role Management Messages
  ROLE_UPDATED_SUCCESS: "User role updated successfully",
  INVALID_ROLE: "Invalid role. Must be: user or admin",
  ROLE_REQUIRED: "New role is required",

  // Product Messages
  PRODUCT_ADDED: "Product Added",
  PRODUCT_REMOVED: "Product Removed",
  PRODUCT_NOT_FOUND: "Product not found",
  PRODUCT_ID_REQUIRED: "Product ID is required",
  PRODUCT_NAME_REQUIRED: "Product name is required",
  PRODUCT_DESCRIPTION_REQUIRED: "Product description is required",
  INVALID_PRICE: "Please enter a valid price",
  CATEGORY_REQUIRED: "Category is required",
  SUBCATEGORY_REQUIRED: "SubCategory is required",
  SIZES_REQUIRED: "At least one size is required",
  IMAGE_REQUIRED: "At least one image is required",

  // Cart Messages
  ADDED_TO_CART: "Added To Cart",
  CART_UPDATED: "Cart Updated",
  CART_CLEARED: "Cart cleared",

  // Order Messages
  ORDER_CREATED: "Order created successfully",
  ORDER_VERIFIED: "Order verified successfully",
  ORDER_NOT_FOUND: "Order not found",
  STATUS_UPDATED: "Status Updated",
  ITEMS_REQUIRED: "Order items are required",
  ADDRESS_REQUIRED: "Delivery address is required",
  AMOUNT_INVALID: "Amount must be greater than 0",

  // Common Messages
  EMAIL_REQUIRED: "Email is required",
  PASSWORD_REQUIRED: "Password is required",
  USER_ID_REQUIRED: "User ID is required",
  ITEM_ID_REQUIRED: "Item ID is required",
  SIZE_REQUIRED: "Size is required",
  QUANTITY_INVALID: "Quantity must be a positive number",
  ORDER_ID_REQUIRED: "Order ID is required",
  STATUS_REQUIRED: "Status is required",
  INTERNAL_ERROR: "Internal server error",
  NOT_ALLOWED_CORS: "Not allowed by CORS",
};
