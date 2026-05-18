// config/db.js
// This file handles the MongoDB database connection using Mongoose

const mongoose = require('mongoose');

// connectDB is an async function that connects to MongoDB
const connectDB = async () => {
    try {
        // Connect using the URI from .env file
        const conn = await mongoose.connect(process.env.MONGO_URI);

        // Log success with the host name
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        // If connection fails, log the error and exit the process
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1); // Exit with failure code
    }
};

module.exports = connectDB;
