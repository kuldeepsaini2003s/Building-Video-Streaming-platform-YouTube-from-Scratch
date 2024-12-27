import { Router } from "express";
import { verify } from "jsonwebtoken";
import {
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/likesController";

const router = Router();

router.route.post("/likeVideo", verify, toggleVideoLike);
router.route.post("/likeComment", verify, toggleCommentLike);
router.route.post("/likeTweet", verify, toggleTweetLike);

export default router;
