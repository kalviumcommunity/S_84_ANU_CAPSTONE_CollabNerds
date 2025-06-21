require('dotenv').config(); // Load environment variables
const Project = require('./models/Project');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const projectRoutes = require('./routes/projectRoutes');
const meetingRoutes = require('./routes/meetingRoutes');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');
const userRoutes = require('./routes/userRoutes');
const profileRoutes = require('./routes/profileRoutes');
const Message = require('./models/Message');


const app = express();

// === CORS Configuration ===
const allowedOrigins = [
  'http://localhost:5173',
  'https://gregarious-marzipan-0e011f.netlify.app', 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));


// === Middleware ===
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
// === API Routes ===
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/meetings', meetingRoutes);

// === MongoDB Connection ===
const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// === Create HTTP Server ===
const server = http.createServer(app);

// === Socket.IO Setup ===
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.IO Authentication Middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

// Socket.IO Events
io.on('connection', (socket) => {
  console.log(`✅ User connected with ID: ${socket.userId}`);

  // Join personal room for direct communication
  socket.join(socket.userId);

  // Handle chat message sending
  socket.on('sendMessage', async ({ content, to }) => {
    try {
      const message = new Message({
        sender: socket.userId,
        receiver: to,
        content
      });
      await message.save();

      // Construct unique room name
      const room = [socket.userId, to].sort().join('_');

      // Emit message to both users
      io.to(room).emit('receiveMessage', {
        content,
        sender: socket.userId
      });
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${socket.userId}`);
  });
});

// === Global Error Handler ===
app.use((err, req, res, next) => {
  console.error('❌ Internal Server Error:', err);
  res.status(500).json({ message: 'Something went wrong on the server.' });
});

// === Start Server ===
const PORT = process.env.PORT || 6767;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// https://starlit-sfogliatella-fdefb9.netlify.app/