import jwt from "jsonwebtoken";
// create token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createAdminToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

export { createToken, createAdminToken };
