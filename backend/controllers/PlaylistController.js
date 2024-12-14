import { Playlist } from "../models/playlistModel.js";
import { User } from "../models/userModel.js";

const createPlaylist = async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findById(req.user._id);

  if (!req.user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  try {
    const playlist = await Playlist.create({
      title,
      description,
      owner: user._id,
    });

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Playlist created successfully",
    });
  } catch (error) {
    console.log("Error while creating playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const updatePlaylist = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { playlistId } = req.params;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { title, description },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Playlist updated successfully",
    });
  } catch (error) {
    console.log("Error while updating playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const getUserPlaylist = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const playlists = await Playlist.find({ owner: user._id });

    if (!playlists || playlists.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User does not have any playlists" });
    }

    return res.status(200).json({
      success: true,
      data: playlists,
      message: "User's playlists fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting user playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

const getPlaylistById = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: true,
      data: playlist,
      message: "Playlist fetched successfully",
    });
  } catch (error) {
    console.log("Error while getting playlist", error);
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong" });
  }
};

const addVideoToPlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const { videoId } = req.params;

  if (!playlistId || !videoId) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(400).json({ success: false, message: "User not found" });
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $push: { video: videoId } },
    { new: true }
  );

  if (!playlist) {
    return res
      .status(404)
      .json({ success: false, message: "Playlist not found" });
  }

  return res.status(200).json({
    success: true,
    data: playlist,
    message: "Video added to playlist successfully",
  });
};

const removeVideoFromPlaylist = async (req, res) => {
  try {
    const { playlistId } = req.body;
    const { videoId } = req.params;

    if (!playlistId || !videoId) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const playlist = await Playlist.findByIdAndUpdate(
      playlistId,
      { $pull: { video: videoId } },
      { new: true }
    );

    if (!playlist) {
      return res
        .status(404)
        .json({ success: false, message: "Playlist not found" });
    }

    return res.status(200).json({
      success: false,
      message: "Video removed from playlist successfully",
    });
  } catch (error) {
    console.log("Error while removing video from playlist", error);

    return res
      .status(500)
      .json({ success: false, message: "something went wrong" });
  }
};

const deletePlaylist = async (req, res) => {
  try {
    const { playlistId } = req.params;

    const playlist = await Playlist.findOneAndDelete({ _id: playlistId });

    if (!playlist) {
      return res.status(404).json({
        success: false,
        message: "Playlist not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Playlist deleted successfully",
    });
  } catch (error) {
    console.log("Error while deleting playlist", error);

    return res.status(500).json({
      success: false,
      message: "something went wrong",
    });
  }
};

export {
  createPlaylist,
  updatePlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
};
