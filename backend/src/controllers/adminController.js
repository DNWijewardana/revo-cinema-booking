import { User } from "../models/userModel.js";
import { Movie } from "../models/movieModel.js";
import { Booking } from "../models/bookingModel.js";

// High-level stats for the dashboard cards
export const getDashboardStats = async (req, res) => {
    // Run all three counts in parallel — faster than awaiting one by one
    const [movieCount, userCount, bookings] = await Promise.all([
        Movie.countDocuments(),
        User.countDocuments(),
        Booking.find({}),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    res.status(200).json({
        success: true,
        data: {
            movies: movieCount,
            users: userCount,
            bookings: bookings.length,
            revenue: totalRevenue,
        },
    });
};

// Every registered user
export const getAllUsers = async (req, res) => {
    const users = await User.find({})
        .select("-password") // never leak password hashes
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: users.length, data: users });
};

// Every booking in the system (with who & what)
export const getAllBookings = async (req, res) => {
    const bookings = await Booking.find({})
        .populate("user", "name email")
        .populate("movie", "title")
        .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
};