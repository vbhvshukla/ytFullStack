import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  deleteVideo,
  getAllVideos,
  getVideoById,
  publishAVideo,
  togglePublishStatus,
  updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

//Upload video route
router.route("/uploadvideo").post(
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  verifyJWT,
  publishAVideo
);

//Get All Videos

router.route("/v/getallvideos").get(getAllVideos);

//Get Video Route
router.route("/v/:videoId").get(verifyJWT, getVideoById);

router
  .route("/v/updatevideo/:videoId")
  .patch(verifyJWT, upload.single("thumbnail"), updateVideo);

router.route("/v/deletevideo/:videoId").delete(deleteVideo);

router.route("/v/togglepublishstatus/:videoId").patch(togglePublishStatus);

export default router;
