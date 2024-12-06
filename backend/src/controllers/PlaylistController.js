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
      owner: req.user._id,
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

const updatePlaylist = async (req, res) => {};

const getUserPlaylist = async (req, res) => {};

const getPlaylistById = async (req, res) => {};

const addVideoToPlaylist = async (req, res) => {};

const removeVideoFromPlaylist = async (req, res) => {};

const deletePlaylist = async (req, res) => {};

export {
  createPlaylist,
  updatePlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
};
