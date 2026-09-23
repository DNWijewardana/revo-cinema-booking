import { Movie } from '../models/movieModel.js';

// Get all movies
export const getAllMovies = async (req,res) => {
    // Fetch all movies from the database
    const movies = await Movie.find({});

    // Send Successful JSON response
    res.status(200).json({
        success: true,
        count: movies.length,
        data: movies
    });
};

// Add a new movie
export const addMovie = async (req,res) => {
    // Get the movie details from the request body
    const  MovieData = req.body;

    // Create and save the movie to the database
    const newMovie = await Movie.create(MovieData);

    // Send response back
    res.status(201).json({
        success: true,
        data: newMovie
    });
};

// Delete a movie by id
export const deleteMovie = async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
        return res.status(404).json({ success: false, message: "Movie not found" });
    }

    res.status(200).json({ success: true, message: "Movie deleted successfully" });
};

