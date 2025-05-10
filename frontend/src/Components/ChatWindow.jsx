import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';

const ChatWindow = () => {
  const { partnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  // Fetch all users (once)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://localhost:6767/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
        setLoadingUsers(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:6767/api/chat/messages/${partnerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    fetchMessages();
  }, [partnerId, token]);

  // Socket setup
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const room = [currentUser._id, partnerId].sort().join('_');
    socket.emit('joinRoom', { room });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('receiveMessage', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', { room });
    };
  }, [partnerId, currentUser._id]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      to: partnerId,
      content: newMsg,
    };

    socket.emit('sendMessage', message);
    setMessages(prev => [...prev, { sender: currentUser._id, content: newMsg }]);
    setNewMsg('');
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  if (loadingUsers) {
    return <div style={{ padding: 20 }}>Loading chat...</div>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with {getUserName(partnerId)}</h2>
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
            <strong>{msg.sender === currentUser._id ? 'You' : getUserName(msg.sender)}:</strong> {msg.content}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
          placeholder="Type a message..."
           style={{ width: '80%' }}
        />
        <button onClick={sendMessage} style={{ width: '18%', marginLeft: '2%' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
