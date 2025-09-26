const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [25, "name not valid, max 25 characters allowed"],
      minlength: [2, "name must have at least 2 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "please enter a valid email"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "password must be at least 6 characters"],
      select: false, // password query se default me nahi aayega
    },
  },
  {
    timestamps: true,
  }
);

// ✅ Password hash karne ka pre-save middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // agar password modify nahi hua to skip
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Password compare method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ JWT token generate method
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, email: this.email },
    process.env.JWT_SECRET, // secret env me rakho
    { expiresIn: "90d" } // token 7 din valid
  );
};

const User = mongoose.model("User", userSchema);
module.exports = User;
