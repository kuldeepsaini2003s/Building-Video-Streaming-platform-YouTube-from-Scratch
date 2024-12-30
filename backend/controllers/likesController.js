import { Like } from "../models/likeModel.js";
import { User } from "../models/userModel.js";
import { Video } from "../models/videoModel.js";

const toggleVideoLike = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const like = await Like.findOne({ video: video._id });

    if (!like) {
      await Like.create({
        video: video._id,
        likeBy: [userId],
        dislikeBy: [],
      });

      return res.status(200).json({
        success: false,
        message: "Video liked successfully",
      });
    }

    const alreadyLiked = like.likeBy.includes(userId);

    if (alreadyLiked) {
      return res.status(201).json({
        success: false,
        message: "You have already this video",
      });
    }

    await Like.findByIdAndUpdate(like._id, {
      $addToSet: { likeBy: userId },
      $pull: { dislikeBy: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Video liked successfully",
    });
  } catch (error) {
    console.log("Error while liking video", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const disLikeVideo = async (req, res) => {
  try {
    const { videoId } = req.params;

    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const likes = await Like.findOne({
      video: video._id,
    });

    if (!likes) {
      await Like.create({
        video: video._id,
        likeBy: [],
        dislikeBy: [userId],
      });

      return res.status(200).json({
        success: false,
        message: "Video disliked successfully",
      });
    }

    const alreadyDisliked = likes.dislikeBy.includes(userId);

    if (alreadyDisliked) {
      return res.status(201).json({
        success: false,
        message: "You have already disliked this video",
      });
    }

    await Like.findByIdAndUpdate(likes._id, {
      $addToSet: { dislikeBy: userId },
      $pull: { likeBy: userId },
    });

    return res.status(200).json({
      success: true,
      message: "Video disliked successfully",
    });
  } catch (error) {
    console.log("Error while disliking video", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const { videoId } = req.params;

    const video = await Video.findOne({ video_id: videoId });

    if (!video) {
      return res.status(404).json({
        success: false,
        message: "Video not found",
      });
    }

    const user = await User.findById(req.user._id);
    const userId = user._id;

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyLiked = await Like.findOne({
      comment: video._id,
      likeBy: user._id,
    });

    if (alreadyLiked) {
      return res.status(404).json({
        success: false,
        message: "You have already liked this comment",
      });
    }

    const like = await Like.create({
      comment: video._id,
      likeBy: user._id,
    });

    if (!like) {
      return res.status(400).json({
        success: false,
        message: "Unable to like video",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment liked successfully",
    });
  } catch (error) {
    console.log("Error while liking comment", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const disLikeComment = async (req, res) => {
  try {
    const { videoId } = req.params;

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

    const like = await Like.findOneAndDelete({
      comment: video._id,
      likeBy: user._id,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "You have not liked this comment",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Comment disliked successfully",
    });
  } catch (error) {
    console.log("Error while disliking comment", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const toggleTweetLike = async (req, res) => {
  try {
    const { videoId } = req.params;

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

    const alreadyLiked = await Like.findOne({
      tweet: video._id,
      likeBy: user._id,
    });

    if (alreadyLiked) {
      return res.status(404).json({
        success: false,
        message: "You have already liked this tweet",
      });
    }

    const like = await Like.create({
      tweet: video._id,
      likeBy: user._id,
    });

    if (!like) {
      return res.status(400).json({
        success: false,
        message: "Unable to like video",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tweet liked successfully",
    });
  } catch (error) {
    console.log("Error while liking tweet", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const disLikeTweet = async (req, res) => {
  try {
    const { videoId } = req.params;

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

    const like = await Like.findOneAndDelete({
      tweet: video._id,
      likeBy: user._id,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "You have not liked this tweet",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tweet disliked successfully",
    });
  } catch (error) {
    console.log("Error while disliking tweet", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export {
  toggleVideoLike,
  disLikeVideo,
  toggleCommentLike,
  disLikeComment,
  toggleTweetLike,
  disLikeTweet,
};
