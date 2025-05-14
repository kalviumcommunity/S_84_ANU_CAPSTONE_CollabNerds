// socket.js
import { io } from "socket.io-client";

// Reusable socket instance (Make sure the server URL is correct)
const socket = io('https://s-84-anu-capstone-collabnerds-3.onrender.com', {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token') // Add token for authentication
  }
});

export default socket;
