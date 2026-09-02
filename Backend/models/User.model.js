import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
    // New dashboard fields
    profile: {
        techStack: {
            type: String,
        },
        experience: {
            type: String,
            default: 'Fresher'
        },
        currentRole: String,
        location: String,
        bio: String,
        skills:String,
        linkedin: String,
        github: String
    },
}, { timestamps: true });
userSchema.methods.signAccessToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.ACCESS_TOKEN || process.env.JWT_SECRET || 'access_secret', {
    expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || '5') + 'm',
  });
};

userSchema.methods.signRefreshToken = function () {
  return jwt.sign({ id: this._id, email: this.email }, process.env.REFRESH_TOKEN || process.env.JWT_SECRET || 'refresh_secret', {
    expiresIn: (process.env.REFRESH_TOKEN_EXPIRE || '3') + 'd',
  });
};

export default mongoose.model("User", userSchema);
