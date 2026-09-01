import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import { verificationEmailTemplate } from "../emails/emailTemplates.js";
import Interview from "../models/Interview.model.js";
import mongoose from "mongoose";
import catchAsyncError from "../middelwares/catchAsyncError.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendToken, accessTokenOptions, refreshTokenOptions } from "../utils/jwt.js";

// Helper function to create JWT activation token
export const createActivationToken = (user) => {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = jwt.sign(
        {
            user,
            activationCode,
        },
        process.env.ACTIVATION_SECRET || process.env.JWT_SECRET,
        {
            expiresIn: "5m",
        }
    );
    return { token, activationCode };
};

// REGISTER user
export const registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler("Please enter all required fields", 400));
    }

    const isEmailExist = await User.findOne({ email });
    if (isEmailExist) {
        return next(new ErrorHandler("Email already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
        name,
        email,
        password: hashedPassword,
    };

    const activationToken = createActivationToken(user);
    const activationCode = activationToken.activationCode;

    try {
        await sendEmail(
            user.email,
            "Mockly - Activate your account",
            verificationEmailTemplate(activationCode)
        );

        res.status(201).json({
            success: true,
            message: `Please check your email: ${user.email} to activate your account`,
            activationToken: activationToken.token,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});

// ACTIVATE user / Verify OTP
export const activateUser = catchAsyncError(async (req, res, next) => {
    const { activationToken, activationCode } = req.body;
    const actCode = activationCode?.toString().trim();

    if (!activationToken || !actCode) {
        return next(new ErrorHandler("Activation token and code are required", 400));
    }

    let newUser;
    try {
        newUser = jwt.verify(
            activationToken,
            process.env.ACTIVATION_SECRET || process.env.JWT_SECRET
        );
    } catch (error) {
        return next(new ErrorHandler("Activation code has expired or token is invalid. Please resend code.", 400));
    }

    if (newUser.activationCode !== actCode) {
        return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await User.findOne({ email });
    if (existUser) {
        return next(new ErrorHandler("User already exists", 400));
    }

    const user = await User.create({
        name,
        email,
        password, // already hashed
        isVerified: true,
    });

    sendToken(user, 201, res);
});


// LOGIN user
export const loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    if (!user.isVerified) {
        return next(new ErrorHandler("Please verify your email before login", 400));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
});

// LOGOUT user
export const Logout = catchAsyncError(async (req, res, next) => {
    res.cookie("access_token", null, { expires: new Date(Date.now()), httpOnly: true });
    res.cookie("refresh_token", null, { expires: new Date(Date.now()), httpOnly: true });
    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
});

// UPDATE user profile
export const updateProfile = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;
    const { techStack, experience, currentRole, location, bio, skills, linkedin, github } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    user.profile = {
        techStack: techStack || user.profile?.techStack,
        experience: experience || user.profile?.experience || 'Fresher',
        currentRole: currentRole || user.profile?.currentRole,
        location: location || user.profile?.location,
        bio: bio || user.profile?.bio,
        skills: skills || user.profile?.skills,
        linkedin: linkedin || user.profile?.linkedin,
        github: github || user.profile?.github
    };

    if (linkedin && !linkedin.startsWith('https://linkedin.com/') && !linkedin.startsWith('https://www.linkedin.com/')) {
        return next(new ErrorHandler("Please provide a valid LinkedIn URL", 400));
    }

    if (github && !github.startsWith('https://github.com/')) {
        return next(new ErrorHandler("Please provide a valid GitHub URL", 400));
    }

    await user.save();

    const updatedUser = await User.findById(userId).select('-password');

    res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedUser
    });
});

// GET logged-in user profile
export const getMyProfile = catchAsyncError(async (req, res, next) => {
    const userId = req.user.id;

    const user = await User.findById(userId).select('-password');
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const interviews = await Interview.find({
        userId: userId
    }).sort({ createdAt: -1 }).select('technology difficulty status overallScore feedback createdAt');

    res.status(200).json({
        success: true,
        message: "Profile retrieved successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                profile: user.profile,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            interviews: interviews
        }
    });
});

// GET public user profile
export const getUserProfile = catchAsyncError(async (req, res, next) => {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return next(new ErrorHandler("Invalid user ID format", 400));
    }

    const user = await User.findById(userId).select('-password -email');
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const interviews = await Interview.find({
        userId: userId,
        status: 'completed',
        overallScore: { $exists: true }
    }).sort({ createdAt: -1 }).select('technology difficulty overallScore feedback createdAt');

    const totalInterviews = interviews.length;
    const averageScore = totalInterviews > 0 ?
        Math.round((interviews.reduce((sum, interview) => sum + interview.overallScore, 0) / totalInterviews) * 10) / 10 : 0;

    res.status(200).json({
        success: true,
        message: "User profile retrieved successfully",
        data: {
            user: {
                id: user._id,
                name: user.name,
                profile: user.profile,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            interviews: interviews,
            statistics: {
                totalInterviews: totalInterviews,
                averageScore: averageScore,
                completionRate: totalInterviews > 0 ? Math.round((interviews.length / totalInterviews) * 100) : 0
            }
        }
    });
});

// UPDATE ACCESS TOKEN
export const updateAccessToken = catchAsyncError(async (req, res, next) => {
    try {
        const refresh_token = req.cookies.refresh_token;
        if (!refresh_token) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        const decoded = jwt.verify(
            refresh_token,
            process.env.REFRESH_TOKEN || process.env.JWT_SECRET || 'refresh_secret'
        );

        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new ErrorHandler("Please login to access this resource", 400));
        }

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});