import { Router } from "express";
import {
  createPlaylist,
  updatePlaylist,
  deletePlaylist,
  removeVideo,
  addVideo,
  userPlaylist,
  playlistById,
} from "../controllers/PlaylistController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);

router.post("/createPlaylist", createPlaylist);
router.post("/updatePlaylist/:playlistId", updatePlaylist);
router.post("/addVideo", addVideo);
router.post("/removeVideo", removeVideo);

router.get("/userPlaylist/:userId", userPlaylist);
router.get("/getPlaylist/:playlistId", playlistById);

router.delete("/deletePlaylist/:playlistId", deletePlaylist);

export default router;
