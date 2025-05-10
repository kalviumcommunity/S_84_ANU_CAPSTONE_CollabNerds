// socket.js
import { io } from "socket.io-client";

// Reusable socket instance (Make sure the server URL is correct)
const socket = io('http://localhost:6767', {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token') // Add token for authentication
  }
});

export default socket;
