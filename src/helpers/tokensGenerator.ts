import { User } from "@/models/user.model";
import mongoose from "mongoose";

export const generateAccessAndRefreshToken = async (
    userId: string | mongoose.Types.ObjectId
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error(`User not found for id: ${userId}`);
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    if (!accessToken || !refreshToken) {
        throw new Error("Token generation returned empty — check your model methods and JWT secrets");
    }

    // Single save — callers must NOT call findByIdAndUpdate after this
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
};