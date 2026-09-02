import express from "express";
import {
    registerUser, activateUser, loginUser, Logout, updateProfile, getMyProfile,
    getUserProfile, updateAccessToken
} from "../controllers/user.controller.js";
import isAuth from "../middelwares/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/activate-user", activateUser);
router.post("/login", loginUser);
router.get("/logout", Logout);
router.get("/refresh", updateAccessToken);
router.put('/profile', isAuth, updateProfile);
// Get logged-in user's profile (protected)
router.get('/my-profile', isAuth, getMyProfile);
// Get specific user's public profile
router.get('/profile/:userId', getUserProfile);
export default router;
