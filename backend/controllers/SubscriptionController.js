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

const subscribedChannels = async (req, res) => {};

export { subscribe, channelSubscribers, unSubscribe, subscribedChannels };
