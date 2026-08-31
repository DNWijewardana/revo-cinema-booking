import { Router } from "express";
import { getAllMovies, addMovie } from "../controllers/movieController.js";

const movieRouter = Router();

movieRouter.route("/")
.get(getAllMovies)
.post(addMovie);

export default movieRouter;
