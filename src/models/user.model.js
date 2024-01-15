import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //for searching in mongodb in optimzed mode
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String, //Cloudinary url
      required: true,
    },
    coverImage: {
      type: String, //Cloudinary url
    },
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

//Pre hook("type" => (function)) dont use ("save",()=> {})
//this pre gives us next and this pre hook
// gets executed before data is saved
userSchema.pre("save", async function (next) {
  //modified is inbuilt
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10); // 10 rounds
  next(); //whenever password get saved again new hashing takes place optimize it to only encrypt when password is new or modified in if statement.
});

//Methods

//Password validation method
userSchema.methods.isPasswordCorrect = async (password) => {
  return await bcrypt.compare(password, this.password); //password is password sent by user, this.password is encrypted
};
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id, //this is coming from db
      email: this.email, //email is payload and value is from db this.email
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id, //this is coming from db
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};
export const User = mongoose.model("User", userSchema); //in mongodb this "User" will get saved as users
