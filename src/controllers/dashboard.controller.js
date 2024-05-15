import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Tweet } from "../models/tweet.model.js";

const getChannelStats = asyncHandler(async (req, res) => {
  // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(404, "Channel id not found!");
  }
  const totalViews = await Video.aggregate([
    {
      $match: {
        owner: channelId,
        isPublished: true,
      },
    },
    {
      $group: {
        //If you specify an _id value of null, or any other constant value,
        // the $group stage returns a single document that aggregates values
        // across all of the input documents.
        _id: null,
        totalViews: {
          $sum: "$views",
        },
      },
    },
    {
      $project: {
        _id: 1,
        totalViews: 1,
      },
    },
  ]);

  if (!totalViews) {
    throw new ApiError(404, "Something went wrong in totalViews");
  }

  const totalsubscribers = await Subscription.aggregate([
    {
      $match: {
        channel: channelId,
      },
    },
    {
      $group: {
        _id: null,
        totalSubs: {
          //Count number of documents in the group
          $sum: 1,
        },
      },
    },
    {
      $project: {
        totalSubs: 1,
      },
    },
  ]);

  if (!totalsubscribers) {
    throw new ApiError(404, "Something went wrong in totalsubscribers");
  }
  const totalVideos = await Video.aggregate([
    {
      $match: {
        owner: channelId,
        isPublished: true,
      },
    },
    {
      $group: {
        _id: null,
        totalVideo: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        totalVideo: 1,
      },
    },
  ]);

  if (!totalVideos) {
    throw new ApiError(404, "Something went wrong in totalVideos");
  }
  const totalLikes = await Like.aggregate([
    {
      $match: {
        owner: channelId,
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "Like",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes",
      },
    },
    {
      $unwind: {
        path: "$videoLikes",
      },
    },
    {
      $group: {
        _id: null,
        likes: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        likes: 1,
      },
    },
  ]);

  if (!totalLikes) {
    throw new ApiError(404, "Something went wrong in totalLikes");
  }
  const totalTweet = await Tweet.aggregate([
    {
      $match: {
        owner: channelId,
      },
    },
    {
      $group: {
        _id: null,
        tweets: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        tweets: 1,
      },
    },
  ]);

  if (!totalTweet) {
    throw new ApiError(404, "Something went wrong in totalTweet");
  }
  console.log(totalLikes);
  console.log(totalVideos);
  console.log(totalViews);
  console.log(totalTweet);
  console.log(totalsubscribers);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalLikes, totalVideos, totalsubscribers, totalTweet, totalViews },
        "Successfully got the channel states"
      )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
  // TODO: Get all the videos uploaded by the channel
});

export { getChannelStats, getChannelVideos };
