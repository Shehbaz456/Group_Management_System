import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

import ValidEmail from "../models/validEmail.model.js";
import User from "../models/user.model.js";

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || "7d";
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_EXPIRY || "15m";

export const AuthLogin = asyncHandler(async (req, res) => {
    const { email, course } = req.body;

    if (!email || !course) {
        throw new ApiError(400, "Email and course are required");
    }

    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }

    const isValid = await ValidEmail.findOne({ email, course });
    if (!isValid) {
        throw new ApiError(401, "Email or course not authorized");
    }

    let user = await User.findOne({ email });
    if (!user) {
        user = await User.create({ email, course });
    }

    const accessToken = jwt.sign({ _id: user._id, email, course }, ACCESS_SECRET, {
        expiresIn: ACCESS_EXPIRY,
    });

    const refreshToken = jwt.sign({ _id: user._id, email, course }, REFRESH_SECRET, {
        expiresIn: REFRESH_EXPIRY,
    });

    await user.setRefreshToken(refreshToken);

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 15, // 15 minutes
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    res.status(200).json(new ApiResponse(200, "Login successful"));
});

export const AuthRefresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) throw new ApiError(401, "No refresh token provided");

    jwt.verify(token, REFRESH_SECRET, async (err, decoded) => {
        if (err) throw new ApiError(403, "Invalid or expired refresh token");

        const user = await User.findOne({ email: decoded.email });
        if (!user || user.refreshToken !== token) {
            throw new ApiError(403, "Refresh token mismatch or user not found");
        }

        const newAccessToken = jwt.sign(
            { _id: user._id, email: user.email, course: user.course },
            ACCESS_SECRET,
            { expiresIn: ACCESS_EXPIRY }
        );

        res.cookie("accessToken", newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 1000 * 60 * 15,
        });

        return res.status(200).json(new ApiResponse(200, "Token refreshed"));
    });
});

export const AuthLogout = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (token) {
        try {
            const decoded = jwt.verify(token, REFRESH_SECRET);
            const user = await User.findOne({ email: decoded.email });

            if (user) await user.clearRefreshToken();
        } catch (err) {
            console.log("Logout error:", err.message);
            throw new ApiError(403, "Invalid or expired refresh token");
        }
    }

    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.status(200).json(new ApiResponse(200, "Logged out"));
});
