import { Router } from "express";
import {
  channelSubscribers,
  subscribedChannels,
  subscribe,
  unSubscribe,
} from "../controllers/SubscriptionController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyToken);

router.get("/subscribe/:channelName", subscribe);
router.get("/unsubscribe/:channelName", unSubscribe);
router.get("/subscribedChannels", subscribedChannels);
router.get("/channelSubscribers", channelSubscribers);

export default router