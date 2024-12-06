import { Router } from "express";
import {
  createVideo,
  deleteVideo,
  getVideoById,
  updateVideo,
} from "../controllers/VideoController.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();
router.use(verifyToken);
router.post(
  "/createVideo",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  createVideo
);
router.post("/updateVideo/:id", upload.single("thumbnail"), updateVideo);
router.get("/getVideo/:id", getVideoById);
router.get("/deleteVideo/:id", deleteVideo);

export default router;
