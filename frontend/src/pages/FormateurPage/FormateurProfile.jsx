import React, { useEffect, useState } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import { FaEdit } from 'react-icons/fa';
import SidebarF from '../../components/formateur/sidebarF';
import {
  getFormateurProfile,
  updateFormateurProfile
} from '../../services/formateurService';

const FormateurProfile = () => {
  const { t, i18n } = useTranslation();
  const [formateur, setFormateur] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    bio: '',
    field: '',
    skills: ''
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getFormateurProfile();
        const user = response.data?.data || null;
        setFormateur(user);
        setFormData({
          fullName: user?.fullName || '',
          phoneNumber: user?.phoneNumber || '',
          email: user?.email || '',
          bio: user?.bio || '',
          field: user?.field || '',
          skills: (user?.skills || []).join(', ')
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile.');
      }
    };

    loadProfile();
  }, []);

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === 'en') ? 'fr' : 'en';
    const instance = (i18n && typeof i18n.changeLanguage === 'function') ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === 'function') {
      instance.changeLanguage(lang);
    }
  };

  const getFlagClass = (lang) => {
    switch (lang) {
      case 'en':
        return 'fi fi-gb';
      case 'fr':
        return 'fi fi-fr';
      default:
        return 'fi fi-gl';
    }
  };

  const currentLang = (i18n && i18n.language) ? i18n.language : 'en';

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      const payload = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
        bio: formData.bio,
        field: formData.field,
        skills: formData.skills.split(',').map((skill) => skill.trim()).filter(Boolean)
      };

      const response = await updateFormateurProfile(payload);
      const updatedUser = response.data?.data || null;
      setFormateur(updatedUser);
      setFormData({
        fullName: updatedUser?.fullName || '',
        phoneNumber: updatedUser?.phoneNumber || '',
        email: updatedUser?.email || '',
        bio: updatedUser?.bio || '',
        field: updatedUser?.field || '',
        skills: (updatedUser?.skills || []).join(', ')
      });
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
 
          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(currentLang)} style={{ fontSize: '20px' }}></span>
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />

        <main className="formateur-main">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="profile-details">
            <h2>
              {t('formateur.profile.basicInformation')}
              <FaEdit className="section-edit-icon" onClick={() => setEditing(true)} />
            </h2>
            {editing ? (
              <div className="edit-form">
                <label>
                  {t('formateur.profile.fullName')}
                  <input type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                </label>
                <label>
                  {t('formateur.profile.phone')}
                  <input type="text" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />
                </label>
                <label>
                  {t('formateur.profile.email')}
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </label>
                <label>
                  {t('formateur.profile.expertiseField')}
                  <input type="text" value={formData.field} onChange={(e) => setFormData({ ...formData, field: e.target.value })} />
                </label>
                <label>
                  {t('formateur.profile.bio')}
                  <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} />
                </label>
                <label>
                  {t('formateur.profile.skills')}
                  <input type="text" value={formData.skills} onChange={(e) => setFormData({ ...formData, skills: e.target.value })} placeholder={t('formateur.profile.skills') + ' - React, Node.js, UI Design'} />
                </label>
                <div className="form-actions">
                  <button onClick={handleSave} disabled={saving}>{saving ? t('formateur.profile.saving') : t('formateur.profile.save')}</button>
                  <button onClick={() => setEditing(false)}>{t('formateur.profile.cancel')}</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>{t('formateur.profile.fullName')}:</strong> {formateur?.fullName || '-'}</p>
                <p><strong>{t('formateur.profile.phone')}:</strong> {formateur?.phoneNumber || '-'}</p>
                <p><strong>{t('formateur.profile.email')}:</strong> {formateur?.email || '-'}</p>
                <p><strong>{t('formateur.profile.expertiseField')}:</strong> {formateur?.field || '-'}</p>
                <p><strong>{t('formateur.profile.bio')}:</strong> {formateur?.bio || t('formateur.profile.noBioYet')}</p>
              </>
            )}
          </div>

          <div className="profile-details">
            <h2>{t('formateur.profile.skills')}</h2>
            {(formateur?.skills || []).length === 0 ? (
              <p>{t('formateur.profile.noSkillsYet')}</p>
            ) : (
              (formateur.skills || []).map((skill, idx) => (
                <p key={idx}>&#8226; {skill}</p>
              ))
            )}
          </div>

          <div className="profile-details">
            <h2>{t('formateur.profile.accountStatus')}</h2>
            <p><strong>{t('formateur.profile.role')}:</strong> {formateur?.role || 'formateur'}</p>
            <p><strong>{t('formateur.profile.approved')}:</strong> {formateur?.isApproved ? t('formateur.profile.yes') : t('formateur.profile.pendingReview')}</p>
            <p><strong>{t('formateur.profile.language')}:</strong> {formateur?.language || 'en'}</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurProfile;
