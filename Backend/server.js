require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const projectRoutes = require('./routes/projectRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const cors = require('cors');
const http = require('http'); // Required for Socket.IO server
const { Server } = require('socket.io'); // Required for Socket.IO
const userRoutes = require('./routes/userRoutes'); // Import user routes
const Message = require('./models/Message');
const app = express();

// === CORS Setup ===
const allowedOrigins = ['http://localhost:5173'];

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

// === Middleware ===
app.use(express.json()); // Parse incoming JSON

// === Routes (mounted under /api) ===
app.use('/api/users',userRoutes);
app.use('/api/chat', chatRoutes);
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

// === Create HTTP Server ===
const server = http.createServer(app); // Create HTTP server using Express app

// === Socket.IO Setup ===
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Change to your frontend's URL
    methods: ['GET', 'POST'],
    credentials: true,  // Allow cookies (withCredentials)
  }
});

io.on('connection', (socket) => {
  console.log('✅ A user connected');

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`✅ Joined room: ${roomId}`);
  });

  socket.on('sendMessage', async ({ content, to }) => {
    const token = socket.handshake.auth.token;
    if (!token) return;

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // make sure JWT_SECRET exists
    const from = decoded.id;

    const message = new Message({ sender: from, receiver: to, content });
    await message.save();

    io.to(to).emit('receiveMessage', { content, sender: from });
    io.to(from).emit('receiveMessage', { content, sender: from }); // echo back to sender
  });

  socket.on('disconnect', () => {
    console.log('❌ A user disconnected');
  });
});


// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// === Server Start ===
const PORT = process.env.PORT || 6767;
server.listen(PORT, () => { // Listen on HTTP server, not directly on app
  console.log(`🚀 Server running on port ${PORT}`);
});
