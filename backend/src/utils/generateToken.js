import jwt from "json-web-token";

const generateToken = (id, expiresIn) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: expiresIn });
};

export { generateToken}