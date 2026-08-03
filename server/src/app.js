import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimiter.js";
import hpp from "hpp";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import ApiError from "./utils/ApiError.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

// Security
app.use(helmet());

// CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
    })
);
// Logger
app.use(morgan("dev"));
// Compression
app.use(compression());

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use(hpp());

app.use("/api", apiLimiter);

// Test Route
app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to Zalvix LeadOS API",
    });
});
app.get("/test", (req, res, next) => {
  return next(new ApiError("Testing Global Error Handler", 400));
});
app.use("/api/v1/auth", authRoutes);
http://localhost:5000/api/v1/auth/register
// Error Middleware (Always Last)
app.use(errorMiddleware);

export default app;