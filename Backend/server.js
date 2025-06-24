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
  'https://glowing-melba-4fb0ac.netlify.app', 
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

const onlineUsers = new Set();

io.on('connection', (socket) => {
  const userId = socket.userId;
  console.log(`✅ User connected: ${userId}`);

  // Add to online users and broadcast updated list
  onlineUsers.add(userId);
  io.emit('updateOnlineUsers', [...onlineUsers]);

  // Join personal room
  socket.join(userId);

  // Join specific room for chats
  socket.on('joinRoom', ({ room }) => {
    socket.join(room);
  });

  socket.on('leaveRoom', ({ room }) => {
    socket.leave(room);
  });

  socket.on('typing', ({ to, name }) => {
    const room = [userId, to].sort().join('_');
    io.to(room).emit('typing', { from: userId, name });
  });

  socket.on('stopTyping', ({ to }) => {
    const room = [userId, to].sort().join('_');
    io.to(room).emit('stopTyping', { from: userId });
  });

  socket.on('sendMessage', async ({ content, to }) => {
    try {
      const message = new Message({ sender: userId, receiver: to, content });
      await message.save();
      const room = [userId, to].sort().join('_');
      io.to(room).emit('receiveMessage', {
        content,
        sender: userId,
        _id: message._id,
        timestamp: message.timestamp
      });
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
    }
  });

  socket.on('deleteMessage', async ({ messageId, to }) => {
    try {
      await Message.findByIdAndDelete(messageId);
      const room = [userId, to].sort().join('_');
      io.to(room).emit('messageDeleted', { messageId });
    } catch (err) {
      console.error("❌ Error deleting message:", err.message);
    }
  });

  socket.on('disconnect', () => {
    console.log(`❌ User disconnected: ${userId}`);
    onlineUsers.delete(userId);
    io.emit('updateOnlineUsers', [...onlineUsers]);
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