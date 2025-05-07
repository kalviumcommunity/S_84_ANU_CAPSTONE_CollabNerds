const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const authRoutes = require('./routes/auth');
const cors = require('cors');
const corsOptions = {
  origin: 'http://localhost:5173', // Allow the front-end URL
  methods: 'GET,POST,PUT,DELETE',  // Allow all necessary HTTP methods
  allowedHeaders: 'Content-Type,Authorization', // Allow necessary headers
};
const app = express();

app.use(cors(corsOptions));
app.use(express.json()); // to parse JSON data
app.use("/api/auth" , authRoutes)
app.use('/api/projects', projectRoutes);
app.use('/api/meetings', meetingRoutes);

// MongoDB Connection
mongoose.connect("mongodb+srv://ANU-SONI:anuCollabNerds25.@capstone.h6hn2eg.mongodb.net/?retryWrites=true&w=majority&appName=Capstone")
.then(() => console.log("✅ MongoDB connected!"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
