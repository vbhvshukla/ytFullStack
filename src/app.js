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

export { app };
