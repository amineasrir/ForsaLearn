import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import './dashboard.css';
import { getApprenantProfile, updateApprenantProfile } from '../../services/apprenentService';

const ApprenantProfile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    gender: 'prefer-not-to-say',
    bio: '',
    interests: '',
    skillsNeeded: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getApprenantProfile();
        const loadedUser = response.data?.user || null;

        setUser(loadedUser);
        setFormData({
          fullName: loadedUser?.fullName || '',
          phoneNumber: loadedUser?.phoneNumber || '',
          gender: loadedUser?.gender || 'prefer-not-to-say',
          bio: loadedUser?.bio || '',
          interests: (loadedUser?.interests || []).join(', '),
          skillsNeeded: (loadedUser?.skillsNeeded || []).join(', ')
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetFormFromUser = (sourceUser) => {
    setFormData({
      fullName: sourceUser?.fullName || '',
      phoneNumber: sourceUser?.phoneNumber || '',
      gender: sourceUser?.gender || 'prefer-not-to-say',
      bio: sourceUser?.bio || '',
      interests: (sourceUser?.interests || []).join(', '),
      skillsNeeded: (sourceUser?.skillsNeeded || []).join(', ')
    });
  };

  const handleCancel = () => {
    resetFormFromUser(user);
    setEditMode(false);
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');
      setSuccess('');

      const payload = {
        fullName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        gender: formData.gender,
        bio: formData.bio.trim(),
        interests: formData.interests.split(',').map((item) => item.trim()).filter(Boolean),
        skillsNeeded: formData.skillsNeeded.split(',').map((item) => item.trim()).filter(Boolean)
      };

      const response = await updateApprenantProfile(payload);
      const updatedUser = response.data?.user || null;

      setUser(updatedUser);
      resetFormFromUser(updatedUser);
      setEditMode(false);
      setSuccess('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const profileData = {
    fullName: user?.fullName || 'Student',
    phone: user?.phoneNumber || 'N/A',
    gender: user?.gender ? user.gender.replace(/-/g, ' ') : 'Not specified',
    bio: user?.bio || 'No bio available.',
    registrationDate: user?.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A',
    email: user?.email || 'N/A',
    interests: (user?.interests || []).join(', ') || 'N/A',
    skillsNeeded: (user?.skillsNeeded || []).join(', ') || 'N/A'
  };

  return (
    <ApprenantLayout>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="profile-page-content">
        <h2 className="profile-title">
          {t('apprenant.myProfile')}
          <button
            className="title-edit-btn"
            onClick={() => {
              setSuccess('');
              setEditMode((value) => !value);
            }}
            title={editMode ? t('apprenant.close') : t('apprenant.settings')}
            type="button"
          >
            Edit
          </button>
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="profile-details">
            <div>
              <label>{t('apprenant.fullName')}</label>
              {editMode ? (
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profileData.fullName}</p>
              )}
            </div>

            <div>
              <label>{t('apprenant.registrationDate')}</label>
              <p className="value">{profileData.registrationDate}</p>
            </div>

            <div>
              <label>{t('apprenant.phoneNumber')}</label>
              {editMode ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profileData.phone}</p>
              )}
            </div>

            <div>
              <label>{t('email')}</label>
              <p className="value">{profileData.email}</p>
            </div>

            <div>
              <label>{t('apprenant.gender')}</label>
              {editMode ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="prefer-not-to-say">Prefer not to say</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="value">{profileData.gender}</p>
              )}
            </div>

            <div>
              <label>Interests</label>
              {editMode ? (
                <input
                  type="text"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  placeholder="UI/UX, AI, Design"
                />
              ) : (
                <p className="value">{profileData.interests}</p>
              )}
            </div>

            <div>
              <label>Learning Goals</label>
              {editMode ? (
                <input
                  type="text"
                  name="skillsNeeded"
                  value={formData.skillsNeeded}
                  onChange={handleChange}
                  placeholder="React, Node.js, English"
                />
              ) : (
                <p className="value">{profileData.skillsNeeded}</p>
              )}
            </div>

            <div>
              <label>{t('apprenant.bio')}</label>
              {editMode ? (
                <textarea
                  name="bio"
                  rows="4"
                  value={formData.bio}
                  onChange={handleChange}
                />
              ) : (
                <p className="value">{profileData.bio}</p>
              )}
            </div>
          </div>

          {editMode && (
            <div className="profile-actions">
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                {t('apprenant.close')}
              </button>
              <button type="submit" className="save-btn" disabled={saving}>
                {saving ? 'Saving...' : t('apprenant.saveChanges')}
              </button>
            </div>
          )}
        </form>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantProfile;
