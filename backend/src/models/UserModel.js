import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    channelName: {
      type: String,
      required: true,
      trim: true,
    },
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
    avatar: {
      type: String,
      required: true,
    },
    coverImage: {
      type: String,
    },
    description: {
      type: String,
    },
    draftDetails: {
      userName: { type: String },
      channelName: { type: String },
      description: { type: String },
      avatar: { type: String },
      coverImage: { type: String },
    },
    publishedDetails: {
      userName: { type: String },
      channelName: { type: String },
      description: { type: String },
      avatar: { type: String },
      coverImage: { type: String },
    },
    watchHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    refreshToken: { type: String },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
