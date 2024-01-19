import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

//Generate access and refresh token both func in one func

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    //Save refresh token in db

    user.refreshToken = refreshToken; //model's refresh token to refresh token
    await user.save({ validateBeforeSave: false }); //save method of mongo db

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Can't generate refresh and/ access token");
  }
};

//Method : Register User , Login User, Logout User

const registerUser = asyncHandler(async (req, res) => {
  //Steps to make this registerUser function
  /*
        1) Get user details from frontend
        2) Validation of data - not empty
        3) Check if user already exists : from username and email
        4) Check for images (Check for avatar as it is required in model)
        5) Upload them to cloudinary ,avatar and get the response from cloudinary
        6) Create user object - create entry in DB.
        7) Remove password and refresh token field from response.
        8) Check for user creation.
        9) Return response if user created else send null.
   */
  const { fullName, email, username, password } = req.body; //Destructure the req
  //Validation to check if any field is empty
  if (
    [fullName, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!");
  }
  //   if(fullName === ""){
  //     throw new ApiError(400,"Fullname is required!");
  //   } //one way to check validation

  //Check if user already exists by email or username
  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists!");
  }

  //Image handling
  //Multer gives us req.files
  const avatarLocalPath = req.files?.avatar[0]?.path; //Req.files.avatar is an array of object which contains fil details
  //const coverImageLocalPath = req.files?.coverImage[0]?.path; // declared if below

  let coverImageLocalPath;
  //Check if coverImageLocalPath exists.
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!");
  }
  //Upload them to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is not found on Cloudinary!");
  }
  // Entry in DB
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "", //check if coverImage is there or not
    email,
    password,
    username: username.toLowerCase(),
  });

  //Check if user is created or not and remove password and refreshToken
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "User registration failed!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  //Steps to make this loginUser function
  /*
  take data from req.body
  take username or email
  take password
  find the user
  check if user exists
  check if password is correct
  if password is correct -> generate access token and refresh token
  send these tokens in cookies(secured) and send login successful
  */
  const { email, username, password } = req.body;
  console.log(password);
  if (!username && !email) {
    throw new ApiError(400, "Username or email is required!");
  }
  //Find first matching tuple query ($or)
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  console.log(user);

  if (!user) {
    throw new ApiError(404, "User does not exist!");
  }

  //Check if password is correct(function defined in model)
  const isPasswordValid = await user.isPasswordCorrect(password);

  //const isPasswordValid = await bcrypt.compare(password, user.password);


  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }

  //Calling above generate function
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  //Exclude password and refreshtoken before sending them in cookies
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  //Send tokens in cookies (only modifiable by server not browser)
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options) //key value option //from cookie parser
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User login successful!"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  //Steps to make this logoutUser function
  /*
    Clear refresh token

  */
  //We get req.user in in here because before executing this we had verifyJWT in which we had access to user in auth.middleware.js
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  //Send tokens in cookies (only modifiable by server not browser)
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out!"));
});

export { registerUser, loginUser, logoutUser };
