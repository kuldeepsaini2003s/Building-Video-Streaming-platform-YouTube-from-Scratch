import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    publishedDetails: {
      _id: {
        type: String,
      },
      userName: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        lowercase: true,
      },
      channelName: {
        type: String,
        required: true,
        unique: true,
        trim: true,
      },
      description: {
        type: String,
      },
      avatar: {
        type: String,
        require: true,
      },
      coverImage: {
        type: String,
      },
    },
    draftDetails: {
      userName: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
      },
      channelName: {
        type: String,
        unique: true,
        trim: true,
      },
      description: {
        type: String,
      },
      avatar: {
        type: String,
      },
      coverImage: {
        type: String,
      },
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
