import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getAllVideoComments,
  updateComment,
} from "../controllers/comment.controller.js";

const router = Router();

router.route("/addcomment/:channelId/:videoId").post(verifyJWT,addComment);
router.route("/deletecomment/:commentId").delete(verifyJWT,deleteComment);
router.route("/updatecomment/:commentId").patch(verifyJWT,updateComment);
router.route("/getallcomments/:videoId").get(getAllVideoComments);

export default router;