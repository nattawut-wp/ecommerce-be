import {
  validateRegisterInput,
  validateLoginInput,
} from "../validators/userValidator.js";
import {
  registerUserService,
  loginUserService,
  verifyAdminService,
} from "../services/userService.js";
import { createToken, createAdminToken } from "../utills/tokenUtil.js";
import { HTTP_STATUS, RESPONSE_MESSAGES } from "../utills/constants.js";

const registerUserController = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const validation = validateRegisterInput(name, email, password);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.errors[0],
      });
    }

    const user = await registerUserService(name, email, password);

    const token = createToken(user._id);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      token,
      message: RESPONSE_MESSAGES.USER_REGISTERED_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

const loginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.errors[0],
      });
    }

    const user = await loginUserService(email, password);
    const token = createToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      token,
      message: RESPONSE_MESSAGES.USER_LOGGED_IN_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyAdminController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const validation = validateLoginInput(email, password);
    if (!validation.isValid) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false,
        message: validation.errors[0],
      });
    }

    const user = await verifyAdminService(email, password);
    const token = createAdminToken(user._id);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      token,
      role: user.role,
      message: RESPONSE_MESSAGES.USER_LOGGED_IN_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
    });
  }
};

export { registerUserController, loginUserController, verifyAdminController };
