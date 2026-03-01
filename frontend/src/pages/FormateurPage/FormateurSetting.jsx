import React, { useState, useEffect } from 'react';
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
  FaSave,
  FaTimes,
  FaEye,
  FaEyeSlash,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SidebarF from '../../components/formateur/sidebarF';
import axios from 'axios';

const FormateurSetting = () => {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    language: i18n?.language || 'en',
  });

  // Profile Settings
  const [profileSettings, setProfileSettings] = useState({
    bio: '',
    field: '',
    skills: [],
    profilePicture: '',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    courseUpdates: true,
    studentMessages: true,
    paymentAlerts: true,
    weeklyReport: true,
    promotionalEmails: false,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEarnings: false,
    showStudentCount: true,
    allowMessages: true,
  });

  // Billing Settings
  const [billingSettings, setBillingSettings] = useState({
    bankAccount: '',
    paymentMethod: 'bank_transfer',
    taxId: '',
    billingAddress: '',
  });

  const [newSkill, setNewSkill] = useState('');
  const [editingField, setEditingField] = useState(null);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = response.data.user;
        setAccountSettings({
          fullName: user.fullName || '',
          email: user.email || '',
          phoneNumber: user.phoneNumber || '',
          language: user.language || i18n?.language || 'en',
        });

        setProfileSettings({
          bio: user.bio || '',
          field: user.field || '',
          skills: user.skills || [],
          profilePicture: user.profilePicture || '',
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({
          type: 'error',
          text: 'Failed to load settings',
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

  // Handle Account Settings Save
  const handleAccountSettingsSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        {
          fullName: accountSettings.fullName,
          email: accountSettings.email,
          phoneNumber: accountSettings.phoneNumber,
          language: accountSettings.language,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: 'Account settings updated successfully',
      });

      // Change language if updated
      if (accountSettings.language !== currentLang) {
        const instance = (i18n && typeof i18n.changeLanguage === 'function') ? i18n : i18nInstance;
        if (instance && typeof instance.changeLanguage === 'function') {
          instance.changeLanguage(accountSettings.language);
        }
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update settings',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Profile Settings Save
  const handleProfileSettingsSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-profile',
        {
          bio: profileSettings.bio,
          field: profileSettings.field,
          skills: profileSettings.skills,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: 'Profile settings updated successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update settings',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Password Change
  const handlePasswordChange = async () => {
    if (securitySettings.newPassword !== securitySettings.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Passwords do not match',
      });
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/auth/change-password',
        {
          currentPassword: securitySettings.currentPassword,
          newPassword: securitySettings.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSecuritySettings({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorAuth: false,
      });

      setMessage({
        type: 'success',
        text: 'Password changed successfully',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to change password',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Notification Settings Save
  const handleNotificationSettingsSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-notifications',
        notificationSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: 'Notification settings updated',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update notification settings',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Privacy Settings Save
  const handlePrivacySettingsSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-privacy',
        privacySettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: 'Privacy settings updated',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update privacy settings',
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Billing Settings Save
  const handleBillingSettingsSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        'http://localhost:5000/api/auth/update-billing',
        billingSettings,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: 'Billing settings updated',
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Failed to update billing settings',
      });
    } finally {
      setLoading(false);
    }
  };

  const addSkill = () => {
    if (newSkill && !profileSettings.skills.includes(newSkill)) {
      setProfileSettings({
        ...profileSettings,
        skills: [...profileSettings.skills, newSkill],
      });
      setNewSkill('');
    }
  };

  const removeSkill = (index) => {
    setProfileSettings({
      ...profileSettings,
      skills: profileSettings.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="formateur-page">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-center">
            <h1>Settings</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/Settings</span>
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
        {/* Sidebar */}
        <SidebarF />

        {/* Main Content */}
        <main className="formateur-main">
          {/* Message Display */}
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
              <button
                className="alert-close"
                onClick={() => setMessage({ type: '', text: '' })}
              >
                <FaTimes />
              </button>
            </div>
          )}

          {/* Settings Tabs */}
          <div className="settings-container">
            <div className="settings-tabs">
              <button
                className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                onClick={() => setActiveTab('account')}
              >
                <FaCog /> Account
              </button>
              <button
                className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <FaFileAlt /> Profile
              </button>
              <button
                className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <FaLock /> Security
              </button>
              <button
                className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                onClick={() => setActiveTab('notifications')}
              >
                <FaBell /> Notifications
              </button>
              <button
                className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                onClick={() => setActiveTab('privacy')}
              >
                <FaLock /> Privacy
              </button>
              <button
                className={`settings-tab ${activeTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                <FaCreditCard /> Billing
              </button>
            </div>

            {/* Account Settings Tab */}
            {activeTab === 'account' && (
              <div className="settings-panel">
                <h2>Account Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={accountSettings.fullName}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          fullName: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      value={accountSettings.email}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          email: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={accountSettings.phoneNumber}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          phoneNumber: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Language</label>
                    <select
                      value={accountSettings.language}
                      onChange={(e) =>
                        setAccountSettings({
                          ...accountSettings,
                          language: e.target.value,
                        })
                      }
                      className="form-input"
                    >
                      <option value="en">English</option>
                      <option value="fr">Français</option>
                    </select>
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handleAccountSettingsSave}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Profile Settings Tab */}
            {activeTab === 'profile' && (
              <div className="settings-panel">
                <h2>Profile Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Expertise Field</label>
                    <input
                      type="text"
                      value={profileSettings.field}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          field: e.target.value,
                        })
                      }
                      placeholder="e.g., Web Development, Data Science"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={profileSettings.bio}
                      onChange={(e) =>
                        setProfileSettings({
                          ...profileSettings,
                          bio: e.target.value,
                        })
                      }
                      placeholder="Tell students about yourself..."
                      className="form-textarea"
                      rows="5"
                    />
                  </div>

                  <div className="form-group">
                    <label>Skills</label>
                    <div className="skills-input-wrapper">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="Add a skill and press Enter"
                        className="form-input"
                      />
                      <button
                        type="button"
                        onClick={addSkill}
                        className="btn-add-skill"
                      >
                        Add
                      </button>
                    </div>
                    <div className="skills-list">
                      {profileSettings.skills.map((skill, index) => (
                        <span key={index} className="skill-badge">
                          {skill}
                          <button
                            onClick={() => removeSkill(index)}
                            className="skill-remove"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handleProfileSettingsSave}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Settings Tab */}
            {activeTab === 'security' && (
              <div className="settings-panel">
                <h2>Security Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Current Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={securitySettings.currentPassword}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            currentPassword: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                      <button
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>New Password</label>
                    <div className="password-input-wrapper">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={securitySettings.newPassword}
                        onChange={(e) =>
                          setSecuritySettings({
                            ...securitySettings,
                            newPassword: e.target.value,
                          })
                        }
                        className="form-input"
                      />
                      <button
                        className="toggle-password"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password</label>
                    <input
                      type="password"
                      value={securitySettings.confirmPassword}
                      onChange={(e) =>
                        setSecuritySettings({
                          ...securitySettings,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handlePasswordChange}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Updating...' : 'Change Password'}
                  </button>

                  <div className="security-section" style={{ marginTop: '2rem' }}>
                    <h3>Two-Factor Authentication</h3>
                    <p>Add an extra layer of security to your account</p>
                    <div className="toggle-setting">
                      <span>Enable 2FA</span>
                      <button className="toggle-btn">
                        {securitySettings.twoFactorAuth ? <FaToggleOn /> : <FaToggleOff />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Settings Tab */}
            {activeTab === 'notifications' && (
              <div className="settings-panel">
                <h2>Notification Settings</h2>
                <div className="settings-form">
                  <div className="toggle-setting">
                    <div>
                      <label>Email Notifications</label>
                      <p>Receive notifications via email</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          emailNotifications: !notificationSettings.emailNotifications,
                        })
                      }
                    >
                      {notificationSettings.emailNotifications ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Course Updates</label>
                      <p>Get notified about course activity</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          courseUpdates: !notificationSettings.courseUpdates,
                        })
                      }
                    >
                      {notificationSettings.courseUpdates ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Student Messages</label>
                      <p>Notifications for new student messages</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          studentMessages: !notificationSettings.studentMessages,
                        })
                      }
                    >
                      {notificationSettings.studentMessages ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Payment Alerts</label>
                      <p>Get alerted about payments and earnings</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          paymentAlerts: !notificationSettings.paymentAlerts,
                        })
                      }
                    >
                      {notificationSettings.paymentAlerts ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Weekly Report</label>
                      <p>Receive a weekly summary of your activity</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          weeklyReport: !notificationSettings.weeklyReport,
                        })
                      }
                    >
                      {notificationSettings.weeklyReport ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Promotional Emails</label>
                      <p>Receive promotional offers and updates</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setNotificationSettings({
                          ...notificationSettings,
                          promotionalEmails: !notificationSettings.promotionalEmails,
                        })
                      }
                    >
                      {notificationSettings.promotionalEmails ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handleNotificationSettingsSave}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Privacy Settings Tab */}
            {activeTab === 'privacy' && (
              <div className="settings-panel">
                <h2>Privacy Settings</h2>
                <div className="settings-form">
                  <div className="toggle-setting">
                    <div>
                      <label>Public Profile</label>
                      <p>Allow other users to view your profile</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          profilePublic: !privacySettings.profilePublic,
                        })
                      }
                    >
                      {privacySettings.profilePublic ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Show Earnings</label>
                      <p>Display your earnings on your profile</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          showEarnings: !privacySettings.showEarnings,
                        })
                      }
                    >
                      {privacySettings.showEarnings ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Show Student Count</label>
                      <p>Display number of students on your profile</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          showStudentCount: !privacySettings.showStudentCount,
                        })
                      }
                    >
                      {privacySettings.showStudentCount ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <div className="toggle-setting">
                    <div>
                      <label>Allow Messages</label>
                      <p>Allow students to send you direct messages</p>
                    </div>
                    <button
                      className="toggle-btn"
                      onClick={() =>
                        setPrivacySettings({
                          ...privacySettings,
                          allowMessages: !privacySettings.allowMessages,
                        })
                      }
                    >
                      {privacySettings.allowMessages ? (
                        <FaToggleOn />
                      ) : (
                        <FaToggleOff />
                      )}
                    </button>
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handlePrivacySettingsSave}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            {/* Billing Settings Tab */}
            {activeTab === 'billing' && (
              <div className="settings-panel">
                <h2>Billing Settings</h2>
                <div className="settings-form">
                  <div className="form-group">
                    <label>Payment Method</label>
                    <select
                      value={billingSettings.paymentMethod}
                      onChange={(e) =>
                        setBillingSettings({
                          ...billingSettings,
                          paymentMethod: e.target.value,
                        })
                      }
                      className="form-input"
                    >
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="stripe">Stripe</option>
                      <option value="paypal">PayPal</option>
                      <option value="check">Check</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Bank Account / IBAN</label>
                    <input
                      type="text"
                      value={billingSettings.bankAccount}
                      onChange={(e) =>
                        setBillingSettings({
                          ...billingSettings,
                          bankAccount: e.target.value,
                        })
                      }
                      placeholder="Your bank account details"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Tax ID / Company Number</label>
                    <input
                      type="text"
                      value={billingSettings.taxId}
                      onChange={(e) =>
                        setBillingSettings({
                          ...billingSettings,
                          taxId: e.target.value,
                        })
                      }
                      placeholder="Your tax ID or company number"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label>Billing Address</label>
                    <textarea
                      value={billingSettings.billingAddress}
                      onChange={(e) =>
                        setBillingSettings({
                          ...billingSettings,
                          billingAddress: e.target.value,
                        })
                      }
                      placeholder="Street, City, Country, Postal Code"
                      className="form-textarea"
                      rows="4"
                    />
                  </div>

                  <button
                    className="btn-save-settings"
                    onClick={handleBillingSettingsSave}
                    disabled={loading}
                  >
                    <FaSave /> {loading ? 'Saving...' : 'Save Changes'}
                  </button>

                  <div className="billing-info" style={{ marginTop: '2rem' }}>
                    <h3>Payout Information</h3>
                    <p>You will receive payouts based on the payment method selected above.</p>
                    <ul>
                      <li>Processing time: 5-7 business days</li>
                      <li>Minimum payout amount: $50</li>
                      <li>Payouts are processed monthly</li>
                    </ul>
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
