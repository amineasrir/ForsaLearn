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
  const { i18n } = useTranslation();
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
          text: error.response?.data?.message || 'Failed to load settings'
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

  const handleAccountSettingsSave = async () => {
    try {
      setLoading(true);
      const response = await updateFormateurProfile(accountSettings);
      setProfile(response.data?.data || profile);
      setMessage({
        type: 'success',
        text: 'Account settings updated successfully'
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
        text: error.response?.data?.message || 'Failed to update settings'
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
        text: 'Profile settings updated successfully'
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
      text: `${label} saved locally in the interface. No backend endpoint is available yet.`
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
                <FaCog /> Account
              </button>
              <button className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                <FaFileAlt /> Profile
              </button>
              <button className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                <FaBell /> Notifications
              </button>
              <button className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
                <FaLock /> Privacy
              </button>
              <button className={`settings-tab ${activeTab === 'billing' ? 'active' : ''}`} onClick={() => setActiveTab('billing')}>
                <FaCreditCard /> Billing
              </button>
            </div>

            {activeTab === 'account' && (
              <div className="settings-panel">
                <h2>Account Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={accountSettings.fullName} onChange={(e) => setAccountSettings({ ...accountSettings, fullName: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input type="email" value={accountSettings.email} onChange={(e) => setAccountSettings({ ...accountSettings, email: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="tel" value={accountSettings.phoneNumber} onChange={(e) => setAccountSettings({ ...accountSettings, phoneNumber: e.target.value })} className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Language</label>
                    <select value={accountSettings.language} onChange={(e) => setAccountSettings({ ...accountSettings, language: e.target.value })} className="form-input">
                      <option value="en">English</option>
                      <option value="fr">Francais</option>
                    </select>
                  </div>

                  <button className="btn-save-settings" onClick={handleAccountSettingsSave} disabled={loading}>
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="settings-panel">
                <h2>Profile Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Expertise Field</label>
                    <input type="text" value={profileSettings.field} onChange={(e) => setProfileSettings({ ...profileSettings, field: e.target.value })} placeholder="e.g., Web Development, Data Science" className="form-input" />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea value={profileSettings.bio} onChange={(e) => setProfileSettings({ ...profileSettings, bio: e.target.value })} placeholder="Tell students about yourself..." className="form-textarea" rows="5" />
                  </div>

                  <div className="form-group">
                    <label>Skills</label>
                    <div className="skills-input-wrapper">
                      <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Add a skill and press Enter" className="form-input" />
                      <button type="button" onClick={addSkill} className="btn-add-skill">Add</button>
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
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <h2>Notification Settings</h2>
                <div className="settings-form">
                  {Object.entries(notificationSettings).map(([key, value]) => (
                    <div key={key} className="toggle-setting">
                      <div>
                        <label>{key}</label>
                        <p>Toggle this preference in the interface.</p>
                      </div>
                      <button className="toggle-btn" onClick={() => setNotificationSettings({ ...notificationSettings, [key]: !value })}>
                        {value ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  ))}
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings('Notification settings')}>
                    <FaSave /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="settings-panel">
                <h2>Privacy Settings</h2>
                <div className="settings-form">
                  {Object.entries(privacySettings).map(([key, value]) => (
                    <div key={key} className="toggle-setting">
                      <div>
                        <label>{key}</label>
                        <p>Adjust this preference locally until backend support is added.</p>
                      </div>
                      <button className="toggle-btn" onClick={() => setPrivacySettings({ ...privacySettings, [key]: !value })}>
                        {value ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  ))}
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings('Privacy settings')}>
                    <FaSave /> Save Changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="settings-panel">
                <h2>Billing Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select value={billingSettings.paymentMethod} onChange={(e) => setBillingSettings({ ...billingSettings, paymentMethod: e.target.value })} className="form-input">
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bank Account / IBAN</label>
                    <input type="text" value={billingSettings.bankAccount} onChange={(e) => setBillingSettings({ ...billingSettings, bankAccount: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Tax ID / Company Number</label>
                    <input type="text" value={billingSettings.taxId} onChange={(e) => setBillingSettings({ ...billingSettings, taxId: e.target.value })} className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Billing Address</label>
                    <textarea value={billingSettings.billingAddress} onChange={(e) => setBillingSettings({ ...billingSettings, billingAddress: e.target.value })} className="form-textarea" rows="4" />
                  </div>
                  <button className="btn-save-settings" onClick={() => saveUnsupportedSettings('Billing settings')}>
                    <FaSave /> Save Changes
                  </button>
                  <div className="billing-info" style={{ marginTop: '2rem' }}>
                    <h3>Payout Information</h3>
                    <p>Current earnings are loaded from the backend, while payout preferences are still frontend-only for now.</p>
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
