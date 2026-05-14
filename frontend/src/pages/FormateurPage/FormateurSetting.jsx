import React, { useEffect, useState } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import {
  FaCog,
  FaBell,
  FaLock,
  FaCreditCard,
  FaFileAlt,
  FaToggleOn,
  FaToggleOff,
  FaSave
} from 'react-icons/fa';
import SidebarF from '../../components/formateur/sidebarF';
import {
  getFormateurProfile,
  updateFormateurProfile
} from '../../services/formateurService';

const FormateurSetting = () => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profile, setProfile] = useState(null);

  const [accountSettings, setAccountSettings] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    language: 'en'
  });

  const [profileSettings, setProfileSettings] = useState({
    bio: '',
    field: '',
    skills: []
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    studentMessages: true,
    paymentAlerts: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEarnings: false,
    allowMessages: true
  });

  const [billingSettings, setBillingSettings] = useState({
    bankAccount: '',
    paymentMethod: 'bank_transfer',
    taxId: '',
    billingAddress: ''
  });

  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getFormateurProfile();
        const user = response.data?.data || null;
        setProfile(user);
        setAccountSettings({
          fullName: user?.fullName || '',
          email: user?.email || '',
          phoneNumber: user?.phoneNumber || '',
          language: user?.language || i18n?.language || 'en'
        });
        setProfileSettings({
          bio: user?.bio || '',
          field: user?.field || '',
          skills: user?.skills || []
        });
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || t('formateur.settings.failedToLoadSettings')
        });
      }
    };

    fetchUserData();
  }, [i18n]);

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

  const notificationLabelMap = {
    emailNotifications: t('formateur.settings.notificationLabels.emailNotifications'),
    courseUpdates: t('formateur.settings.notificationLabels.courseUpdates'),
    studentMessages: t('formateur.settings.notificationLabels.studentMessages'),
    paymentAlerts: t('formateur.settings.notificationLabels.paymentAlerts')
  };

  const privacyLabelMap = {
    profilePublic: t('formateur.settings.privacyLabels.profilePublic'),
    showEarnings: t('formateur.settings.privacyLabels.showEarnings'),
    allowMessages: t('formateur.settings.privacyLabels.allowMessages')
  };

  const handleAccountSettingsSave = async () => {
    try {
      setLoading(true);
      const response = await updateFormateurProfile(accountSettings);
      setProfile(response.data?.data || profile);
      setMessage({
        type: 'success',
        text: t('formateur.settings.accountSettingsSaved')
      });

      if (accountSettings.language !== currentLang) {
        const instance = (i18n && typeof i18n.changeLanguage === 'function') ? i18n : i18nInstance;
        if (instance && typeof instance.changeLanguage === 'function') {
          instance.changeLanguage(accountSettings.language);
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || t('formateur.settings.failedToUpdateSettings')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSettingsSave = async () => {
    try {
      setLoading(true);
      const response = await updateFormateurProfile(profileSettings);
      setProfile(response.data?.data || profile);
      setMessage({
        type: 'success',
        text: t('formateur.settings.profileSettingsSaved')
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update settings'
      });
    } finally {
      setLoading(false);
    }
  };

  const saveUnsupportedSettings = (label) => {
    setMessage({
      type: 'success',
      text: t('formateur.settings.unsupportedSavedNotice', { label })
    });
  };

  const addSkill = () => {
    if (newSkill && !profileSettings.skills.includes(newSkill)) {
      setProfileSettings({
        ...profileSettings,
        skills: [...profileSettings.skills, newSkill]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfileSettings({
      ...profileSettings,
      skills: profileSettings.skills.filter((_, i) => i !== index)
    });
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
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}

          <div className="settings-container">
            <div className="settings-tabs">
              <button className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
                <FaCog /> {t('formateur.settings.accountTab')}
              </button>
              <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <FaFileAlt /> {t('formateur.settings.profileTab')}
              </button>
              <button className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <FaBell /> {t('formateur.settings.notificationsTab')}
              </button>
              <button className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
                <FaLock /> {t('formateur.settings.privacyTab')}
              </button>
              <button className={`settings-tab ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
                <FaCreditCard /> {t('formateur.settings.billingTab')}
              </button>
            </div>

            {activeTab === 'account' && (
              <div className="settings-panel">
                <h2>{t('formateur.settings.accountSettingsTitle')}</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>{t('formateur.profile.fullName')}</label>
                    <input type="text" value={accountSettings.fullName} onChange={(e) => setAccountSettings({ ...accountSettings, fullName: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>{t('formateur.settings.emailAddress')}</label>
                    <input type="email" value={accountSettings.email} onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>{t('formateur.settings.phoneNumber')}</label>
                    <input type="tel" value={accountSettings.phoneNumber} onChange={(e) => setAccountSettings({ ...accountSettings, phoneNumber: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>{t('formateur.settings.language')}</label>
                    <select value={accountSettings.language} onChange={(e) => setAccountSettings({ ...accountSettings, language: e.target.value })} className="form-input">
                      <option value="en">{t('formateur.settings.english')}</option>
                      <option value="fr">{t('formateur.settings.french')}</option>
                    </select>
                  </div>

                  <button className="btn-save-settings" onClick={handleAccountSettingsSave} disabled={loading}>
                    <FaSave /> {loading ? t('formateur.profile.saving') : t('formateur.settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="settings-panel">
                <h2>{t('formateur.settings.profileSettingsTitle')}</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>{t('formateur.settings.expertiseField')}</label>
                    <input type="text" value={profileSettings.field} onChange={(e) => setProfileSettings({ ...profileSettings, field: e.target.value })} placeholder={t('formateur.settings.expertiseField')} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>{t('formateur.settings.bio')}</label>
                    <textarea value={profileSettings.bio} onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })} placeholder={t('formateur.settings.bio')} className="form-textarea" rows="5" />
                  </div>

                  <div className="form-group">
                    <label>{t('formateur.settings.skills')}</label>
                    <div className="skills-input-wrapper">
                      <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder={t('formateur.settings.add')} className="form-input" />
                      <button type="button" onClick={addSkill} className="btn-add-skill">{t('formateur.settings.add')}</button>
                    </div>
                    <div className="skills-list">
                      {profileSettings.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                          <button onClick={() => removeSkill(index)} className="skill-remove">x</button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button className="btn-save-settings" onClick={handleProfileSettingsSave} disabled={loading}>
                    <FaSave /> {loading ? t('formateur.profile.saving') : t('formateur.settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <h2>{t('formateur.settings.notificationSettingsTitle')}</h2>
                <div className="settings-form">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="toggle-setting">
                      <div>
                        <label>{notificationLabelMap[key] || key}</label>
                        <p>{t('formateur.settings.saveLocallyNotice')}</p>
                      </div>
                      <button className="toggle-btn" onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })}>
                        {value ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  ))}
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings(t('formateur.settings.notificationSettingsTitle'))}>
                    <FaSave /> {t('formateur.settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-panel">
                <h2>{t('formateur.settings.privacySettingsTitle')}</h2>
                <div className="settings-form">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="toggle-setting">
                      <div>
                        <label>{privacyLabelMap[key] || key}</label>
                        <p>{t('formateur.settings.privacyNotice')}</p>
                      </div>
                      <button className="toggle-btn" onClick={() => setPrivacySettings({ ...privacySettings, [key]: !value })}>
                        {value ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  ))}
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings(t('formateur.settings.privacySettingsTitle'))}>
                    <FaSave /> {t('formateur.settings.saveChanges')}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="settings-panel">
                <h2>{t('formateur.settings.billingSettingsTitle')}</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>{t('formateur.settings.paymentMethod')}</label>
                    <select value={billingSettings.paymentMethod} onChange={(e) => setBillingSettings({ ...billingSettings, paymentMethod: e.target.value })} className="form-input">
                      <option value="bank_transfer">{t('formateur.settings.bankTransfer')}</option>
                      <option value="stripe">{t('formateur.settings.stripe')}</option>
                      <option value="paypal">{t('formateur.settings.paypal')}</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>{t('formateur.settings.bankAccount')}</label>
                    <input type="text" value={billingSettings.bankAccount} onChange={(e) => setBillingSettings({ ...billingSettings, bankAccount: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>{t('formateur.settings.taxId')}</label>
                    <input type="text" value={billingSettings.taxId} onChange={(e) => setBillingSettings({ ...billingSettings, taxId: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>{t('formateur.settings.billingAddress')}</label>
                    <textarea value={billingSettings.billingAddress} onChange={(e) => setBillingSettings({ ...billingSettings, billingAddress: e.target.value })} className="form-textarea" rows="4" />
                  </div>
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings(t('formateur.settings.billingSettingsTitle'))}>
                    <FaSave /> {t('formateur.settings.saveChanges')}
                  </button>
                  <div className="billing-info" style={{ marginTop: '2rem' }}>
                    <h3>{t('formateur.settings.payoutInfoTitle')}</h3>
                    <p>{t('formateur.settings.payoutInfoDescription')}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurSetting;
