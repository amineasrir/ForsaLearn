import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/myprofile-admin.css';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import { FaCamera, FaEdit } from 'react-icons/fa';
import { getAdminProfile, uploadAdminProfilePicture } from '../../services/adminService';
import { AUTH_KEYS } from '../../utils/authStorage';
import { getUserAvatar } from '../../utils/userAvatar';

const splitFullName = (fullName = '') => {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ')
  };
};

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: 'Marrakesh, Morocco',
    bio: 'Administrator and educator passionate about online learning.',
    role: 'Administrateur',
    joinDate: ''
  });
  const [profilePicture, setProfilePicture] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getAdminProfile();
        const user = response.data?.user;
        const { firstName, lastName } = splitFullName(user?.fullName);

        setFormData({
          firstName,
          lastName,
          email: user?.email || '',
          phone: user?.phoneNumber || '',
          address: 'Marrakesh, Morocco',
          bio: 'Administrator and educator passionate about online learning.',
          role: 'Administrateur',
          joinDate: user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
            : ''
        });
        setProfilePicture(user?.profilePicture || '');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load admin profile.');
      }
    };

    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
  };

  const updateStoredAdminUser = (nextProfilePicture) => {
    const rawUser = localStorage.getItem(AUTH_KEYS.adminUser);
    if (!rawUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(rawUser);
      parsedUser.profilePicture = nextProfilePicture;
      localStorage.setItem(AUTH_KEYS.adminUser, JSON.stringify(parsedUser));
    } catch (storageError) {
      // Ignore malformed cached user objects.
    }
  };

  const handleAvatarButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setUploadingImage(true);
      setError('');
      setSuccess('');

      const response = await uploadAdminProfilePicture(file);
      const nextProfilePicture = response.data?.data?.url || '';

      setProfilePicture(nextProfilePicture);
      updateStoredAdminUser(nextProfilePicture);
      setSuccess('Profile picture updated successfully.');
    } catch (uploadError) {
      setError(uploadError.response?.data?.message || 'Failed to upload profile picture.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const fullName = useMemo(() => (
    [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim() || 'Administrator'
  ), [formData.firstName, formData.lastName]);

  return (
    <div className="dashboard">
      <Header title='Profile'/>
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <div className="profile-card">
              <div className="profile-content">
                <div className="profile-avatar-wrapper">
                  <img
                    src={getUserAvatar(profilePicture)}
                    alt={fullName}
                    className="profile-avatar"
                  />
                  <span className="profile-status"></span>
                  <button
                    className="avatar-edit-btn"
                    type="button"
                    onClick={handleAvatarButtonClick}
                    disabled={uploadingImage}
                    title={uploadingImage ? 'Uploading...' : 'Upload profile picture'}
                  >
                    <FaCamera />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleAvatarChange}
                  />
                </div>
                <div className="profile-info">
                  <h2 className="profile-name">{fullName}</h2>
                  <p className="profile-role">{formData.role}</p>
                  <p className="profile-member-since">Member since {formData.joinDate || 'Recently'}</p>
                  {uploadingImage && (
                    <p className="profile-member-since">Uploading profile picture...</p>
                  )}
                </div>
                <button
                  className="edit-profile-btn"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <FaEdit /> {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Personal Information</h3>
              </div>

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label className="form-label">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      disabled={!isEditing}
                      className="form-textarea"
                      rows="4"
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button
                      type="button"
                      className="year-selector"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn-save">
                      Save Changes
                    </button>
                  </div>
                )}
              </form>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Security Settings</h3>
              </div>

              <div className="security-section">
                <div className="security-item">
                  <div className="security-info">
                    <h3 className="security-title">Change Password</h3>
                    <p className="security-desc">Update your password to keep your account secure</p>
                  </div>
                  <button className="year-selector">Change Password</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3 className="security-title">Two-Factor Authentication</h3>
                    <p className="security-desc">Add an extra layer of security to your account</p>
                  </div>
                  <button className="year-selector">Enable 2FA</button>
                </div>

                <div className="security-item">
                  <div className="security-info">
                    <h3 className="security-title">Active Sessions</h3>
                    <p className="security-desc">Manage your active sessions across devices</p>
                  </div>
                  <button className="year-selector">View Sessions</button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
