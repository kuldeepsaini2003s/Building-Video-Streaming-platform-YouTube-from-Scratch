import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/userModel.js";

const verifyToken = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.header("authorization")?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized request" });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);    
    const user = await User.findById(decoded.id).select(
      "-password -refreshToken"
    );

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid access token" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Error while checking access token", error);
    return res
      .status(401)
      .json({ success: false, message: "Invalid access token" });
  }
};

export { verifyToken };
