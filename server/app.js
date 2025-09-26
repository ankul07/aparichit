// -------------------- Imports (always on top) --------------------
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const ConnectionDatabase = require("./config/conn");
const authRouter = require("./routes/auth.route");
const crimeRouter = require("./routes/crime.route");
const globalErrorHandler = require("./middleware/globalErrorHandler");

// -------------------- Config (before app init) --------------------
dotenv.config({ quiet: true });

// -------------------- App Initialization --------------------
const app = express();
const PORT = process.env.PORT || 8000;

// -------------------- Database Connection --------------------
ConnectionDatabase();

// -------------------- Global Middlewares --------------------
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
); // Cross-origin setup
app.use(express.json({ limit: "50mb" })); // Parse JSON request
app.use(express.urlencoded({ extended: true, limit: "50mb" })); // Parse URL-encoded request

// -------------------- Test Route --------------------
app.get("/test", (req, res) => {
  res.send("server is running successfully");
});

// -------------------- API Routes --------------------
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/crime", crimeRouter);

// -------------------- Global Error Handler (last middleware) --------------------
app.use(globalErrorHandler);

// -------------------- Start Server --------------------
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});
