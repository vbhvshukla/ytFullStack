import mongoose from "mongoose";
const playlistSchema = new mongoose.Schema(
  {
    name:{
        type: String,
        required: true,
    },
    description:{
        type:String,
    },
    videos: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);