import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  console.log(
    "------------------------------------------------------------------------------------------------------"
  );

  // Parse page and limit to numbers
  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  // Validate and adjust page and limit values.

  page = Math.max(1, page); // Ensure page is at least 1
  limit = Math.min(20, Math.max(1, limit)); // Ensure limit is between 1 and 20

  const pipeline = [];

  // Match videos by owner userId if provided
  if (userId) {
    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "userId is invalid");
    }

    pipeline.push({
      $match: {
        owner: mongoose.Types.ObjectId(userId),
      },
    });
  }

  // Match videos based on search query
  if (query) {
    pipeline.push({
      $match: {
        $text: {
          $search: query,
        },
      },
    });
  }

  // Sort pipeline stage based on sortBy and sortType
  const sortCriteria = {};
  if (sortBy && sortType) {
    sortCriteria[sortBy] = sortType === "asc" ? 1 : -1;
    pipeline.push({
      $sort: sortCriteria,
    });
  } else {
    // Default sorting by createdAt if sortBy and sortType are not provided
    sortCriteria["createdAt"] = -1;
    pipeline.push({
      $sort: sortCriteria,
    });
  }

  // Apply pagination using skip and limit
  pipeline.push({
    $skip: (page - 1) * limit,
  });
  pipeline.push({
    $limit: limit,
  });

  // Execute aggregation pipeline
  const Videos = await Video.aggregate(pipeline);

  if (!Videos || Videos.length === 0) {
    throw new ApiError(404, "Videos not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, Videos, "Videos fetched Successfully"));
});

//Tested
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description, isPublished } = req.body;

  // TODO: get video, upload to cloudinary, create video
  const videoLocalPath = req.files?.videoFile[0].path;
  const thumbnailLocalPath = req.files?.thumbnail[0].path;

  if (!videoLocalPath && !thumbnail) {
    throw new ApiError(400, "Video & Thumbnail is required!");
  }
  const videoFile = await uploadOnCloudinary(videoLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile && !thumbnail) {
    throw new ApiError(400, "Video & Thumbnail is not found on Cloudinary!");
  }

  const video = await Video.create({
    title: title,
    description: description,
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    duration: videoFile.duration,
    isPublished: isPublished,
    owner: req.user,
    views:0
  });

  if (!video) {
    throw new ApiError(500, "Video upload failed");
  }

  console.log(video);

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video uploaded successfully!"));
});

//Tested
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: get video by id
  if (!videoId) {
    throw new ApiError(404, "Video ID not found!");
  }
  // console.log(videoId);
  // console.log("this is " + mongoose.isValidObjectId(videoId));
  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video Not Found!");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video found successfully!"));
});

//Tested
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;
  const thumbnailLocalPath = req.file?.path;

  if (!(title && description)) {
    throw new ApiError(404, "Title/Description not found!");
  }

  if (!thumbnailLocalPath) {
    throw new ApiError(404, "Please upload thumbnail/Thumbnail!");
  }
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!thumbnail) {
    throw new ApiError(500, "Error in uploading on Cloudinary!");
  }

  const updatedVideoDetails = await Video.findByIdAndUpdate(
    videoId,
    {
      title,
      description,
      thumbnail: thumbnail?.url,
    },
    { new: true }
  );

  if (!updatedVideoDetails) {
    throw new ApiError(404, "Can't update video details");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedVideoDetails, "Video updated successfully")
    );
});

//Tested
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const deletedVidResponse = await Video.findByIdAndDelete(videoId);
  if (!deletedVidResponse) {
    throw new ApiError(405, "Error in deleting video");
  }
  return res.status(200).json(new ApiResponse(200, "Deleted successfully"));
});

//Tested
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { isPublished } = req.body;
  console.log(isPublished);
  console.log(videoId);
  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        isPublished: isPublished,
      },
    },
    {
      new: true,
    }
  );
  if (!video) {
    throw new ApiError(404, "Video couldn't be updated");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video toggled successfully!"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};
