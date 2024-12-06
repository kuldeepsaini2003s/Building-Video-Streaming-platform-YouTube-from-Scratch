import { v2 as cloudinary } from "cloudinary";
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";
import { uploadOnCloudinary } from "../utils/cloudinaryUpload.js";

function generateWatchId(length = 11) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let watchId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    watchId += characters[randomIndex];
  }
  return watchId;
}

export const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts.slice(-2).join("/").split(".")[0];
  return publicIdWithExtension;
};

const createVideo = async (req, res) => {
  const { title, description, category, tags, status } = req.body;

  if (!title || !description || !category || !tags || !status) {
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

    if (!files || !files.thumbnail) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a thumbnail" });
    }

    if (!files || !files.video) {
      return res
        .status(400)
        .json({ success: false, message: "Please upload a video" });
    }

    const thumbnailFile = files.thumbnail[0];

    const videoFile = files.video[0];

    const thumbnailUrl = await uploadOnCloudinary(thumbnailFile.path);
    const videoUrl = await uploadOnCloudinary(videoFile.path);

    if (!thumbnailUrl || !videoUrl) {
      return res
        .status(400)
        .json({ success: false, message: "uploading files failed" });
    }

    const videoData = new Video({
      title,
      description,
      category,
      tags,
      video_id: generateWatchId(),
      duration: videoUrl.duration,
      user: user._id,
      published: status,
      thumbnail: thumbnailUrl.secure_url,
      videoUrl: videoUrl.secure_url,
    });

    const video = await Video.create(videoData);

    return res.status(200).json({
      success: true,
      data: video,
      message: "Video created successfully",
    });
  } catch (error) {
    console.log("Error while create video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findOne({ video_id: id });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video,
      message: "Video fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting video by id", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateVideo = async (req, res) => {
  const { title, description, category, tags, status } = req.body;
  console.log(req.body);

  if (!title || !description || !category || !tags || !status) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  try {
    const { id } = req.params;

    const video = await Video.findOne({ video_id: id });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const thumbnail = req.file;

    if (!thumbnail) {
      return res.status(400).json({
        success: false,
        message: "Please upload a thumbnail",
      });
    }

    if (thumbnail !== video.thumbnail) {
      const public_id = extractPublicId(video.thumbnail);
      await cloudinary.uploader.destroy(public_id);
      const thumbnailUrl = await uploadOnCloudinary(thumbnail.path);
      video.thumbnail = thumbnailUrl.secure_url;
    }

    video.title = title || video.title;
    video.description = description || video.description;
    video.category = category || video.category;
    video.tags = tags || video.tags;
    video.published = status || video.published;

    await video.save({ validateBeforeSave: false }, { new: true });

    return res.status(200).json({
      success: true,
      data: video,
      message: "Video updated successfully",
    });
  } catch (error) {
    console.log("Error while updating video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findOneAndDelete({ video_id: id });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const thumbnail_public_id = extractPublicId(video.thumbnail);
    await cloudinary.uploader.destroy(thumbnail_public_id);

    const video_public_id = extractPublicId(video.videoUrl);
    await cloudinary.uploader.destroy(video_public_id);

    return res.status(200).json({
      success: true,
      message: "Video deleted successfully",
    });

  } catch (error) {
    console.log("Error while deleting video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export { createVideo, getVideoById, updateVideo, deleteVideo };
