import mongoose, { Schema } from 'mongoose';

const bookingSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User", // Links to the user model
            required: true,
        },
        movie: {
            type: Schema.Types.ObjectId,
            ref: "Movie", // Links to the movie model
            required: true,
        },
        seats: {
            type: [String], // Array of seat identifiers
            required: true,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        paymentMethod: {
            type: String,
            enum: ["Mastercard", "Visa", "Paypal"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["PENDING", "COMPLETED", "FAILED"],
            default: "PENDING",
        }
    },
    { timestamps: true}
);

export const Booking = mongoose.model("Booking", bookingSchema);
