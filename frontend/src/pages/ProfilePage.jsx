import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../Styles/ProfilePage.css'; // Add styling here
import defaultAvatar from '../assets/CustomerImage.avif'; // Use your own default image

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    skills: '',
    socialLinks: '',
    profileImage: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get('http://localhost:6767/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put('http://localhost:6767/api/profile', profile, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated!');
    } catch (err) {
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const res = await axios.post(
        'http://localhost:6767/api/profile/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile({ ...profile, profileImage: res.data.profileImage });
      alert('Image uploaded!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <div className="avatar-section">
          <img
            src={
              profile.profileImage
                ? `http://localhost:6767${profile.profileImage}`
                : defaultAvatar
            }
            alt="profile"
            className="avatar"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button onClick={handleImageUpload}>Upload Photo</button>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input name="name" value={profile.name} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Skills</label>
          <input name="skills" value={profile.skills} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Social Links</label>
          <input
            name="socialLinks"
            value={profile.socialLinks}
            onChange={handleChange}
          />
        </div>

        <button onClick={handleUpdate} disabled={loading}>
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
