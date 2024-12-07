import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";
import { generateToken } from "../utils/generateToken.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const generateAccessAndRefreshToken = (userId) => {
  const accessToken = generateToken(userId, "10d");
  const refreshToken = generateToken(userId, "30d");
  return { accessToken, refreshToken };
};

export const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/").split(".")[0];
  return publicIdWithExtension;
};

const handleImageUpload = async (user, file, type) => {
  let updatedImage = user[type];
  if (!file) {
    if (user[type]) {
      const public_id = extractPublicId(user[type]);
      await cloudinary.uploader.destroy(public_id);
    }
    updatedImage = null;
  } else {
    if (user[type]) {
      const public_id = extractPublicId(user[type]);
      await cloudinary.uploader.destroy(public_id);
    }
    updatedImage = await uploadOnCloudinary(file.path);
  }
  return updatedImage.secure_url;
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

    const existingEmail = await User.findOne({ email });
    const existingUserName = await User.findOne({ userName });

    if (existingUserName) {
      return res.status(409).json({
        success: false,
        message: "User name already exists",
      });
    }

    if (existingEmail) {
      return res
        .status(409)
        .json({ success: false, message: "User already exists" });
    }

    if (!req.file) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a avatar image" });
    }

    const avatarFile = req.file;

    let avatarURL = "";
    if (avatarFile.path) {
      avatarURL = await uploadOnCloudinary(avatarFile.path);
    }

    const userData = {
      userName: userName.toLowerCase(),
      channelName,
      email,
      password: bcryptPassword,
      avatar: avatarURL.secure_url,
      draftDetails: {
        userName: userName.toLowerCase(),
        channelName,
        email,
        avatar: avatarURL.secure_url,
      },
      publishedDetails: {
        userName: userName.toLowerCase(),
        channelName,
        email,
        avatar: avatarURL.secure_url,
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
          publishedDetails: {
            ...user.publishedDetails,
            _id: user._id,
          },
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
        data: userData.publishedDetails,
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

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid current password" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as old password",
      });
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

const saveDetails = async (req, res) => {
  const { userName, channelName, description } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files;
    user.draftDetails.userName = userName || user.draftDetails.userName;
    user.draftDetails.channelName =
      channelName || user.draftDetails.channelName;
    user.draftDetails.description =
      description || user.draftDetails.description;

    user.draftDetails.avatar = await handleImageUpload(
      user,
      files.avatar?.[0],
      "avatar"
    );
    user.draftDetails.coverImage = await handleImageUpload(
      user,
      files.coverImage?.[0],
      "coverImage"
    );

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

  if (!userName || !channelName || !description) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const files = req.files;
    user.userName = userName || user.userName;
    user.channelName = channelName || user.channelName;
    user.publishedDetails.userName = userName || user.publishedDetails.userName;
    user.publishedDetails.channelName =
      channelName || user.publishedDetails.channelName;
    user.publishedDetails.description =
      description || user.publishedDetails.description;

    user.publishedDetails.avatar = await handleImageUpload(
      user,
      files.avatar?.[0],
      "avatar"
    );
    user.publishedDetails.coverImage = await handleImageUpload(
      user,
      files.coverImage?.[0],
      "coverImage"
    );

    user.draftDetails = user.publishedDetails;

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

const getChannelDetails = async (req, res) => {
  const { channelName } = req.params;

  if (!channelName)
    return res
      .status(400)
      .json({ success: false, message: "Channel name is required" });

  const user = await User.aggregate([
    {
      $match: {
        channelName: channelName,
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        channelsSubscribedTo: {
          $size: "$subscribedTo",
        },
        subscribed: {
          $cond: {
            if: {
              $in: [req.user._id, "$subscribers.subscriber"],
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        userName: "$publishedDetails.userName",
        channelName: "$publishedDetails.channelName",
        description: "$publishedDetails.description",
        avatar: "$publishedDetails.avatar",
        coverImage: "$publishedDetails.coverImage",
        subscribersCount: 1,
        channelsSubscribedTo: 1,
        subscribed: 1,
      },
    },
  ]);

  if (!user.length > 0) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: user[0],
    message: "channel data fetched successfully",
  });
};

const getWatchHistory = async (req, res) => {
  const user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
            },
          },
          {
            $addFields: {
              owner: { $arrayElemAt: ["$owner", 0] },
            },
          },
          {
            $project: {
              "owner.avatar": 1,
              "owner.channelName": 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$watchHistory", // flatten the watchHistory array
        preserveNullAndEmptyArrays: true, // keep documents with no watch history
      },
    },
    {
      $project: {
        "watchHistory._id": 1,
        "watchHistory.title": 1,
        "watchHistory.thumbnail": 1,
        "watchHistory.video_id": 1,
        "watchHistory.description": 1,
        "watchHistory.owner.avatar": 1,
        "watchHistory.owner.channelName": 1,
      },
    },
  ]);

  return res.status(200).json({
    success: true,
    data: user,
    message: "watch history fetched successfully",
  });
};

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  updatePassword,
  saveDetails,
  publishedDetails,
  getUserDetails,
  getSavedDetails,
  getChannelDetails,
  getWatchHistory,
};
