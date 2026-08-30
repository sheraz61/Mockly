import { Error as MongooseError } from "mongoose";
import ErrorHandler from "../utils/ErrorHandler.js";

const errorMiddleware = (err, req, res, next) => {
  if (err instanceof MongooseError.CastError) {
    err = new ErrorHandler(
      `Resource not found. Invalid: ${err.path}`,
      400
    );
  }

  if (err.code === 11000) {
    err = new ErrorHandler(
      `Duplicate ${Object.keys(err.keyValue)} entered`,
      400
    );
  }

  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler(
      "JSON Web Token is invalid. Try again",
      401
    );
  }

  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler(
      "JSON Web Token is expired. Try again",
      401
    );
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

export default errorMiddleware;
