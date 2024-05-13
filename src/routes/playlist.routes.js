import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getPlaylistById,
  getUserPlaylists,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller.js";

const router = Router();

router.route("/createplaylist").post(verifyJWT, createPlaylist);

router
  .route("/addtoplaylist/:playlistId/:videoId")
  .post(verifyJWT, addVideoToPlaylist);

router.route("/getplaylist/:playlistId").get(getPlaylistById);

router.route("/getuserplaylist/:userId").get(getUserPlaylists);

router
  .route("/removevideofromplaylist/:videoId/:playlistId")
  .get(removeVideoFromPlaylist);

router.route("/deleteplaylist/:playlistId").get(deletePlaylist);

router.route("/updateplaylist/:playlistId").post(updatePlaylist);
export default router;
