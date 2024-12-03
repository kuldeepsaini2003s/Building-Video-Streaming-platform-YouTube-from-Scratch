import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateAccessAndRefreshToken = (userId) => {
  const accessToken = generateToken(userId, "10d");
  const refreshToken = generateToken(userId, "30d");
  return { accessToken, refreshToken };
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/").split(".")[0]; // "v1234567890/image_name"
  return publicIdWithExtension;
};

const option = {
  httpOnly: true,
  secure: true,
};

const registerUser = async (req, res) => {
  const { userName, channelName, email, password } = req.body;

  if (!userName || !channelName || !email || !password) {
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

    let avatarURL = "";
    if (avatarFile.path) {
      avatarURL = await uploadOnCloudinary(avatarFile.path);
    }

    const userData = {
      userName: userName.toLowerCase(),
      channelName,
      email,
      password: bcryptPassword,
      avatar: avatarURL,
      draftDetails: {
        userName: userName.toLowerCase(),
        channelName,
        email,
        avatar: avatarURL,
      },
      publishedDetails: {
        userName: userName.toLowerCase(),
        channelName,
        email,
        avatar: avatarURL,
      },
    };

    const user = await User.create(userData);

    if (user) {
      const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
        user._id
      );
      const _user = await User.findByIdAndUpdate(
        user._id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      ).select("-password -refreshToken -publishedDetails -draftDetails");

      return res
        .status(201)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
          success: true,
          data: _user,
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

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({
        success: true,
        data: userData,
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
  return res
    .status(200)
    .clearCookie("accessToken", option)
    .clearCookie("refreshToken", option)
    .json({ success: true, message: "User logged out successfully" });
};

const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken || req.header("authorization");

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "unauthorized request" });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (token !== user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "refresh token is not valid" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, option)
      .cookie("refreshToken", refreshToken, option)
      .json({ success: true, accessToken, refreshToken });
  } catch (error) {
    console.log("Error refreshing access token", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await User.isPasswordValid(currentPassword);

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid current password" });
    }

    user.password = bcrypt.hashSync(newPassword, 10);

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.log("Error updating password", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const draftDetails = async (req, res) => {
  const { userName, channelName, description } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files;

    let updateAvatar = user?.avatar;
    let updateCoverImage = user?.coverImage;

    if (!files.avatar) {
      if (user.avatar) {
        const public_id = extractPublicId(user?.avatar);
        await cloudinary.uploader.destroy(public_id);
      }

      updateAvatar = null;
    } else {
      if (user.avatar) {
        const public_id = extractPublicId(user?.avatar);
        await cloudinary.uploader.destroy(public_id);
      }

      updateAvatar = await uploadOnCloudinary(files.avatar[0].path);
    }

    if (!files.coverImage) {
      if (user.coverImage) {
        const public_id = extractPublicId(user?.coverImage);
        await cloudinary.uploader.destroy(public_id);
      }

      updateCoverImage = null;
    } else {
      if (user.coverImage) {
        const public_id = extractPublicId(user?.coverImage);
        await cloudinary.uploader.destroy(public_id);
      }

      updateCoverImage = await uploadOnCloudinary(files.coverImage[0].path);
    }

    const savedDraft = user.draftDetails;

    if (userName) savedDraft.userName = userName;
    if (channelName) savedDraft.channelName = channelName;
    if (description) savedDraft.description = description;
    if (updateAvatar !== undefined) savedDraft.avatar = updateAvatar;
    if (updateCoverImage !== undefined)
      savedDraft.coverImage = updateCoverImage;

    user.draftDetails = savedDraft;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "User details saved successfully",
    });
  } catch (error) {
    console.log("Error while saving user details", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const publishedDetails = async (req, res) => {
  const { userName, channelName, description } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files;

    let updateAvatar = user?.avatar;
    let updateCoverImage = user?.coverImage;

    if (!files.avatar) {
      if (user.avatar) {
        const public_id = extractPublicId(user?.avatar);
        await cloudinary.uploader.destroy(public_id);
      }

      updateAvatar = null;
    } else {
      if (user.avatar) {
        const public_id = extractPublicId(user?.avatar);
        await cloudinary.uploader.destroy(public_id);
      }

      updateAvatar = await uploadOnCloudinary(files.avatar[0].path);
    }

    if (!files.coverImage) {
      if (user.coverImage) {
        const public_id = extractPublicId(user?.coverImage);
        await cloudinary.uploader.destroy(public_id);
      }

      updateCoverImage = null;
    } else {
      if (user.coverImage) {
        const public_id = extractPublicId(user?.coverImage);
        await cloudinary.uploader.destroy(public_id);
      }

      updateCoverImage = await uploadOnCloudinary(files.coverImage[0].path);
    }

    const savedDraft = user.draftDetails;

    if (userName) savedDraft.userName = userName;
    if (channelName) savedDraft.channelName = channelName;
    if (description) savedDraft.description = description;
    if (updateAvatar !== undefined) savedDraft.avatar = updateAvatar;
    if (updateCoverImage !== undefined)
      savedDraft.coverImage = updateCoverImage;

    user.draftDetails = savedDraft;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      success: true,
      message: "User details published successfully",
    });
  } catch (error) {
    console.log("Error while saving user details", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const getUserDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userData = user.publishedDetails;
  return res.status(200).json({
    success: true,
    data: userData,
    message: "user data fetched successfully",
  });
};

const getSavedDetails = async (req, res) => {
  const user = await User.findById(req.user._id);
  const userData = user.draftDetails;
  return res.status(200).json({
    success: true,
    data: userData,
    message: "user data fetched successfully",
  });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  draftDetails,
  publishedDetails,
  getUserDetails,
  getSavedDetails,
};
