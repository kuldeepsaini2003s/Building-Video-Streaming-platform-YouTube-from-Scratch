import { Router } from "express";
import {
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideo,
  updateViews,
  addVideoToWatched,
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
router.post("/getAllVideo", getAllVideo);

router.get("/add_To_Watched/:videoId", addVideoToWatched);
router.get("/getVideo/:videoId", getVideoById);
router.get("/updateViews/:videoId", updateViews);

router.delete("/deleteVideo/:id", deleteVideo);

export default router;
