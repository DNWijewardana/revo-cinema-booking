import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        posterUrl: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },
        genre: {
            type: [String], // Array of Strings to allow multiple genres
            required: true,
        },
        rating: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            required: true,
        },
        releaseDate: {
            type: Date,
            required: false,
        },
        nowShowing: {
            type: Boolean,
            required: true,
        }
    },
    { timestamps: true }
);

export const Movie = mongoose.model("Movie", movieSchema);
