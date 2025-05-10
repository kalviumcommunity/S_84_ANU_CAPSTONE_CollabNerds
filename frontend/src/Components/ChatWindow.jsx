import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';  // Assuming you're managing your socket connection in a separate file
import axios from 'axios';

const ChatWindow = () => {
  const { partnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:6767/api/chat/messages/${partnerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [partnerId]);

  // Handle socket connection and listeners
  useEffect(() => {
    if (!socket.connected) socket.connect();

    // Join the room for this specific chat
    const room = [currentUser._id, partnerId].sort().join('_');
    socket.emit('joinRoom', { room });

    socket.on('connect', () => {
      console.log('✅ Socket connected with ID:', socket.id);
    });

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', { room: [currentUser._id, partnerId].sort().join('_') });
    };
  }, [partnerId, currentUser._id]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      to: partnerId,
      content: newMsg,
    };

    // Emit the message to the server
    socket.emit('sendMessage', message);

    // Optimistically update the message list
    setMessages(prev => [...prev, { sender: currentUser._id, content: newMsg }]);
    setNewMsg('');
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with Partner</h2>
      <div style={{
        height: 300,
        overflowY: 'auto',
        border: '1px solid #ccc',
        marginBottom: 10,
        padding: '10px'
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            textAlign: msg.sender === currentUser._id ? 'right' : 'left',
            margin: '5px 0'
          }}>
            <strong>{msg.sender === currentUser._id ? 'You' : 'Partner'}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={newMsg}
        onChange={(e) => setNewMsg(e.target.value)}
        placeholder="Type a message..."
        style={{ width: '80%' }}
      />
      <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>Send</button>
    </div>
  );
};

export default ChatWindow;
