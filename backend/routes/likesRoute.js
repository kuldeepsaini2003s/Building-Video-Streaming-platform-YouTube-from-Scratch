import { Router } from "express";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/likesController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);
router.get("/likeVideo/:videoId", toggleVideoLike);
router.get("/likeComment/:videoId", toggleCommentLike);
router.get("/likeTweet/:videoId", toggleTweetLike);

export default router;
