import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
//Method : Register User

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
  const { fullName, email, username, password } = req.body;
  console.log(fullName, email, username, password);
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
  const existedUser = User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with same email or username already exists!");
  }

  // Image handling
  //Multer gives us req.files
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required!");
  }
  //Upload them to Cloudinary
  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is not found on Cloudinary!");
  }
  //Entry in DB
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

export { registerUser };
