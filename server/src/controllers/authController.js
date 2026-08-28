import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";



// register User Controller

// export const registerUser = catchAsync(async (req, res, next) => {
//     //  console.log("next =", typeof next);
//     // 1. Get Data From Request Body
//     const { name, email, password } = req.body;

//     // 2. Check Required Fields
//     if (!name || !email || !password) {
//         return next(new ApiError("Please fill all required fields", 400));
//     }

//     // 3. Check Existing User
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//         return next(new ApiError("Email already exists", 409));
//     }

//     // 4. Create New User
//     const user = await User.create({
//         name,
//         email,
//         password,
//     });

//     // 5. Send Response
//     res.status(201).json({
//         success: true,
//         message: "Account created successfully. Please login to continue.",
//     });
// });
export const registerUser = catchAsync(async (req, res, next) => {
    console.log("next =", typeof next);

    // 1. Get Data From Request Body
    const { name, email, password } = req.body;

    // 2. Check Required Fields
    if (!name || !email || !password) {
        return next(
            new ApiError("Please fill all required fields", 400)
        );
    }

    // 3. Check Existing User
    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return next(
            new ApiError("Email already exists", 409)
        );
    }

    // 4. Create New User
    const user = await User.create({
        name,
        email,
        password,
    });

    // 5. Generate Verification Token
    const verificationToken = crypto
        .randomBytes(32)
        .toString("hex");

    // 6. Hash Verification Token
    const hashedToken = crypto
        .createHash("sha256")
        .update(verificationToken)
        .digest("hex");

    // 7. Save Hashed Token + Expiry
    user.verificationToken = hashedToken;

    user.verificationTokenExpire =
        Date.now() + 15 * 60 * 1000;

    await user.save({
        validateBeforeSave: false,
    });

    // 8. Create Verification URL
    const verificationUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/verify-email/${verificationToken}`;

    // 9. Email Message
    const message = `
Welcome to Zalvix LeadOS!

Please verify your email address by clicking the link below:

${verificationUrl}

This verification link will expire in 15 minutes.

If you did not create this account, please ignore this email.
`;

    // 10. Send Verification Email
    await sendEmail({
        email: user.email,
        subject: "Verify Your Email - Zalvix LeadOS",
        message,
    });

    // 11. Response
    res.status(201).json({
        success: true,
        message:
            "Account created successfully. Please verify your email.",
    });
});

// Verify Email Controller

export const verifyEmail = catchAsync(async (req, res, next) => {
       console.log("RAW TOKEN:", req.params.token);
    // 1. Hash Token From URL
    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
 console.log("HASHED TOKEN:", hashedToken);
    console.log("CURRENT TIME:", Date.now());

    // 2. Find User With Valid Token
    const user = await User.findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() },
    });
  console.log("USER FOUND:", user ? user.email : null);
    // 3. Check Token
    if (!user) {
        return next(
            new ApiError(
                "Verification token is invalid or has expired",
                400
            )
        );
    }

    // 4. Verify User Email
    user.isVerified = true;

    // 5. Remove Verification Token
    user.verificationToken = null;
    user.verificationTokenExpire = null;

    // 6. Save User
    await user.save({
        validateBeforeSave: false,
    });

    // 7. Response
    res.status(200).json({
        success: true,
        message: "Email verified successfully",
    });
});

// Resend Verification Email Controller

export const resendVerificationEmail = catchAsync(
    async (req, res, next) => {
        // 1. Get Email
        const { email } = req.body;

        // 2. Validate Email
        if (!email) {
            return next(
                new ApiError("Please enter your email", 400)
            );
        }

        // 3. Find User
        const user = await User.findOne({ email });

        if (!user) {
            return next(
                new ApiError("User not found", 404)
            );
        }

        // 4. Check Already Verified
        if (user.isVerified) {
            return next(
                new ApiError("Email is already verified", 400)
            );
        }

        // 5. Generate New Verification Token
        const verificationToken = crypto
            .randomBytes(32)
            .toString("hex");

        // 6. Hash Token
        const hashedToken = crypto
            .createHash("sha256")
            .update(verificationToken)
            .digest("hex");

        // 7. Save New Token + Expiry
        user.verificationToken = hashedToken;

        user.verificationTokenExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save({
            validateBeforeSave: false,
        });

        // 8. Create Verification URL
        const verificationUrl = `${req.protocol}://${req.get(
            "host"
        )}/api/v1/auth/verify-email/${verificationToken}`;

        // 9. Email Message
        const message = `
Please verify your email address for Zalvix LeadOS.

Click the link below to verify your email:

${verificationUrl}

This verification link will expire in 15 minutes.

If you did not request this email, please ignore it.
`;

        // 10. Send Email
        await sendEmail({
            email: user.email,
            subject: "Resend Email Verification - Zalvix LeadOS",
            message,
        });

        // 11. Response
        res.status(200).json({
            success: true,
            message: "Verification email sent successfully",
        });
    }
);

// User Login Controller

// export const loginUser = catchAsync(async (req, res, next) => {
//     // 1. Get Email & Password
//     const { email, password } = req.body;

//     // 2. Validate Input
//     if (!email || !password) {
//         return next(new ApiError("Please enter email and password", 400));
//     }

//     // 3. Find User (Include Password)
//     const user = await User.findOne({ email }).select("+password");

//     // 4. Check User Exists
//     if (!user) {
//         return next(new ApiError("Invalid email or password", 401));
//     }

//     // 5. Compare Password
//     const isPasswordMatched = await user.comparePassword(password);

//     if (!isPasswordMatched) {
//         return next(new ApiError("Invalid email or password", 401));
//     }

//     // 6. Send JWT Token
//     return sendToken(user, 200, res, "Login successful");
// });
export const loginUser = catchAsync(async (req, res, next) => {
    // 1. Get Email & Password
    const { email, password } = req.body;

    // 2. Validate Input
    if (!email || !password) {
        return next(
            new ApiError("Please enter email and password", 400)
        );
    }

    // 3. Find User (Include Password)
    const user = await User.findOne({ email }).select("+password");

    // 4. Check User Exists
    if (!user) {
        return next(
            new ApiError("Invalid email or password", 401)
        );
    }

    // 5. Compare Password
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(
            new ApiError("Invalid email or password", 401)
        );
    }

    // 6. Check Email Verification
    if (!user.isVerified) {
        return next(
            new ApiError(
                "Please verify your email before logging in",
                403
            )
        );
    }

    // 7. Send JWT Token
    return sendToken(
        user,
        200,
        res,
        "Login successful"
    );
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

    const resetUrl = `${req.protocol}://${req.get(
        "host"
    )}/api/v1/auth/reset-password/${resetToken}`;

    const message = `
You requested a password reset.

Please use the following link to reset your password:

${resetUrl}

This link will expire in 15 minutes.

If you did not request this, please ignore this email.
`;

    await sendEmail({
        email: user.email,
        subject: "Password Reset Request",
        message,
    });

    res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
    });
});

// Reset Password Controller

export const resetPassword = catchAsync(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    const hashedToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ApiError("Reset token is invalid or has expired", 400)
        );
    }

    if (!password || !confirmPassword) {
        return next(
            new ApiError("Please enter password and confirm password", 400)
        );
    }

    if (password !== confirmPassword) {
        return next(
            new ApiError("Passwords do not match", 400)
        );
    }

    user.password = password;

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
    });
});