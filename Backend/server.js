require('dotenv').config();  // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const authRoutes = require('./routes/auth');
const cors = require('cors');
// const helmet = require('helmet');
// const rateLimit = require('express-rate-limit');

// Setup for CORS
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

const corsOptions = {
  origin: true,
  credentials: true,
};

const app = express();

// Apply security middleware
// app.use(helmet());
app.use(cors(corsOptions));

// Custom middleware for CORS headers (optional, but safe to keep)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Middleware for parsing JSON data
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/meetings', meetingRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://ANU-SONI:anuCollabNerds25.@capstone.h6hn2eg.mongodb.net/?retryWrites=true&w=majority&appName=Capstone")
  .then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong' });
});

const PORT = 6767;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
