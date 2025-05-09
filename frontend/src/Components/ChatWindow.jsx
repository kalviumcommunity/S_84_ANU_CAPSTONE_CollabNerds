import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import socket from '../socket';

const ChatWindow = () => {
  const { partnerId } = useParams();
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.emit('joinRoom', partnerId);

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    fetchMessages();

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [partnerId]);

  const fetchMessages = async () => {
    const res = await axios.get(`/api/chat/messages/${partnerId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  const sendMessage = () => {
    socket.emit('sendMessage', { content: msg, to: partnerId });
    setMessages((prev) => [...prev, { content: msg, sender: 'me' }]);
    setMsg('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={m.sender === 'me' ? 'sent' : 'received'}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatWindow;
