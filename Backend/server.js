require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const authRoutes = require('./routes/auth');
const cors = require('cors');

const app = express();

// === CORS Setup ===
const allowedOrigins = ['http://localhost:5173' ];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// === Middleware ===
app.use(express.json()); // Parse incoming JSON

// === Routes (mounted under /api) ===
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);  // Ensure this is mounted under /api/projects
app.use('/api/meetings', meetingRoutes);

// === MongoDB Connection ===
const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected!"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// === Server Start ===
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
