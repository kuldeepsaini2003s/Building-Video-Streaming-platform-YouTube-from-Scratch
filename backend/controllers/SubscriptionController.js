import { Subscription } from "../models/subscriptionModel.js";
import { User } from "../models/userModel.js";

const subscribe = async (req, res) => {
  try {
    const { channelName } = req.params;

    if (!channelName) {
      return res.status(403).json({
        success: false,
        message: "Please provide channel name",
      });
    }

    const user = await User.findById(req.user._id);
    const owner = await User.findOne({
      "publishedDetails.channelName": channelName,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner not found",
      });
    }

    const subscriber = await Subscription.findOne({
      subscriber: user,
      channelName: owner.publishedDetails.channelName,
      channel: owner,
    });

    if (subscriber) {
      return res.status(201).json({
        success: false,
        message: "Already subscribed",
      });
    }

    await Subscription.create({
      subscriber: user,
      channelName: owner.publishedDetails.channelName,
      channel: owner,
    });

    return res.status(200).json({
      success: true,
      message: "Subscribed successfully",
    });
  } catch (error) {
    console.error("Error while subscribing the channel", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const unSubscribe = async (req, res) => {
  try {
    const { channelName } = req.params;

    if (!channelName) {
      return res.status(402).json({
        success: false,
        message: "Please provide channel name",
      });
    }

    const user = await User.findById(req.user._id);
    const owner = await User.findOne({
      "publishedDetails.channelName": channelName,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Subscription.findOneAndDelete({
      subscriber: user,
      channelName: owner.publishedDetails.channelName,
      channel: owner,
    });

    return res.status(200).json({
      success: true,
      message: "unsubscribed successfully",
    });
  } catch (error) {
    console.error("Error while unsubscribing channel", error);
    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

const channelSubscribers = async (req, res) => {};

const subscribedChannels = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const subscriptions = await Subscription.aggregate([
      {
        $match: {
          subscriber: user._id,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "channel",
          foreignField: "_id",
          as: "channelDetails",
        },
      },
      {
        $unwind: {
          path: "$channelDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "channel",
          foreignField: "channel",
          as: "subscribers",
        },
      },
      {
        $addFields: {
          userName: "$channelDetails.publishedDetails.userName",
          description: "$channelDetails.publishedDetails.description",
          avatar: "$channelDetails.publishedDetails.avatar",
          subscribers: {
            $size: "$subscribers",
          },
        },
      },
      {
        $project: {
          avatar: 1,
          channelName: 1,
          userName: 1,
          subscribers: 1,
          description: 1,
        },
      },
    ]);

    if (!subscriptions) {
      return res.status(405).json({
        success: false,
        message: "You have not subscribed any channel",
      });
    }

    return res.status(200).json({
      success: true,
      data: subscriptions,
      message: "All subscriptions fetched successfully",
    });
  } catch (error) {
    console.log("Error while fetching subscriptions", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export { subscribe, channelSubscribers, unSubscribe, subscribedChannels };
