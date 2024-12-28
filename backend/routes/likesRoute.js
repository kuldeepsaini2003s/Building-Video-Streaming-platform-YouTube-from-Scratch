import { Router } from "express";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/likesController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);
router.get("/likeVideo", toggleVideoLike);
router.get("/likeComment", toggleCommentLike);
router.get("/likeTweet", toggleTweetLike);

export default router;
