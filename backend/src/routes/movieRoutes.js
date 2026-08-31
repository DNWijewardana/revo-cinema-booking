import { Router } from "express";
import { getAllMovies, createMovie } from "../controllers/movieController.js";

const router = Router();

router.route("/")
.get(getAllMovies)
.post(createMovie);

export default router;
