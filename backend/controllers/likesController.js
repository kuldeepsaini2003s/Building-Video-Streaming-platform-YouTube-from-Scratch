import { Like } from "../models/likeModel";
import { User } from "../models/userModel";
import { Video } from "../models/videoModel";

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

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyLiked = await Like.findOne(
      { video: videoId },
      { likeBy: user._id }
    );

    if (alreadyLiked) {
      return res.status(404).json({
        success: false,
        message: "You have already liked this video",
      });
    }

    await Like.create({
      video: videoId,
      likeBy: user._id,
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
      video: videoId,
      likeBy: user._id,
    });

    if (!like) {
      return res.status(404).json({
        success: false,
        message: "You have not yet liked this video",
      });
    }

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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyLiked = await Like.findOne(
      { comment: videoId },
      { likeBy: user._id }
    );

    if (alreadyLiked) {
      return res.status(404).json({
        success: false,
        message: "You have already liked this comment",
      });
    }

    await Like.create({
      comment: videoId,
      likeBy: user._id,
    });

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

    const like = await Like.findOneAndDelete(
      { comment: videoId },
      { likeBy: user._id }
    );

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

    const alreadyLiked = await Like.findOne(
      { tweet: videoId },
      { likeBy: user._id }
    );

    if (alreadyLiked) {
      return res.status(404).json({
        success: false,
        message: "You have already liked this tweet",
      });
    }

    await Like.create({
      tweet: videoId,
      likeBy: user._id,
    });

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

    const like = await Like.findOneAndDelete(
      { tweet: videoId },
      { likeBy: user._id }
    );

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
