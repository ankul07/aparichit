const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = asyncHandler(async (req, res, next) => {
  let authToken;

  // Header se token lena (Authorization: Bearer <token>)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      authToken = req.headers.authorization.split(" ")[1];
      // console.log(authToken);

      // Verify token
      const decoded = jwt.verify(authToken, process.env.JWT_SECRET);

      // DB se user fetch karo (password exclude karke)
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      req.user = user; // request object me user attach
      return next();
    } catch (err) {
      return next(new AppError("Not authorized, token failed", 401));
    }
  }

  if (!authToken) {
    return next(new AppError("Not authorized, no token", 401));
  }
});

module.exports = authMiddleware;
