import { Booking } from '../models/bookingModel.js';

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
    const { movieId, seats, totalPrice, paymentMethod } = req.body;
    
    // Verify if any of the requested seats are already booked
    const existingBookings = await Booking.find({ movie: movieId });

    // Check for overlaps
    const takenSeats = existingBookings.flatMap(booking => booking.seats);
    const isOverlapping = seats.some(seat => takenSeats.includes(seat));

    if (isOverlapping) {
        return res.status(400).json({ success: false, message: "One or more selected seats are already booked!" });
    }

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

