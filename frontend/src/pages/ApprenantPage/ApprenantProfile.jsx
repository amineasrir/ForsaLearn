import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import { getApprenantProfile } from '../../services/apprenentService';

const ApprenantProfile = () => {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getApprenantProfile();
        setUser(response.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    loadProfile();
  }, []);

  const profileData = {
    fullName: user?.fullName || 'Student',
    phone: user?.phoneNumber || 'N/A',
    gender: 'Not specified',
    bio: user?.bio || 'No bio available.',
    registrationDate: user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
    email: user?.email || 'N/A',
  };

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="My Profile"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'My Profile' }]}
        rightContent={
          <>
            <button className="lang-btn">ENG</button>
            <div className="notification-icon"></div>
            <div className="cart-icon"></div>
          </>
        }
      />
      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}
          <div className="profile-page-content">
            <h2 className="profile-title">
              My Profile
              <button
                className="title-edit-btn"
                onClick={() => setEditMode(v => !v)}
                title={editMode ? 'Cancel editing' : 'Edit profile'}
              >✎</button>
            </h2>
            <div className="profile-details">
              <div>
                <label>Full Name</label>
                <p className="value">{profileData.fullName}</p>
              </div>
              <div>
                <label>Registration Date</label>
                <p className="value">{profileData.registrationDate}</p>
              </div>
              <div>
                <label>Phone Number</label>
                <p className="value">{profileData.phone}</p>
              </div>
              <div>
                <label>Email</label>
                <p className="value">{profileData.email}</p>
              </div>
              <div>
                <label>Gender</label>
                <p className="value">{profileData.gender}</p>
              </div>
              <div>
                <label>Bio</label>
                <p className="value">{profileData.bio}</p>
              </div>
            </div>
            {editMode && (
              <div className="profile-actions">
                <button className="cancel-btn" onClick={() => setEditMode(false)}>Close</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantProfile;
