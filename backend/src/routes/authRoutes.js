import { Router } from "express";
import { registerUser, loginUser, getCurrentUser, logoutUser } from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/me", verifyJWT, getCurrentUser); // Must logged in to access
router.post("/logout", logoutUser); 

export default router;


