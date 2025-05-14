import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import socket from '../socket';
import axios from 'axios';
import '../Styles/ChatWindow.css';

const motivationalQuotes = [
  "🚀 Let's build the future, one line at a time.",
  "🤝 Great things are never done alone.",
  "🔥 Push code, push limits.",
  "🌱 Every project starts with a single idea.",
  "✨ Collaborate. Create. Conquer."
];

const ChatWindow = () => {
  const { partnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState('');
  const [users, setUsers] = useState([]);
  const [typing, setTyping] = useState(false);
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const scrollRef = useRef();

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://s-84-anu-capstone-collabnerds-3.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        setLoadingUsers(false);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };
    fetchUsers();
  }, [token]);

  // Normalize sender
  const normalizeSender = (senderId) => {
    if (typeof senderId === 'object' && senderId.name) return senderId;
    const user = users.find(u => u._id === senderId);
    return user ? user : { _id: senderId, name: 'Unknown User' };
  };

  // Fetch messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`https://s-84-anu-capstone-collabnerds-3.onrender.com/api/chat/messages/${partnerId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const enriched = res.data.map(msg => ({
          ...msg,
          sender: normalizeSender(msg.sender),
        }));

        setMessages(enriched);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      }
    };
    if (!loadingUsers) fetchMessages();
  }, [partnerId, token, loadingUsers]);

  // Socket setup
  useEffect(() => {
    if (loadingUsers) return;
    if (!socket.connected) socket.connect();

    const room = [currentUser._id, partnerId].sort().join('_');
    socket.emit('joinRoom', { room });

    socket.on('receiveMessage', (msg) => {
      const enriched = { ...msg, sender: normalizeSender(msg.sender) };
      setMessages(prev => [...prev, enriched]);
    });

    socket.on('typing', ({ from }) => {
      if (from === partnerId) setIsPartnerTyping(true);
    });

    socket.on('stopTyping', ({ from }) => {
      if (from === partnerId) setIsPartnerTyping(false);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('typing');
      socket.off('stopTyping');
      socket.emit('leaveRoom', { room });
    };
  }, [partnerId, currentUser._id, loadingUsers]);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMsg.trim()) return;

    const message = {
      to: partnerId,
      content: newMsg,
    };

    socket.emit('sendMessage', message);

    const localMessage = {
      sender: currentUser,
      content: newMsg,
    };

    setMessages(prev => [...prev, localMessage]);
    setNewMsg('');
    socket.emit('stopTyping', { to: partnerId });
  };

  const handleTyping = (e) => {
    setNewMsg(e.target.value);
    if (!typing) {
      setTyping(true);
      socket.emit('typing', { to: partnerId });
    }

    setTimeout(() => {
      setTyping(false);
      socket.emit('stopTyping', { to: partnerId });
    }, 1500);
  };

  const getPartnerName = () => {
    const partner = users.find(u => u._id === partnerId);
    return partner ? partner.name : 'Unknown User';
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <h2>Chat with {getPartnerName()} 💬</h2>
        <div className="quote">{motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]}</div>
      </div>
      <div className="messages" ref={scrollRef}>
        {messages.map((msg, i) => (
          <div key={`${msg.sender._id}-${msg.content}-${i}`} className={msg.sender._id === currentUser._id ? 'sent bubble' : 'received bubble'}>
            <strong>{msg.sender._id === currentUser._id ? 'You' : msg.sender.name}:</strong> {msg.content}
          </div>
        ))}
        {isPartnerTyping && <div className="typing-indicator">✍️ {getPartnerName()} is typing...</div>}
      </div>
      <div className="input-area">
        <input
          type="text"
          value={newMsg}
          onChange={handleTyping}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
