import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(400, "channel Id is missing");
  }
  //Find in Subscription if the same channel id and subscriber is there
  const subscription = await Subscription.findOne({
    channel: channelId,
    subscriber: req.user._id,
  });
  //If no subscription is found create one if found delete the subscription
  if (!subscription) {
    await Subscription.create({
      channel: channelId,
      subscriber: req.user._id,
    });
  } else {
    await Subscription.findByIdAndDelete(subscription._id);
  }

  //Take a new isSubscribed and send the subscription status through this
  const subscribed = await Subscription.findOne({
    channel: channelId, //To which channel/user I subscribed to
    subscriber: req.user._id, //The user id from which I subscribed
  });

  let isSubscribed;
  if (!subscribed) {
    isSubscribed = false;
  } else {
    isSubscribed = true;
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isSubscribed,
      },
      "success"
    )
  );
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!channelId) {
    throw new ApiError(405, "No Channel ID provided");
  }
  const subscribers = await Subscription.aggregate([
    {
      $match: {
        channel: new mongoose.Types.ObjectId(channelId), //Matches the channel field in subscription with the channelId provided
      },
    },
    {
      //Getting users/subscribers
      $lookup: {
        from: "users",
        localField: "subscriber", //this is the local field of subscription collection
        foreignField: "_id", //this is the foregin field of the user collection these both will match then it will return as
        as: "subscribers", //subscribers collection
        pipeline: [
          {
            $project: {
              username: 1,
              avatar: 1,
              fullname: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        subscriber: 1,
        createdAt: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        subscribers,
        "Channel's Subscribers Fetched Successfully!"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!subscriberId) {
    throw new ApiError(400, "SubscriberId is required");
  }

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: { 
        subscriber: new mongoose.Types.ObjectId(subscriberId)
            },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel", //Channel field of subscription model
        foreignField: "_id", //Id field of user model
        as: "channel",
        pipeline: [
          {
            $project: {
              username: 1,
              fullName: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $project: {
        channel: 1,
        createdAt: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, subscribedChannels, "Successully fetched channels"));
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
