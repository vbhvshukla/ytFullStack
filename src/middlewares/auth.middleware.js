import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { User } from "../models/user.model";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    //We've to find token so we can use header or cookies
    //In header we have a field as "Authorization" in which there is "Bearer <Token>" to get
    //token we've to replace or delete Bearer so we request the header authorization and replace
    //bearer with empty string ""
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    //This decoded token has the information declared in user.model.js in generateAccessToken method
    //in which we gave 4 parameters _id,email,username,fullname
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    ); //If you're coming from the comments of user.controller.js logoutuser req.user._id

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});
