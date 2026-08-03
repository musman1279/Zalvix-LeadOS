import jwt from "jsonwebtoken";
import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import catchAsync from "../utils/catchAsync.js";

// Protect Routes
export const protect = catchAsync(async (req, res, next) => {
    // 1. Get Token from Cookies
    const { token } = req.cookies;

    // 2. Check Token Exists
    if (!token) {
        return next(new ApiError("Please login to access this resource", 401));
    }

    // 3. Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find User
    const user = await User.findById(decoded.id);

    // 5. Check User Exists
    if (!user) {
        return next(new ApiError("User no longer exists", 401));
    }

    // 6. Attach User to Request
    req.user = user;

    // 7. Continue
    next();
});

// Role Authorization
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ApiError(
                    `Role (${req.user.role}) is not allowed to access this resource`,
                    403
                )
            );
        }

        next();
    };
};