import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { getVideoById, publishAVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/uploadvideo").post(upload.fields([
    {
        name:"videoFile",
        maxCount:1
    },
    {   
        name:"thumbnail",
        maxCount:1
    }
]),verifyJWT,publishAVideo);


router.route("/v/:videoId").get(verifyJWT, getVideoById);


export default router;