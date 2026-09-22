import { Router } from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/current", verifyJWT, getCurrentUser); // Must logged in to access
router.post("/logout", loggeoutUser); 

export default router;


