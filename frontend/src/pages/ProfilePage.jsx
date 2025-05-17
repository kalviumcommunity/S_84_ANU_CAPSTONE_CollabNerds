// ProfilePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../Styles/ProfilePage.css';
import defaultAvatar from '../assets/CustomerImage.avif';

const ProfilePage = () => {
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    role: '',
    location: '',
    bio: '',
    skills: '',
    socialLinks: [],
    profileImage: '',
    dob: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile({
        ...res.data,
        dob: res.data.dob ? new Date(res.data.dob) : null,
        socialLinks: Array.isArray(res.data.socialLinks)
          ? res.data.socialLinks
          : (res.data.socialLinks || '').split(',').filter((link) => link),
      });
    } catch (err) {
      console.error(err);
    }
  } ; 

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        {
          ...profile,
          socialLinks: profile.socialLinks.join(','),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Profile updated!');
    } catch (err) {
      console.error(err);
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
        `${import.meta.env.VITE_API_BASE_URL}/api/profile/upload-photo`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfile({ ...profile, profileImage: res.data.profileImage });
      setImageFile(null); // Reset selected image
      alert('Image uploaded!');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  const handleDeleteImage = () => {
    setProfile({ ...profile, profileImage: '' });
  };

  const handleDeleteSocialLink = (index) => {
    const updatedLinks = [...profile.socialLinks];
    updatedLinks.splice(index, 1);
    setProfile({ ...profile, socialLinks: updatedLinks });
  };

  const imageURL = profile.profileImage
    ? `${import.meta.env.VITE_API_BASE_URL}/${profile.profileImage.startsWith('/')
        ? profile.profileImage.slice(1)
        : profile.profileImage}`
    : defaultAvatar;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Avatar Column */}
        <div className="profile-column avatar-column">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : imageURL}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
            alt="profile"
            className="avatar"
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
          <button onClick={handleImageUpload}>Upload Photo</button>
          {profile.profileImage && !imageFile && (
            <button onClick={handleDeleteImage} className="delete-image-btn">
              Delete Image
            </button>
          )}
        </div>

        {/* Bio Column */}
        <div className="profile-column bio-column">
          <h3>👤 Bio & Info</h3>
          <div className="form-group">
            <label>Name</label>
            <input name="name" value={profile.name } onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" value={profile.email} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Role</label>
            <input name="role" value={profile.role} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input name="location" value={profile.location} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Bio</label>
            <textarea name="bio" rows={3} value={profile.bio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>DOB</label>
            <DatePicker
              selected={profile.dob}
              onChange={(date) => setProfile({ ...profile, dob: date })}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select your date of birth"
              className="date-picker-input"
              maxDate={new Date()}
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
            />
          </div>
        </div>

        {/* Skills & Links Column */}
        <div className="profile-column skills-column">
          <h3>⚙️ Skills & Links</h3>
          <div className="form-group">
            <label>Skills</label>
            <input name="skills" value={profile.skills} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Social Links</label>
            <div className="social-links-container">
              {profile.socialLinks.map((link, index) => (
                <div key={index} className="social-link-item">
                  <input
                    value={link}
                    onChange={(e) => {
                      const links = [...profile.socialLinks];
                      links[index] = e.target.value;
                      setProfile({ ...profile, socialLinks: links });
                    }}
                    placeholder={`Link ${index + 1}`}
                  />
                  <button
                    className="delete-link-btn"
                    onClick={() => handleDeleteSocialLink(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
              <button
                onClick={() => setProfile({ ...profile, socialLinks: [...profile.socialLinks, ''] })}
              >
                + Add Link
              </button>
            </div>
          </div>
          <button onClick={handleUpdate} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
