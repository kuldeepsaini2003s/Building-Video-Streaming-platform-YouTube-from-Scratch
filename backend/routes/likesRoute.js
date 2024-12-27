import { Router } from "express";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/likesController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/likeVideo", verifyToken, toggleVideoLike);
router.post("/likeComment", verifyToken, toggleCommentLike);
router.post("/likeTweet", verifyToken, toggleTweetLike);

export default router;
