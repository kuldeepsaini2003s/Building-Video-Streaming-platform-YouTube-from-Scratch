import { Router } from "express";
import {
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getAllVideo,
  updateViews,
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

router.get("/getVideo/:id", getVideoById);
router.get("/updateViews/:id", updateViews);

router.delete("/deleteVideo/:id", deleteVideo);

export default router;
