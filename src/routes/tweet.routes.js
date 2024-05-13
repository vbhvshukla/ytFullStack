import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createTweet,
  deleteTweet,
  updateTweet,
  getUserTweets,
} from "../controllers/tweet.controller.js";
const router = Router();

router.route("/addtweet").post(verifyJWT, createTweet);

router.route("/getusertweet/:userId").get(verifyJWT, getUserTweets);

router.route("/updatetweet/:tweetId").patch(verifyJWT, updateTweet);

router.route("/deletetweet/:tweetId").delete(verifyJWT, deleteTweet);

export default router;
