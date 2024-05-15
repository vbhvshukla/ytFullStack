import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//Configure CORS error
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//For data coming from URL

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

//Limit the json size
app.use(
  express.json({
    limit: "16kb",
  })
);

//This configuration stores files and folders that can be used publically in public folder

app.use(express.static("public"));

//Configure cookie parser

app.use(cookieParser());

app.on("error", (error) => {
  console.log("Custom ----------> Error -----------> at app.js", error);
  throw error;
});

//Routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import commentRouter from "./routes/comment.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import likeRouter from "./routes/like.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import { getChannelStats } from "./controllers/dashboard.controller.js";
// Routes Declaration

app.use("/api/v1/users", userRouter); //passing the control to the user.route.js

app.use("/api/v1/video", videoRouter);

app.use("/api/v1/subscription", subscriptionRouter);

app.use("/api/v1/playlist", playlistRouter);

app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/tweets", tweetRouter);

app.use("/api/v1/like",likeRouter);

app.use("/api/v1/dashboard",dashboardRouter);
export { app };
