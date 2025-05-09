import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/Teams.css'; // Make sure you style this accordingly

const Teams = () => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [partners, setPartners] = useState([]);

  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (token) {
      fetchUsers();
      fetchRequests();
      fetchPartners();
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:6767/api/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Exclude the current user and users who are already chat partners
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
      const res = await axios.get('http://localhost:6767/api/chat/requests', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await axios.get('http://localhost:6767/api/chat/partners', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartners(res.data);
    } catch (err) {
      console.error('Error fetching chat partners:', err);
    }
  };

  const sendRequest = async (id) => {
    try {
      await axios.post(
        'http://localhost:6767/api/chat/request',
        { targetUserId: id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
    } catch (err) {
      console.error('Error sending request:', err);
    }
  };

  const respond = async (requesterId, action) => {
    try {
      await axios.post(
        'http://localhost:6767/api/chat/respond',
        { requesterId, action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests();
      fetchPartners();
    } catch (err) {
      console.error('Error responding to request:', err);
    }
  };

  return (
    <div className="teams-container">
      <section>
        <h2>All Users</h2>
        {users.length === 0 ? <p>No users available.</p> : users.map(user => (
          <div key={user._id} className="user-card">
            <span>{user.name}</span>
            <button onClick={() => sendRequest(user._id)}>Request Chat</button>
          </div>
        ))}
      </section>

      <section>
        <h2>Requests</h2>
        {requests.length === 0 ? <p>No pending requests.</p> : requests.map(req => (
          <div key={req.from._id} className="request-card">
            <span>{req.from.name}</span>
            <button onClick={() => respond(req.from._id, 'accepted')}>Accept</button>
            <button onClick={() => respond(req.from._id, 'rejected')}>Reject</button>
          </div>
        ))}
      </section>

      <section>
        <h2>Chat Partners</h2>
        {partners.length === 0 ? <p>No chat partners yet.</p> : partners.map(p => (
          <div key={p._id} className="partner-card">
            <span>{p.name}</span>
            <button onClick={() => window.location.href = `/chat/${p._id}`}>Chat</button>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Teams;
