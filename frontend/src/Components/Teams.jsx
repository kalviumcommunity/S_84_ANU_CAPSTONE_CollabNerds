import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Styles/Teams.css';

const Teams = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (token) {
      fetchPartners(); // First fetch partners
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRequests();
    }
  }, [partners, token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('https://s-84-anu-capstone-collabnerds-3.onrender.com/api/users', {
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
      const res = await axios.get('https://s-84-anu-capstone-collabnerds-3.onrender.com/api/chat/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

const fetchPartners = async () => {
  try {
    const res = await axios.get('https://s-84-anu-capstone-collabnerds-3.onrender.com/api/chat/partners', {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Filter out duplicates by checking if the partner already exists
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
        'https://s-84-anu-capstone-collabnerds-3.onrender.com/api/chat/request',
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
        'https://s-84-anu-capstone-collabnerds-3.onrender.com/api/chat/respond',
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

  return (
    <div className="teams-container">
      <h1>🤝CollabNerds: Team Up & Create 🚀</h1>

      <section className="teams-section">
        <h2>🌍 Discover Collaborators</h2>
        {users.length === 0 ? (
          <p className="no-data">All potential collaborators are already connected or no new users found.</p>
        ) : (
          users.map(user => (
            <div key={user._id} className="user-card">
              <span>{user.name}</span>
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
              <span>{req.from.name}</span>
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
              <span>{p.name}</span>
              <button onClick={() => handleChatNavigate(p._id)}>Open Chat</button>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Teams;
