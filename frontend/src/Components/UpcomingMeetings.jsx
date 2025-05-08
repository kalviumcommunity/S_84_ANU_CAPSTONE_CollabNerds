import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';

const UpcomingMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', date: '', time: '' });

  const fetchMeetings = async () => {
    const res = await axios.get('/api/meetings/upcoming', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setMeetings(res.data);
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Combine date and time into ISO string
    const scheduledFor = new Date(`${form.date}T${form.time}`);
    await axios.post('/api/meetings', {
      title: form.title,
      description: form.description,
      scheduledFor,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    setForm({ title: '', description: '', date: '', time: '' });
    fetchMeetings();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/meetings/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    });
    fetchMeetings();
  };

  return (
    <div>
      <h2>Schedule a Meeting</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input type="text" placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <br />
        <textarea placeholder="Description" value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <br />
        <input type="date" value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })} required />
        <br />
        <input type="time" value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })} required />
        <br />
        <button type="submit">Schedule</button>
      </form>

      <h3>Upcoming Meetings</h3>
      <ul>
        {meetings.map(meet => (
          <li key={meet._id}>
            <strong>{meet.title}</strong> on {new Date(meet.scheduledFor).toLocaleString()}
            <br />
            <button onClick={() => handleDelete(meet._id)}>Completed ? </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingMeetings;