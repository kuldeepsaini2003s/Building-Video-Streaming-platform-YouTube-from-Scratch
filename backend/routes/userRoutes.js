import {
  getChannelDetails,
  getSavedDetails,
  getUserDetails,
  getWatchHistory,
  loginUser,
  logoutUser,  
  refreshAccessToken,
  registerUser,  
  updatePassword,
  updateUserDetails,
} from "../controllers/UserController.js";
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", upload.single("avatar"), registerUser);
router.post("/login", loginUser);
router.get("/logout", verifyToken, logoutUser);
router.get("/refresh_token", refreshAccessToken);
router.post("/updatePassword", verifyToken, updatePassword);
router.post("/updateUserDetails", verifyToken, upload.fields([{name:"avatar", maxCount:1}, {name : "coverImage", maxCount:1}]), updateUserDetails);

router.get("/getUserDetails", verifyToken, getUserDetails);
router.get("/getSavedDetails", verifyToken, getSavedDetails);
router.get("/getChannelDetails/:userName", verifyToken, getChannelDetails);
router.get("/getWatchHistory", verifyToken, getWatchHistory);

export default router;
