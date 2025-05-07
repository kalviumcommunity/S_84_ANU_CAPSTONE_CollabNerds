// src/components/dashboard/MeetingFormModal.jsx
import React, { useState } from 'react';
import axios from 'axios';

const MeetingFormModal = ({ meeting, onClose }) => {
  const [title, setTitle] = useState(meeting?.title || '');
  const [description, setDescription] = useState(meeting?.description || '');
  const [scheduledFor, setScheduledFor] = useState(meeting ? new Date(meeting.scheduledFor).toISOString().slice(0, 16) : '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, scheduledFor };
    const config = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };

    if (meeting) {
      await axios.put(`/api/meetings/${meeting._id}`, payload, config);
    } else {
      await axios.post('/api/meetings', payload, config);
    }
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h3>{meeting ? 'Edit Meeting' : 'Schedule Meeting'}</h3>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Meeting Title" required />
        <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
        <input type="datetime-local" value={scheduledFor} onChange={e => setScheduledFor(e.target.value)} required />
        <button type="submit">Save</button>
        <button onClick={onClose} type="button">Cancel</button>
      </form>
    </div>
  );
};

export default MeetingFormModal;
