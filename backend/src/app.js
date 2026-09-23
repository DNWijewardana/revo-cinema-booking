import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import movieRouter from './routes/movieRoutes.js';
import authRouter from './routes/authRoutes.js';
import bookingRouter from "./routes/bookingRoutes.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();

// Middleware configuration
// Build the list of allowed origins. In development we also allow the common
// local dev servers (Live Server, port 3000) so credentialed requests work
// out of the box. In production, ONLY the origins in CLIENT_URL are allowed.
const envOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

const devOrigins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
];

const allowedOrigins = process.env.NODE_ENV === "production"
    ? envOrigins
    : [...new Set([...envOrigins, ...devOrigins])];

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json({ limit: "16kb" })) // Prevent large payloads
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Base route for health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: "Success", message: "Server is running smoothly!" })
});

// Api Routes
app.use("/api/v1/movies", movieRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use("/api/v1/admin", adminRouter);

// 404 fallback for any unmatched API route (returns JSON, not HTML)
app.use((req, res) => {
    res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
});

// Global error handler — turns thrown/async errors into clean JSON responses.
// Express 5 forwards rejected promises from async handlers here automatically.
app.use((err, req, res, next) => {
    console.error(err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Something went wrong on the server.";

    // Friendlier messages for common Mongoose errors
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map((e) => e.message).join(", ");
    } else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    } else if (err.code === 11000) {
        statusCode = 409;
        message = `Duplicate value for ${Object.keys(err.keyValue).join(", ")}`;
    }

    res.status(statusCode).json({ success: false, message });
});

export { app };



