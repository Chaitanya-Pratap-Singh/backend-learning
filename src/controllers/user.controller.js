import { asyncHandler } from "../utils/asyncHandler.js";
import { apiError } from "../utils/apiErrors.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  /*1.details from frontend
     2. validation of details 
     3. already existing user :check username and email
     4. check for images
     5. upload the images to cloudinary     
     6. create objects - create entry in db   
     7.password and refresh token
     8. check for user creation 
     9. return response or return error

    */
  const { fullName, email, userName, password } = req.body;
  // console.log("email", email);

  if (fullName === "" || email === "" || userName === "" || password === "") {
    throw new apiError(400, "fields must not be empty ");
  }
  const existedUser = await User.findOne({ $or: [{ userName }, { email }] });

  if (existedUser) {
    throw new apiError(409, "user already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  let coverImageLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }
  // console.log(req.files);

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar missing");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "avatar missing");
  }

  //sending data to db
  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    userName: userName.toLowerCase(),
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "something went wrong");
  }
  return res
    .status(201)
    .json(new apiResponse(200, createdUser, "user created successfully"));
});

export { registerUser };
