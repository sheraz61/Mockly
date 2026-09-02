import dotenv from "dotenv";

dotenv.config();

// parse environment variables to integrate with fallback values (in minutes for access, days for refresh)
const accessTokenExpire = parseInt(process.env.ACCESS_TOKEN_EXPIRE || '5', 10);
const refreshTokenExpire = parseInt(process.env.REFRESH_TOKEN_EXPIRE || '3', 10);

// options for cookies
export const accessTokenOptions = {
  expires: new Date(Date.now() + accessTokenExpire * 60 * 1000),
  maxAge: accessTokenExpire * 60 * 1000,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const refreshTokenOptions = {
  expires: new Date(Date.now() + refreshTokenExpire * 24 * 60 * 60 * 1000),
  maxAge: refreshTokenExpire * 24 * 60 * 60 * 1000,
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const sendToken = (user, statusCode, res) => {
  const accessToken = user.signAccessToken();
  const refreshToken = user.signRefreshToken();

  // only set secure flag in production
  if (process.env.NODE_ENV === 'production') {
    accessTokenOptions.secure = true;
    refreshTokenOptions.secure = true;
  }

  res.cookie('access_token', accessToken, accessTokenOptions);
  res.cookie('refresh_token', refreshToken, refreshTokenOptions);

  res.status(statusCode).json({
    success: true,
    accessToken,
    user
  });
};
