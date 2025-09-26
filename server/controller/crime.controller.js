const asyncHandler = require("../middleware/asyncHandler");
const AppError = require("../utils/AppError");
const User = require("../model/user.model");
const Crime = require("../model/crime.model"); // Assuming you named it Crime instead of Incident
const GarudPuran = require("../model/garudPuran.model");

const AddCrime = asyncHandler(async (req, res, next) => {
  try {
    const { kyaHua, doshiNaam, doshiUmar, doshiGender, doshiPehchan } =
      req.body;

    if (!kyaHua || !doshiNaam || !doshiUmar || !doshiGender || !doshiPehchan) {
      return next(new AppError("All Fields are required fields", 400));
    }

    // Create new crime record with user reference
    const newCrime = new Crime({
      user: req.user._id, // Reference to the authenticated user
      kyaHua,
      doshiNaam,
      doshiUmar,
      doshiGender,
      doshiPehchan,
    });

    const savedCrime = await newCrime.save();

    // Populate user details for response
    const populatedCrime = await Crime.findById(savedCrime._id).populate(
      "user",
      "fullName email"
    );

    res.status(201).json({
      success: true,
      message: "Crime details added successfully",
      data: {
        crimeId: populatedCrime._id,
        user: {
          _id: populatedCrime.user._id,
          fullName: populatedCrime.user.fullName,
          email: populatedCrime.user.email,
        },
        kyaHua: populatedCrime.kyaHua,
        doshiNaam: populatedCrime.doshiNaam,
        doshiUmar: populatedCrime.doshiUmar,
        doshiGender: populatedCrime.doshiGender,
        doshiPehchan: populatedCrime.doshiPehchan,
        status: populatedCrime.status,
        incidentDate: populatedCrime.incidentDate,
        createdAt: populatedCrime.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in AddCrime:", error);
    return next(new AppError("Failed to add crime details", 500));
  }
});

const getAllCrime = asyncHandler(async (req, res, next) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Optional: Filter by status if provided
    const query = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Get total count for pagination info
    const totalCrimes = await Crime.countDocuments(query);

    // Get paginated crime reports with user details, sorted by latest first
    const crimes = await Crime.find(query)
      .populate("user", "fullName email") // Populate user details
      .sort({ createdAt: -1 }) // Latest first
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCrimes / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    // Format response data
    const formattedCrimes = crimes.map((crime, index) => ({
      crimeId: crime._id,
      user: {
        id: crime.user._id,
        username: crime.user.fullName,
        email: crime.user.email,
      },
      kyaHua: crime.kyaHua,
      doshiNaam: crime.doshiNaam,
      doshiUmar: crime.doshiUmar?.toString() || "अज्ञात",
      doshiGender: crime.doshiGender,
      doshiPehchan: crime.doshiPehchan,
      status: crime.status,
      incidentDate: crime.incidentDate,
      timestamp: getTimeAgo(crime.createdAt),
      createdAt: crime.createdAt,
      updatedAt: crime.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "Crime details fetched successfully",
      data: {
        crimes: formattedCrimes,
        pagination: {
          currentPage: page,
          totalPages,
          totalCrimes,
          hasNextPage,
          hasPrevPage,
          limit,
          skip,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAllCrime:", error);
    return next(new AppError("Failed to fetch crime details", 500));
  }
});

// Get crimes by specific user (new function)
const getCrimesByUser = asyncHandler(async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user._id; // Use param or current user
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Check if user exists
    const user = await User.findById(userId).select("fullName email");
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    const query = { user: userId };

    // Get total count for pagination
    const totalCrimes = await Crime.countDocuments(query);

    // Get user's crimes
    const crimes = await Crime.find(query)
      .populate("user", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
    const totalPages = Math.ceil(totalCrimes / limit);

    const formattedCrimes = crimes.map((crime) => ({
      crimeId: crime._id,
      kyaHua: crime.kyaHua,
      doshiNaam: crime.doshiNaam,
      doshiUmar: crime.doshiUmar?.toString() || "अज्ञात",
      doshiGender: crime.doshiGender,
      doshiPehchan: crime.doshiPehchan,
      status: crime.status,
      incidentDate: crime.incidentDate,
      timestamp: getTimeAgo(crime.createdAt),
      createdAt: crime.createdAt,
      updatedAt: crime.updatedAt,
    }));

    res.status(200).json({
      success: true,
      message: "User crimes fetched successfully",
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
        },
        crimes: formattedCrimes,
        pagination: {
          currentPage: page,
          totalPages,
          totalCrimes,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
          limit,
          skip,
        },
      },
    });
  } catch (error) {
    console.error("Error in getCrimesByUser:", error);
    return next(new AppError("Failed to fetch user crimes", 500));
  }
});

// Helper function to get time ago in Hindi
const getTimeAgo = (date) => {
  const now = new Date();
  const diffInMs = now - new Date(date);
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "अभी अभी";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} मिनट पहले`;
  } else if (diffInHours < 24) {
    return `${diffInHours} घंटे पहले`;
  } else if (diffInDays === 1) {
    return "1 दिन पहले";
  } else if (diffInDays < 7) {
    return `${diffInDays} दिन पहले`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} सप्ताह पहले`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} महीने पहले`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} साल पहले`;
  }
};
const getGarudPurans = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  // Get total count for pagination info
  const total = await GarudPuran.countDocuments();
  const totalPages = Math.ceil(total / limit);

  // Fetch garud purans with pagination
  const garudPurans = await GarudPuran.find()
    .sort({ id: 1 }) // Sort by id in ascending order
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    data: garudPurans,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      hasNext: page < totalPages,
      hasPrev: page > 1,
      limit,
    },
  });
});

module.exports = {
  AddCrime,
  getAllCrime,
  getCrimesByUser,
  getGarudPurans,
};
