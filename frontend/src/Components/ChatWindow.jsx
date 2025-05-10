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

  // Fetch all users once
useEffect(() => {
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:6767/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Users fetched:", res.data); // Check the fetched users
      setUsers(res.data);
      setLoadingUsers(false);
    } catch (err) {
      console.error('❌ Failed to fetch users:', err);
    }
  };
  fetchUsers();
}, [token]);

  // Helper to map sender ID to user object
const normalizeSender = (senderId) => {
  if (typeof senderId === 'object' && senderId.name) return senderId;
  console.log("Sender ID:", senderId);
  const user = users.find(u => u._id === senderId);
  console.log("Found User:", user);
  return user ? user : { _id: senderId, name: 'Unknown User' };
};

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:6767/api/chat/messages/${partnerId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const enriched = res.data.map(msg => ({
          ...msg,
          sender: normalizeSender(msg.sender),
        }));

        setMessages(enriched);
      } catch (err) {
        console.error('❌ Failed to fetch messages:', err);
      }
    };
    if (!loadingUsers) fetchMessages();
  }, [partnerId, token, loadingUsers]);

  // Socket setup (depends on loadingUsers only, not raw users array)
  useEffect(() => {
    if (loadingUsers) return;

    if (!socket.connected) socket.connect();

    const room = [currentUser._id, partnerId].sort().join('_');
    socket.emit('joinRoom', { room });

    socket.on('receiveMessage', (msg) => {
      console.log('📩 Received message:', msg);
      const enriched = {
        ...msg,
        sender: normalizeSender(msg.sender),
      };
      setMessages(prev => [...prev, enriched]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.emit('leaveRoom', { room });
    };
  }, [partnerId, currentUser._id, loadingUsers]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      to: partnerId,
      content: newMsg,
    };

    socket.emit('sendMessage', message);

    const localMessage = {
      sender: currentUser, // Already contains _id and name
      content: newMsg,
    };

    setMessages(prev => [...prev, localMessage]);
    setNewMsg('');
  };

  if (loadingUsers) {
    return <div style={{ padding: 20 }}>Loading Chat... !</div>;
  }

  const getPartnerName = () => {
    const partner = users.find(u => u._id === partnerId);
    return partner ? partner.name : 'Unknown User';
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Chat with {getPartnerName()} 🤍</h2>
      <div style={{
        height: 300,
        overflowY: 'auto',
        border: '1px solid #ccc',
        marginBottom: 10,
        padding: '10px'
      }}>
        {messages.map((msg, i) => (
        <div key={`${msg.sender._id}-${msg.content}-${i}`} style={{
        textAlign: msg.sender._id === currentUser._id ? 'right' : 'left',
        margin: '5px 0'
        }}>
         <strong>{msg.sender._id === currentUser._id ? 'You' : msg.sender.name}:</strong> {msg.content}
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
