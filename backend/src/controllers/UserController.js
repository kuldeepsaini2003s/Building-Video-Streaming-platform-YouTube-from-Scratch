import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import { generateToken } from "../utils/generateToken.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateAccessAndRefreshToken = (userId) => {
  console.log(userId);
  const accessToken = generateToken(userId, "10d");
  const refreshToken = generateToken(userId, "30d");
  return { accessToken, refreshToken };
};
const registerUser = async (req, res) => {
  const { userName, fullName, email, password } = req.body;

  if (!userName || !fullName || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  if (!emailRegex.test(email)) {
    return res.status(403).json({
      success: false,
      message: "Email is not valid",
    });
  }
  try {
    const bcryptPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    if (!req.files || !req.files.avatar) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a avatar image" });
    }

    const avatarFile = req.files.avatar[0];

    const coverFile = req.files.cover;

    let avatarURL = "";
    if (avatarFile.path) {
      avatarURL = await uploadOnCloudinary(avatarFile.path);
    }

    let coverURL = "";

    if (coverFile) {
      coverURL = await uploadOnCloudinary(coverFile.tempFilePath);
    }

    const userData = {
      userName: userName.toLowerCase(),
      fullName,
      email,
      password: bcryptPassword,
      avatar: avatarURL,
      cover: coverURL || "",
    };

    const user = await User.create(userData);

    if (user) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );
      user.refreshToken = refreshToken;
      await user.save();
      const option = {
        httpOnly: true,
        secure: true,
      };
      return res
        .status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
          success: true,
          userName,
          fullName,
          email,
          avatar: avatarURL,
          cover: coverURL,
          accessToken,
          refreshToken,
          message: "User registered successfully",
        });
    }
  } catch (error) {
    console.error("Error creating user", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found with this email" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );
    const option = {
      httpOnly: true,
      secure: true,
    };
    user.refreshToken = refreshToken;
    await user.save();
    const userData = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({
        success: true,
        userData,
        accessToken,
        refreshToken,
        message: "User logged in successfully",
      });
  } catch (error) {
    console.log("Error logging in user", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const logoutUser = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: "" },
    { new: true }
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ success: true, message: "User logged out successfully" });
};

export { registerUser, loginUser, logoutUser };