import { io } from "socket.io-client";

const socket = io('https://s-84-anu-capstone-collabnerds-3.onrender.com', {
  autoConnect: false,
});

export default socket;