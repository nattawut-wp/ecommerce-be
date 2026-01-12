// ตรวจสอบข้อมูลตะกร้าสินค้า
const validateCartInput = (userId, itemId, size) => {
  const errors = [];

  if (!userId) {
    errors.push("User ID is required");
  }

  if (!itemId) {
    errors.push("Item ID is required");
  }

  if (!size) {
    errors.push("Size is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// ตรวจสอบข้อมูลการอัพเดตตะกร้า
const validateUpdateCartInput = (userId, itemId, size, quantity) => {
  const errors = [];

  if (!userId) {
    errors.push("User ID is required");
  }

  if (!itemId) {
    errors.push("Item ID is required");
  }

  if (!size) {
    errors.push("Size is required");
  }

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    errors.push("Quantity must be a positive number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { validateCartInput, validateUpdateCartInput };
