import validator from "validator";

//validate register
const validateRegisterInput = (name, email, password) => {
  const errors = [];
  if (!validator.isLength(name, { min: 4, max: 30 })) {
    errors.push("Name must be between 4 and 30 characters");
  }
  if (!validator.isEmail(email)) {
    errors.push("Email is not valid");
  }
  if (!validator.isLength(password, { min: 8 })) {
    errors.push("Password must be at least 8 characters");
  }
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

//validate login
const validateLoginInput = (email, password) => {
  const errors = [];
  if (!validator.isEmail(email)) {
    errors.push("Email is not valid");
  }
  if (!validator.isLength(password, { min: 8 })) {
    errors.push("Password must be at least 8 characters");
  }
  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

export { validateRegisterInput, validateLoginInput };
