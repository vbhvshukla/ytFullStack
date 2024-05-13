import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) {
    throw new ApiError(405, "Please provide a valid content!");
  }
  const tweet = await Tweet.create({
    owner: req.user._id,
    content: content,
  });
  if (!tweet) {
    throw new ApiError(406, "Error in creating tweet!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, tweet, "Tweet created successfully!"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!userId) {
    throw new ApiError(407, "User ID not found!");
  }
  const userTweets = await Tweet.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(userId),
      },
    },

    {
      $project: {
        content: 1,
      },
    },
  ]);

  if (!userTweets) {
    throw new ApiError(400, "user tweets not existed");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, userTweets, "User tweets fetched successfully!")
    );
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!tweetId) {
    throw new ApiError(200, "TweetID does not exist!");
  }

  if (!content) {
    throw new ApiError(200, "Tweetdata does not exist!");
  }

  const tweetFound = await Tweet.findById(tweetId);
  if (!tweetFound) {
    throw new ApiError(400, "Tweet not found!");
  }

  if (!(tweetFound.owner.toString() === req.user?._id.toString())) {
    throw new ApiError(400, "User is not logged in by same id!");
  }

  try {
    const updatedTweet = await Tweet.findByIdAndUpdate(
      tweetId,
      {
        $set: {
          content: content,
        },
      },
      { new: true }
    );

    if (!updatedTweet) {
      throw new ApiError(400, "Error in updation of tweet");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, updatedTweet, "tweet updated successfuully"));
  } catch (error) {
    throw new ApiError(401, error.message || "Cannot update tweet");
  }
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "Tweet id not found");
  }

  const tweetFound = await Tweet.findById(tweetId);
  if (!tweetFound) {
    throw new ApiError(400, "Tweet does not exitsed");
  }
  console.log(tweetFound);
  if (!(tweetFound.owner.toString() === req.user?._id.toString())) {
    throw new ApiError(400, "User should be logged in with same id");
  }
  try {
    const tweetDeleted = await Tweet.findByIdAndDelete(
      {
        _id: tweetId,
      },
      {
        new: true,
      }
    );
    if (!tweetDeleted) {
      throw new ApiError(400, "Error while deleting the tweet");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Tweet Successfully Deleted"));
  } catch (error) {
    throw new ApiError(401, error?.message || "tweet cannot be deleted");
  }
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
