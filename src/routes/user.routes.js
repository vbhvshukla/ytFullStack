import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getWatchHistory,
  getUserChannelProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    //this is middleware used before calling registerUser
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
); //calls this function registerUser

router.route("/login").post(loginUser);

//Secured Routes

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJWT, logoutUser); //we wrote next() in auth.middleware.js so we can use verifyJWT before executing logoutUser

router.route("/change-password").post(verifyJWT, changeCurrentPassword);

router.route("/current-user").get(verifyJWT, getCurrentUser);
//Only update selected details we use patch
router.route("/update-account").patch(verifyJWT, updateAccountDetails);

router
  .route("/update-user-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

router
  .route("/update-user-cover-img")
  .patch(verifyJWT, upload.single("/coverImage"), updateUserCoverImage);
//We're going to use params for username
router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

router.route("/user-history").get(verifyJWT, getWatchHistory);

export default router;
