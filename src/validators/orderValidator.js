// validate order input
const validateOrderInput = (userId, items, amount, address) => {
  const errors = [];

  if (!userId) {
    errors.push("User ID is required");
  }

  if (!items || items.length === 0) {
    errors.push("Order items are required");
  }

  if (!amount || amount <= 0) {
    errors.push("Amount must be greater than 0");
  }

  if (!address) {
    errors.push("Delivery address is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { validateOrderInput };
