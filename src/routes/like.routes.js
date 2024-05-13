import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  toggleCommentLike,
  toggleVideoLike,
  toggleTweetLike,
  getLikedVideos,
} from "../controllers/like.controller.js";

const router = Router();

//Toggle Video like
router.route("/togglevideolike/:videoId").get(verifyJWT, toggleVideoLike);

//Toggle Comment like
router.route("/togglecommentlike/:commentId").get(verifyJWT, toggleCommentLike);

//Toggle Tweet like
router.route("/toggletweetlike/:tweetId").get(verifyJWT, toggleTweetLike);

//Get liked video of a user
router.route("/getlikedvideos").get(verifyJWT, getLikedVideos);

export default router;
