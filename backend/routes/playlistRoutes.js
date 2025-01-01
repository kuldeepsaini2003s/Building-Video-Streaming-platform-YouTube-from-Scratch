import { Router } from "express";
import {
  createPlaylist,
  updatePlaylist,
  getUserPlaylist,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
} from "../controllers/PlaylistController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);

router.post("/createPlaylist", createPlaylist);
router.post("/updatePlaylist/:playlistId", updatePlaylist);
router.post("/addVideoToPlaylist/:videoId", addVideoToPlaylist);

router.get("/userPlaylist/:userId", getUserPlaylist);
router.get("/getPlaylist/:playlistId", getPlaylistById);
router.get("/deleteVideoFromPlaylist/:videoId", removeVideoFromPlaylist);

router.delete("/deletePlaylist/:playlistId", deletePlaylist);

export default router;
