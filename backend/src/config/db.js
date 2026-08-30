import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Connected to MongoDB! DB Host: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("MongoDB Connection Failed: ", error);
        process.exit(1); // Exit process with failure
    }
};

