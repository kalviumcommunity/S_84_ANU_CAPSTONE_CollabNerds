// src/components/dashboard/UpcomingMeetings.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MeetingFormModal from './MeetingFormModal';

const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchMeetings = async () => {
    const res = await axios.get('/api/meetings/upcoming', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setMeetings(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/meetings/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchMeetings();
  };

  const handleEdit = (m) => {
    setEditingMeeting(m);
    setShowModal(true);
  };

  useEffect(() => { fetchMeetings(); }, []);

  return (
    <div className="projects-section">
      <div className="section-header">
        <h2>Upcoming Meetings</h2>
        <button className="primary-btn" onClick={() => setShowModal(true)}>+ Schedule Meeting</button>
      </div>
      <div className="projects-grid">
        {meetings.map(m => (
          <div key={m._id} className="project-card">
            <div className="project-header">
              <h3>{m.title}</h3>
              <div>
                <button onClick={() => handleEdit(m)}>✏️</button>
                <button onClick={() => handleDelete(m._id)}>🗑️</button>
              </div>
            </div>
            <p>{m.description}</p>
            <p><strong>When:</strong> {new Date(m.scheduledFor).toLocaleString()}</p>
          </div>
        ))}
      </div>
      {showModal && (
        <MeetingFormModal
          meeting={editingMeeting}
          onClose={() => {
            setShowModal(false);
            setEditingMeeting(null);
            fetchMeetings();
          }}
        />
      )}
    </div>
  );
};

export default UpcomingMeetings;
