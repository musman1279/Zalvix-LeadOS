import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";

export const registerUser = catchAsync(async (req, res, next) => {
     console.log("next =", typeof next);
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
    const user = await User.create({
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


// User Login Controller

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
    return sendToken(user, 200, res, "Login successful");
});


// User Logout Controller

export const logoutUser = (req, res) => {
    return res
        .status(200)
        .cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        })
        .json({
            success: true,
            message: "Logged out successfully",
        });
};


// Get Current User (/me)

export const getCurrentUser = catchAsync(async (req, res, next) => {
    res.status(200).json({
        success: true,
        user: req.user,
    });
});


// Forgot Password Controller

export const forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ApiError("Please enter your email", 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new ApiError("User not found", 404));
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedToken;

    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "Password reset token generated",
        resetToken,
    });
});