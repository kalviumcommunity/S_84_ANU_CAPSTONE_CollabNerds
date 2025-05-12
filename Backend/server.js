require('dotenv').config(); // Load environment variables
const express = require('express') ;
const mongoose = require('mongoose') ;
const jwt = require('jsonwebtoken') ;
const cors = require('cors') ;
const http = require('http') ;
const { Server } = require('socket.io') ;

const projectRoutes = require('./routes/projectRoutes') ;
const meetingRoutes = require('./routes/meetingRoutes') ;
const authRoutes = require('./routes/auth') ;
const chatRoutes = require('./routes/chatRoutes') ;
const userRoutes = require('./routes/userRoutes') ;
const Message = require('./models/Message') ; 
const profileRoutes = require('./routes/profileRoutes');
const path = require('path');
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
app.use(express.json());

// === Routes ===
app.use('/api/profile', profileRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/meetings', meetingRoutes);

// === MongoDB Connection ===
const MONGO_URI = process.env.MONGO_URL;

mongoose.connect(MONGO_URI )
.then(() => console.log("✅ MongoDB connected!"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

// === Create HTTP Server ===
const server = http.createServer(app);

// === Socket.IO Setup ===
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error: No token"));
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

io.on('connection', (socket) => {
  console.log(`✅ User connected with ID: ${socket.userId}`);

  // Join user to their own room (so we can emit to them using their userId)
  socket.join(socket.userId);

  // Handle chat messages
  socket.on('sendMessage', async ({ content, to }) => {
    try {
      const message = new Message({
        sender: socket.userId,
        receiver: to,
        content
      });
      await message.save();

      // Create a room name for communication between users
      const room = [socket.userId, to].sort().join('_');
      
      // Emit to both users via their individual rooms
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
