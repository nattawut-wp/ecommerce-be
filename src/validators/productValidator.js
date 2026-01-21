// validate product input
const validateProductInput = (
  name,
  description,
  price,
  category,
  subCategory,
  sizes
) => {
  const errors = [];

  if (!name) {
    errors.push("Product name is required");
  }

  if (!description) {
    errors.push("Product description is required");
  }

  if (!price || isNaN(price) || price <= 0) {
    errors.push("Please enter a valid price");
  }

  if (!category) {
    errors.push("Category is required");
  }

  if (!subCategory) {
    errors.push("SubCategory is required");
  }

  if (!sizes || sizes.length === 0) {
    errors.push("At least one size is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export { validateProductInput };
