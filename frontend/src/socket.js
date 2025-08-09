import { io } from "socket.io-client";

const socket = io('https://s-84-anu-capstone-collabnerds-3.onrender.com', {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"), 
  },
});

export default socket;
