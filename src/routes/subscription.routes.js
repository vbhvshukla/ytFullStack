import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSubscribedChannels, getUserChannelSubscribers, toggleSubscription } from "../controllers/subscription.controller.js";

const router = Router();

// Toggle Subscription Route

router.route("/c/subscribe/:channelId").post(verifyJWT,toggleSubscription);

//To get subscriber list of a channel
router.route("/c/getsubscribers/:channelId").post(getUserChannelSubscribers);


//To get user's subscribed channel list
router.route("/c/getsubscribed/:subscriberId").post(getSubscribedChannels);

export default router;