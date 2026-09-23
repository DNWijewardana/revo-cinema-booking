import { Router } from "express";
import { getDashboardStats, getAllUsers, getAllBookings } from "../controllers/adminController.js";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";

const router = Router();

// Protect every route on this router in one line: must be logged in and an admin
router.use(verifyJWT, isAdmin);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.get("/bookings", getAllBookings);

export default router;


