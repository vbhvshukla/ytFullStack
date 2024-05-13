import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  try {
    if (!videoId) {
      throw new ApiError(405, "Missing video ID");
    }
    const videoFound = await Video.findById(videoId);
    if (!videoFound && videoFound.isPublished) {
      throw new ApiError(422, "Video not found or is not published");
    }
    const userAlreadyLiked = await Like.find({
      video: videoId,
      likedBy: req.user._id,
    });
    console.log(userAlreadyLiked);
    if (userAlreadyLiked <= 0) {
      const liked = await Like.create({
        video: videoId,
        likedBy: req.user._id,
      });
      return res
        .status(200)
        .json(new ApiResponse(200, liked, "Liked the video"));
    } else {
      await Like.findByIdAndDelete(userAlreadyLiked, { new: true });
      return res
        .status(200)
        .json(new ApiResponse(200, "Unliked video successfully"));
    }
  } catch (error) {
    throw new ApiError(459, error);
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;
  console.log(userId);
  if (!commentId) {
    throw new ApiError(405, "Missing comment ID");
  }
  const commentFound = await Comment.findById(commentId);
  if (!commentFound) {
    throw new ApiError(422, "Comment not found!");
  }
  const userAlreadyLiked = await Like.find(
    {
      comment: commentId,
      likedBy: req.user._id,
    },
    { new: true }
  );
  if (userAlreadyLiked <= 0) {
    const liked = await Like.create({
      comment: commentId,
      likedBy: req.user._id,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, liked, "Liked the comment"));
  } else {
    await Like.findByIdAndDelete(userAlreadyLiked);
    return res
      .status(200)
      .json(new ApiResponse(200, "Unliked comment successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const userId = req.user._id;
  if (!tweetId) {
    return res.status(402).json(new ApiError(402, "Tweet ID not found!"));
  }

  const tweetFound = await Tweet.findById(tweetId);

  if (!tweetFound) {
    return res.status(404).json(new ApiError(404, "Tweet not found!"));
  }

  const userAlreadyLiked = await Like.find({
    tweet: tweetId,
    likedBy: userId,
  });
  if (userAlreadyLiked.length > 0) {
    await Like.findByIdAndDelete(userAlreadyLiked);
    return res.status(200).json(new ApiResponse(200, "Disliked successfully!"));
  } else {
    const liked = await Like.create({
      tweet: tweetId,
      likedBy: userId,
    });

    if (!liked) {
      return res.status(500).json(new ApiError(500, "Failed to like tweet"));
    }

    return res.status(200).json(new ApiResponse(200, liked, "Liked Tweet!"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const likedVideos = await Like.aggregate([
      {
        $match: {
          likedBy: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "videos",
          localField: "video",
          foreignField: "_id",
          as: "likedVideos",
        },
      },
      {
        $project: {
          likedVideos: 1,
        },
      },
    ]);
    if (likedVideos.length==0) {
      return res.status(200).json(new ApiResponse(200, "No videos liked"));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, likedVideos, "Fetched liked videos successfully!")
      );
  } catch (error) {
    throw new ApiError(402, "Something went wrong in like controller");
  }
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
