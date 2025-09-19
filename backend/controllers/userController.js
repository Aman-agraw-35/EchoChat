import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { uploadToCloudinary } from "../config/cloudinary.js";
import { Readable } from 'stream';

export const register = async (req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender, profilePhotoType } = req.body;
        
        // Validate required fields
        if (!fullName || !username || !password || !confirmPassword || !gender) {
            return res.status(400).json({ 
                success: false,
                message: "All fields are required" 
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(400).json({ 
                success: false,
                message: "Password do not match" 
            });
        }

        // Check if username exists
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ 
                success: false,
                message: "Username already exists, please try a different one" 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Handle profile photo
        let profilePhoto;
        if (profilePhotoType === 'custom' && req.file) {
            try {
                // Upload file buffer to Cloudinary
                const uploadResult = await uploadToCloudinary(req.file.buffer);
                if (!uploadResult) {
                    throw new Error('Failed to upload image');
                }
                profilePhoto = uploadResult;
            } catch (error) {
                console.error('Error uploading to Cloudinary:', error);
                return res.status(500).json({ 
                    success: false,
                    message: 'Error uploading image. Please try again.',
                    error: error.message 
                });
            }
        } else {
            // Use default avatar if no file uploaded or avatar type selected
            profilePhoto = gender === "male" ?
                `https://avatar.iran.liara.run/public/boy?username=${username}` :
                `https://avatar.iran.liara.run/public/girl?username=${username}`;
        }

        // Create user
        const newUser = await User.create({
            fullName,
            username,
            password: hashedPassword,
            profilePhoto,
            profilePhotoType: profilePhotoType || 'avatar',
            gender
        });

        // Return success response
        return res.status(201).json({
            success: true,
            message: "Account created successfully"
        });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred during registration",
            error: error.message
        });
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect username",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect password",
                success: false
            })
        };
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: 'strict' }).json({
            _id: user._id,
            username: user.username,
            fullName: user.fullName,
            profilePhoto: user.profilePhoto
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}