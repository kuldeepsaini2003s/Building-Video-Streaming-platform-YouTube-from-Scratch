import {
  draftDetails,
  getSavedDetails,
  getUserDetails,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updatePassword,
} from "../controllers/UserController.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/register",
  upload.fields([{ name: "avatar", maxCount: 1 }]),
  registerUser
);
router.post("/login", loginUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/refresh_token", refreshAccessToken);
router.post("/updatePassword", verifyToken, updatePassword);
router.post(
  "/saveDetails",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  verifyToken,
  draftDetails
);
router.post(
  "/publishDetails",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  verifyToken,
  draftDetails
);

router.get("/getUserDetails", verifyToken, getUserDetails);
router.get("/getSavedDetails", verifyToken, getSavedDetails);

export default router;
