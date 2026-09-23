import { Booking } from '../models/bookingModel.js';

const SEAT_PRICE = 800; // LKR per seat — the single source of truth for pricing

// Get all bookings
export const getAllBookings = async (req, res) => {
    const { movieId } = req.params;

    // Find all bookings for this movie
    const bookings = await Booking.find({ movie: movieId });

    // Extract just the seats into a single flat arrray
    let bookedSeats = [];
    bookings.forEach(booking => {
        bookedSeats.push(...booking.seats);
    });

    res.status(200).json({ success: true, bookedSeats });
};

// Create a new booking 
export const createBooking = async (req, res) => {
    const { movieId, seats, paymentMethod } = req.body;

    // Basic input validation
    if (!movieId || !Array.isArray(seats) || seats.length === 0 || !paymentMethod) {
        return res.status(400).json({
            success: false,
            message: "movieId, at least one seat, and a payment method are required.",
        });
    }

    // Verify if any of the requested seats are already booked
    const existingBookings = await Booking.find({ movie: movieId });

    // Check for overlaps
    const takenSeats = existingBookings.flatMap(booking => booking.seats);
    const isOverlapping = seats.some(seat => takenSeats.includes(seat));

    if (isOverlapping) {
        return res.status(400).json({ success: false, message: "One or more selected seats are already booked!" });
    }

    // Price is calculated on the server — never trust the amount sent by the client
    const totalPrice = seats.length * SEAT_PRICE;

    // Create the booking!
    const newBooking = await Booking.create({
        user: req.user._id,
        movie: movieId,
        seats,
        totalPrice,
        paymentMethod
    });

    res.status(201).json({ success: true, message: "Tickets booked successfully!", data: newBooking });
};

// Get all bookings for the currently logged-in user
export const getMyBookings = async (req, res) => {
    // req.user was attached by verifyJWT - this is the ONLY trusted user id
    const bookings = await Booking.find({ user: req.user._id })
    .populate("movie", "title posterUrl language") // Join with movie details
    .sort({ createdAt: -1 }); // Newest first

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
};

