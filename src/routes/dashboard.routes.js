import { Router } from "express";
import { getChannelStats } from "../controllers/dashboard.controller.js";

const router = Router();

router.route("/getchannelstats/:channelId").get(getChannelStats);

export default router;

