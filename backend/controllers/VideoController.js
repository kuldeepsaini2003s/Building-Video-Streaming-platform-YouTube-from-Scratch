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

    const videoData = {
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
    };

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
    const { videoId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const video = await Video.aggregate([
      {
        $match: {
          video_id: videoId,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "video",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "user",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "playlists",
          let: { videoId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$$videoId", "$video"] },
              },
            },
          ],
          as: "playlistDetails",
        },
      },
      {
        $addFields: {
          videoSaved: {
            $cond: {
              if: { $gt: [{ $size: "$playlistDetails" }, 0] },
              then: true,
              else: false,
            },
          },
          likesCount: {
            $size: { $ifNull: ["$likes.likeBy", []] },
          },
          subscribersCount: {
            $size: { $ifNull: ["$subscribers", []] },
          },
          subscribed: {
            $cond: {
              if: {
                $in: [user._id, { $ifNull: ["$subscribers.subscriber", []] }],
              },
              then: true,
              else: false,
            },
          },
          channelName: {
            $arrayElemAt: ["$userDetails.publishedDetails.channelName", 0],
          },
          userAvatar: {
            $arrayElemAt: ["$userDetails.publishedDetails.avatar", 0],
          },
          userName: {
            $arrayElemAt: ["$userDetails.publishedDetails.userName", 0],
          },
          videoViewed: {
            $cond: [
              {
                $in: [user._id, { $ifNull: ["$views", []] }],
              },
              true,
              false,
            ],
          },
          isLiked: {
            $cond: [
              {
                $in: [user._id, { $ifNull: ["$likes.likeBy", []] }],
              },
              true,
              false,
            ],
          },
          isDisliked: {
            $cond: [
              {
                $in: [user._id, { $ifNull: ["$likes.dislikeBy", []] }],
              },
              true,
              false,
            ],
          },
          viewsCount: {
            $size: { $ifNull: ["$views", []] },
          },
        },
      },
      {
        $project: {
          title: 1,
          description: 1,
          category: 1,
          tags: 1,
          video_id: 1,
          duration: 1,
          user: 1,
          videoUrl: 1,
          viewsCount: 1,
          videoViewed: 1,
          channelName: 1,
          userName: 1,
          userAvatar: 1,
          subscribersCount: 1,
          subscribed: 1,
          likesCount: 1,
          isLiked: 1,
          isDisliked: 1,
          videoSaved: 1,
        },
      },
    ]);

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: video[0],
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

    const thumbnail = req.files;

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

const getAllVideo = async (req, res) => {
  try {
    const { userName } = req.body;
    let user;
    let videos;

    if (userName) {
      user = await User.findOne({
        "publishedDetails.userName": userName,
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      videos = await Video.find({ user: user._id, published: true })
        .select(
          "title thumbnail views duration likesCount video_id videoUrl category"
        )
        .populate(
          "user",
          "publishedDetails.channelName publishedDetails.avatar"
        );
    } else {
      user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      videos = await Video.find({ published: true })
        .select(
          "title thumbnail views duration likesCount video_id videoUrl category"
        )
        .populate(
          "user",
          "publishedDetails.channelName publishedDetails.avatar"
        );
    }

    if (!videos || videos.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No videos found",
      });
    }

    const filteredVideos = videos.map((video) => ({
      title: video.title,
      thumbnail: video.thumbnail,
      viewsCount: video?.views?.length || 0,
      duration: video.duration,
      video_id: video.video_id,
      videoUrl: video.videoUrl,
      category: video.category,
      channelName: video.user?.publishedDetails?.channelName || "",
      avatar: video.user?.publishedDetails?.avatar || "",
    }));

    return res.status(200).json({
      success: true,
      data: filteredVideos,
      message: "Videos fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting all video", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateViews = async (req, res) => {
  const { videoId } = req.params;
  try {
    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!video.views.includes(user._id)) {
      video.views.push(user._id);
      await video.save();

      return res.status(200).json({
        success: true,
        message: "Views updated successfully",
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "You have already viewed this video",
      });
    }
  } catch (error) {
    console.error("Error while updating views", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
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

export {
  createVideo,
  getVideoById,
  getAllVideo,
  updateVideo,
  updateViews,
  deleteVideo,
};
