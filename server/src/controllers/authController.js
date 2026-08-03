import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendToken from "../utils/sendToken.js";

export const registerUser = catchAsync(async (req, res, next) => {
  // 1. Get Data From Request Body
  const { name, email, password } = req.body;

  // 2. Check Required Fields
  if (!name || !email || !password) {
    return next(new ApiError("Please fill all required fields", 400));
  }

  // 3. Check Existing User
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new ApiError("Email already exists", 409));
  }

  // 4. Create New User
  await User.create({
    name,
    email,
    password,
  });

  // 5. Send Response
  res.status(201).json({
    success: true,
    message: "Account created successfully. Please login to continue.",
  });
});


// create Login User Controller

export const loginUser = catchAsync(async (req, res, next) => {
    // 1. Get Email & Password
    const { email, password } = req.body;

    // 2. Validate Input
    if (!email || !password) {
        return next(new ApiError("Please enter email and password", 400));
    }

    // 3. Find User (Include Password)
    const user = await User.findOne({ email }).select("+password");

    // 4. Check User Exists
    if (!user) {
        return next(new ApiError("Invalid email or password", 401));
    }

    // 5. Compare Password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ApiError("Invalid email or password", 401));
    }

    // 6. Send JWT Token
    sendToken(user, 200, res, "Login successful");
});

