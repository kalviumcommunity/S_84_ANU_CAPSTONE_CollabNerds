import React, { useState } from 'react';
import { createMeeting } from '../api/meetingApi';

const MeetingForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const newMeeting = await createMeeting({
        title,
        description,
        scheduledFor,
      });

      console.log("Meeting Created:", newMeeting);

      // Pass back the new meeting to parent (Dashboard)
      if (onCreated) {
        onCreated(newMeeting);
      }

      // Reset form
      setTitle('');
      setDescription('');
      setScheduledFor('');
    } catch (err) {
      console.error("Error creating meeting:", err);
      setError(err?.response?.data?.message || "Failed to create meeting.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-card">
      <label>
        Title:
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>

      <label>
        Scheduled For:
        <input
          type="datetime-local"
          value={scheduledFor}
          onChange={(e) => setScheduledFor(e.target.value)}
          required
        />
      </label>

      {error && <p className="error-text">{error}</p>}

      <button type="submit" className="primary-btn" disabled={loading}>
        {loading ? 'Creating...' : 'Create Meeting'}
      </button>
    </form>
  );
};

export default MeetingForm;
