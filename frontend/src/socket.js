import { io } from 'socket.io-client';

const socket = io('http://localhost:6767', {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('token'),
  }
});

export default socket;
