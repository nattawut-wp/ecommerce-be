import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import { RESPONSE_MESSAGES } from "../utills/constants.js";

// register user
const registerUserService = async (name, email, password) => {
  try {
    // check if email already exists
    const exists = await userModel.findOne({ email });
    if (exists) {
      throw new Error(RESPONSE_MESSAGES.USER_ALREADY_EXISTS);
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user object
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save to database
    const user = await newUser.save();
    return user;
  } catch (error) {
    throw error;
  }
};

// login user
const loginUserService = async (email, password) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // Compare password
    // bcrypt.compare จะ hash plain text password แล้วเปรียบเทียบกับ hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }
    return user;
  } catch (error) {
    throw error;
  }
};

// verify admin
const verifyAdminService = async (email, password) => {
  try {
    // Find user by email
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error(RESPONSE_MESSAGES.USER_NOT_FOUND);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error(RESPONSE_MESSAGES.INVALID_CREDENTIALS);
    }

    // Check if user has admin role
    if (user.role !== "admin") {
      throw new Error("Access Denied - Admin role required");
    }

    return user;
  } catch (error) {
    throw error;
  }
};

export { loginUserService, registerUserService, verifyAdminService };
