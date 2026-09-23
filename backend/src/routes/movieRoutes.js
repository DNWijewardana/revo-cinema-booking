import { Router } from "express";
import { getAllMovies, addMovie, deleteMovie } from "../controllers/movieController.js";
import { verifyJWT, isAdmin } from "../middlewares/authMiddleware.js";

const movieRouter = Router();

movieRouter.route("/")
.get(getAllMovies)
.post(verifyJWT, isAdmin, addMovie); // Admin only route to add a movie

movieRouter.route("/:id")
.delete(verifyJWT, isAdmin, deleteMovie); // admin only: remove a movie

export default movieRouter;
