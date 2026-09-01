import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import movieRouter from './routes/movieRoutes.js';
import authRouter from './routes/authRoutes.js';
import bookingRouter from "./routes/bookingRoutes.js";

const app = express();

// Middleware configuration
app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
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

export { app };

