import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import './apprenant.css';
import { getApprenantProfile } from '../../services/apprenentService';

const ApprenantProfile = () => {
  const { t } = useTranslation();
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
    <ApprenantLayout>

          {error && <div className="error-message">{error}</div>}
          <div className="profile-page-content">
            <h2 className="profile-title">
              {t('apprenant.myProfile')}
             
            </h2>
            <div className="profile-details">
              <div>
                <label>{t('apprenant.fullName')}</label>
                <p className="value">{profileData.fullName}</p>
              </div>
              <div>
                <label>{t('apprenant.registrationDate')}</label>
                <p className="value">{profileData.registrationDate}</p>
              </div>
              <div>
                <label>{t('apprenant.phoneNumber')}</label>
                <p className="value">{profileData.phone}</p>
              </div>
              <div>
                <label>{t('email')}</label>
                <p className="value">{profileData.email}</p>
              </div>
              <div>
                <label>{t('apprenant.gender')}</label>
                <p className="value">{profileData.gender}</p>
              </div>
              <div>
                <label>{t('apprenant.bio')}</label>
                <p className="value">{profileData.bio}</p>
              </div>
            </div>
            {editMode && (
              <div className="profile-actions">
                <button className="cancel-btn" onClick={() => setEditMode(false)}>{t('apprenant.close')}</button>
              </div>
            )}
          </div>
      </ApprenantLayout>
  );
};

export default ApprenantProfile;
