const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  let error = { ...err };
  error.message = message;
  // ✅ Mongoose Validation Error (required field missing etc.)
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    error = new AppError(errors.join(", "), 400);
  }

  // ✅ Duplicate key error (email unique fail hua)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue);
    error = new AppError(`Duplicate value for field: ${field}`, 400);
  }
  // ✅ Cast Error (invalid MongoDB ObjectId)
  if (err.name === "CastError") {
    error = new AppError(`Invalid ${err.path}: ${err.value}`, 400);
  }
  // ✅ JWT Errors
  if (err.name === "JsonWebTokenError") {
    error = new AppError("Invalid token. Please log in again.", 401);
  }
  if (err.name === "TokenExpiredError") {
    error = new AppError("Your token has expired. Please log in again.", 401);
  }
  res.status(error.statusCode || statusCode).json({
    success: false,
    message: error.message || message,
    // ⚠️ development ke liye helpful
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = globalErrorHandler;
