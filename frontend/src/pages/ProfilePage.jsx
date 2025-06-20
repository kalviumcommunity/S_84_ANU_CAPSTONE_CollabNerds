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
    socialLinks: {
      github: '',
      linkedin: '',
      twitter: '',
    },
    profileImage: '',
    dob: null,
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = res.data;

      setProfile({
        ...data,
        dob: data.dob ? new Date(data.dob) : null,
        socialLinks: {
          github: data.socialLinks?.github || '',
          linkedin: data.socialLinks?.linkedin || '',
          twitter: data.socialLinks?.twitter || '',
        },
      });
    } catch (err) {
      console.error(err);
      alert('Failed to fetch profile');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (['github', 'linkedin', 'twitter'].includes(name)) {
      setProfile((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: value,
        },
      }));
    } else {
      setProfile({ ...profile, [name]: value });
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/profile`,
        {
          ...profile,
          dob: profile.dob,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Profile updated!');
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Update failed');
    } finally {
      setLoading(false);
    }
  };

 const handleImageUpload = async () => {
  if (!imageFile) {
    alert('Please select an image first.');
    return;
  }

  if (!token) {
    alert('User is not authenticated.');
    return;
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/profile/upload-photo`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // DO NOT manually set Content-Type to multipart/form-data when using FormData
        },
      }
    );

    if (res.data?.profileImage) {
      alert('✅ Image uploaded!');
      setImageFile(null);
      await fetchProfile();
    } else {
      console.warn('Upload succeeded but no image returned:', res.data);
      alert('Image upload response was invalid.');
    }
  } catch (err) {
    console.error('❌ Upload failed:', err.response?.data || err.message || err);
    alert(err.response?.data?.error || 'Upload failed. Try again.');
  }
};


  const handleDeleteImage = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/profile/delete-photo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Image deleted');
      await fetchProfile();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    }
  };

  const imageURL = profile.profileImage
    ? `${import.meta.env.VITE_API_BASE_URL}${profile.profileImage}`
    : defaultAvatar;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Avatar */}
        <div className="profile-column avatar-column">
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : imageURL}
            alt="profile"
            className="avatar"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultAvatar;
            }}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />

          {imageFile && (
            <button onClick={handleImageUpload}>Upload Photo</button>
          )}

          {profile.profileImage && !imageFile && (
            <button onClick={handleDeleteImage} className="delete-image-btn">
              Delete Image
            </button>
          )}
        </div>

        {/* Bio */}
        <div className="profile-column bio-column">
          <h3>👤 Bio & Info</h3>
          {['name', 'email', 'role', 'location'].map((field) => (
            <div key={field} className="form-group">
              <label>{field[0].toUpperCase() + field.slice(1)}</label>
              <input
                name={field}
                value={profile[field] || ''}
                onChange={handleChange}
              />
            </div>
          ))}
          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={profile.bio || ''}
              onChange={handleChange}
            />
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

        {/* Skills and Social Links */}
        <div className="profile-column skills-column">
          <h3>⚙️ Skills & Links</h3>
          <div className="form-group">
            <label>Skills</label>
            <input
              name="skills"
              value={profile.skills || ''}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Social Links</label>
            <div className="social-links-container">
              {isEditingLinks ? (
                <>
                  {['github', 'linkedin', 'twitter'].map((platform) => (
                    <div key={platform} className="social-link-item edit-mode">
                      <input
                        name={platform}
                        value={profile.socialLinks[platform]}
                        onChange={handleChange}
                        placeholder={`${platform.charAt(0).toUpperCase() + platform.slice(1)} URL`}
                      />
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {Object.entries(profile.socialLinks).map(([key, value]) =>
                    value ? (
                      <div key={key} className="social-link-item">
                        <a
                          href={value}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: 'white', textDecoration: 'none' }}
                        >
                          🔗 {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                        </a>
                      </div>
                    ) : null
                  )}
                </>
              )}
              <button
                onClick={() => setIsEditingLinks(!isEditingLinks)}
                className="edit-toggle-btn"
              >
                {isEditingLinks ? '✅ Done' : '✏️ Edit Links'}
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
