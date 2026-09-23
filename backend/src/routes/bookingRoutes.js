import { Router } from "express";
import { createBooking, getAllBookings, getMyBookings } from "../controllers/bookingController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

// Anyone can view booked seats for a movie
router.route("/seats/:movieId").get(getAllBookings);

// Logged in users can view their own bookings
router.route("/my").get(verifyJWT, getMyBookings);

// But only logged in users can book tickets
router.route("/").post(verifyJWT, createBooking);

export default router;
