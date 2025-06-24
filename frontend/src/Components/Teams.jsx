import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Teams.css';
import socket from '../socket';

const Teams = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (token) {
      fetchPartners();
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRequests();
    }
  }, [partners, token]);

  useEffect(() => {
    if (!socket.connected) socket.connect();

    socket.emit('online', { userId: currentUser._id });

    socket.on('updateOnlineUsers', (userIds) => {
      setOnlineUsers(userIds);
    });

    return () => {
      socket.off('updateOnlineUsers');
    };
  }, [currentUser._id]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const filtered = res.data.filter(
        u => u._id !== currentUser._id && !partners.some(p => p._id === u._id)
      );
      setUsers(filtered);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/chat/partners`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const uniquePartners = [...new Set(res.data.map(p => p._id))]
        .map(id => res.data.find(p => p._id === id));
      setPartners(uniquePartners);
    } catch (err) {
      console.error('Error fetching chat partners:', err);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/request`,
        { targetUserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error sending request:', err.response?.data || err.message);
    }
  };

  const respond = async (requesterId, action) => {
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/chat/respond`,
        { requesterId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
      fetchPartners();
    } catch (err) {
      console.error('Error responding to request:', err);
    }
  };

  const handleChatNavigate = (partnerId) => {
    navigate(`/chat/${partnerId}`);
  };

  const isOnline = (id) => onlineUsers.includes(id);

  return (
    <div className="teams-container">
      <h1>CollabNerds: Team Up & Create !</h1>

      <section className="teams-section">
        <h2>🌍 Discover Collaborators</h2>
        {users.length === 0 ? (
          <p className="no-data">All potential collaborators are already connected or no new users found.</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="user-card">
              <span className="user-name">
                <span className={`status-dot ${isOnline(user._id) ? 'online' : 'offline'}`}></span>
                {user.name}
              </span>
              <button onClick={() => sendRequest(user._id)}>Request Chat</button>
            </div>
          ))
        )}
      </section>

      <section className="teams-section">
        <h2>📩 Pending Requests</h2>
        {requests.length === 0 ? (
          <p className="no-data">No new chat requests at the moment.</p>
        ) : (
          requests.map(req => (
            <div key={req.from._id} className="request-card">
              <span>{req.from.name} {isOnline(req.from._id) ? '🟢' : '🔴'}</span>
              <div className="btn-group">
                <button onClick={() => respond(req.from._id, 'accepted')} className="accept">Accept</button>
                <button onClick={() => respond(req.from._id, 'rejected')} className="reject">Reject</button>
              </div>
            </div>
          ))
        )}
      </section>

      <section className="teams-section">
        <h2>🧠 Connected Collaborators</h2>
        {partners.length === 0 ? (
          <p className="no-data">No ongoing collaborations yet. Start building your dream team!</p>
        ) : (
          partners.map(p => (
            <div key={p._id} className="partner-card">
              <span>{p.name} {isOnline(p._id) ? '🟢' : '🔴'}</span>
              <button onClick={() => handleChatNavigate(p._id)}>Open Chat</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Teams;