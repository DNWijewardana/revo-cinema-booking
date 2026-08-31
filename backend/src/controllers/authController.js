import { User } from "../models/userModel.js";

// Register a new user
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // check if user already exits
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Create a new user
    const user = await User.create({ name, email, password });
    await user.save();

    // Remove password from response for secuirity
    const createdUser = await User.findById(user._id).select("-password");
    res.status(201).json({ success: true, message: "User registered successfully", data: createdUser });
}   

// Login user & send cookie
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    // Check if user exits by email
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ stccess: false, message: "User does not exist, please register first" });
    }

    // Check if password is correct
    const isPasswordCorrect = await user.isPasswordCorrect(password);
    if (!isPasswordCorrect) {
        return res.status(400).json({ success: false, message: "Invalid Password" });
    }

    // Generate JWT Token
    const token = user.generateAccessToken();

    // Send token in an HTTP-Only secure cookie
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 // 1 Day
    };

    const loggedInUser = await User.findById(user._id).select("-password");

    res.status(200).cookie("accessToken", token, cookieOptions).json({
        success: true,
        message: "Logged in successfully", data: loggedInUser
    });
}

