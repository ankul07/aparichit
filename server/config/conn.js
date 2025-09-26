const mongoose = require("mongoose");

const ConnectionDatabase = async () => {
  try {
    const { connection } = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✓ MongoDB connected with server: ${connection.host}`);
  } catch (error) {
    console.error(`✗ Failed to connect to MongoDB: ${error.message}`);
  }
};
module.exports = ConnectionDatabase;
