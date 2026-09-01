import jwt from 'jsonwebtoken';
import { User } from '../models/userModel.js';

export const verifyJWT = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized request. Please login first" });
        }

        // Decode the token to who this is
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user in the database
        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid Access Token." });
        }

        req.user = user; // Attach the user object to the request for further use

        next(); 
    } catch (error) {
        return res.status(401).json({ success: false, message: "Unauthorized request. Please login first" });
    }
};

