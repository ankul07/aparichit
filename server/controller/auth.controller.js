const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../model/user.model");

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password } = req.body;

  // check required fields
  if (!fullName || !email || !password) {
    return next(
      new AppError("Full name, email and password are required", 400)
    );
  }

  // check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already registered with this email", 400));
  }

  // create user
  const user = await User.create({ fullName, email, password });

  // send response
  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // check fields
  if (!email || !password) {
    return next(new AppError("Email and password are required", 400));
  }

  // find user with password (since select: false in model)
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 401));
  }

  // compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return next(new AppError("Invalid email or password", 401));
  }

  // generate token
  const token = user.generateToken();

  // response
  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
    },
  });
});

module.exports = {
  register,
  login,
};
