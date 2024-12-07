import { Router } from "express";
import {
  createVideo,
  getVideoById,
  getAllVideos,
  updateVideo,
  deleteVideo,
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
router.get("/getAllVideo/:userId", getAllVideos);

router.delete("/deleteVideo/:id", deleteVideo);

export default router;
