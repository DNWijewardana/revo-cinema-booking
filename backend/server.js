import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

// Set up Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json()); 
app.use(cookieParser());

// Create a simple health-check route
app.get('/api/health', (req,res) => {
    res.status(200).json({ status: "Server is running", message: "Welcome to RevoCinema API" })
});

// Define the port and start the server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


