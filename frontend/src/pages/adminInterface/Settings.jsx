import React, { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/settings-admin.css';
import { 
  FaUser,
  FaBell,
  FaLock,
  FaGlobe,
  FaPalette,
  FaShieldAlt,
  FaEnvelope,
  FaPhone,
  FaCamera,
  FaSave,
  FaCheck,
  FaTimes,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaTrash,
  FaDownload,
  FaSignOutAlt,
  FaMoon,
  FaSun
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Profile Settings State
  const [profileData, setProfileData] = useState({
    fullName: 'Elrhouat Chaima',
    email: 'elrhouat.chaima@example.com',
    phoneNumber: '+212 6XX XXX XXX',
    bio: 'Administrator and educator passionate about online learning.',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  });

  // Password Settings State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    courseUpdates: true,
    newMessages: true,
    assignmentReminders: true,
    marketingEmails: false,
    weeklyDigest: true,
    pushNotifications: true,
    smsNotifications: false
  });

  // Appearance Settings State
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'en',
    fontSize: 'medium',
    colorScheme: 'default'
  });

  // Privacy Settings State
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    allowMessages: true,
    showOnlineStatus: true,
    dataCollection: true
  });

  // Security Settings State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30',
    deviceManagement: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FaUser /> },
    { id: 'password', label: 'Password', icon: <FaLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'appearance', label: 'Appearance', icon: <FaPalette /> },
    { id: 'privacy', label: 'Privacy', icon: <FaShieldAlt /> },
    { id: 'security', label: 'Security', icon: <FaKey /> }
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAppearanceChange = (key, value) => {
    setAppearance(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyChange = (key, value) => {
    setPrivacy(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityToggle = (key) => {
    setSecurity(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    console.log('Saving profile:', profileData);
    // Add save logic here
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    console.log('Changing password');
    // Add password change logic here
  };

  return (
    <div className="dashboard">
      <Header title='Settings'/>
      
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            {/* Page Header */}
            <ProfileCard />
            {/* Settings Container */}
            <div className="chart-card settings-container">
              {/* Settings Tabs */}
              <div className="settings-sidebar">
                <div className="settings-tabs">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <span className="tab-icon">{tab.icon}</span>
                      <span className="tab-label">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings Content */}
              <div className="settings-content">
                {/* Profile Settings */}
                {activeTab === 'profile' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaUser /> Profile Information
                    </h3>
                    <p className="section-description">Update your personal information and profile picture</p>

                    <form onSubmit={handleSaveProfile} className="settings-form">
                      {/* Profile Picture */}
                      <div className="profile-picture-section">
                        <div className="current-picture">
                          <img src={profileData.profilePicture} alt="Profile" />
                          <button type="button" className="change-picture-btn">
                            <FaCamera /> Change Photo
                          </button>
                        </div>
                        <div className="picture-info">
                          <p className="picture-text">Upload a new profile picture</p>
                          <p className="picture-hint">JPG, PNG or GIF. Max size 2MB</p>
                        </div>
                      </div>

                      {/* Form Fields */}
                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">Full Name</label>
                          <input
                            type="text"
                            name="fullName"
                            value={profileData.fullName}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <label className="form-label">
                            <FaEnvelope /> Email Address
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label className="form-label">
                            <FaPhone /> Phone Number
                          </label>
                          <input
                            type="tel"
                            name="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea
                          name="bio"
                          value={profileData.bio}
                          onChange={handleProfileChange}
                          className="form-textarea"
                          rows="4"
                        />
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-save">
                          <FaSave /> Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Password Settings */}
                {activeTab === 'password' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaLock /> Change Password
                    </h3>
                    <p className="section-description">Update your password to keep your account secure</p>

                    <form onSubmit={handleChangePassword} className="settings-form">
                      <div className="form-group">
                        <label className="form-label">Current Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            className="form-input"
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          >
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">New Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            className="form-input"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        <p className="field-hint">Must be at least 8 characters with letters and numbers</p>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Confirm New Password</label>
                        <div className="password-input-wrapper">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            className="form-input"
                            placeholder="Confirm new password"
                          />
                          <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                      </div>

                      <div className="form-actions">
                        <button type="submit" className="btn-save">
                          <FaKey /> Change Password
                        </button>
                      </div>
                    </form>

                    <div className="password-tips">
                      <h4>Password Tips:</h4>
                      <ul>
                        <li>Use at least 8 characters</li>
                        <li>Include uppercase and lowercase letters</li>
                        <li>Add numbers and special characters</li>
                        <li>Avoid common words or phrases</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Notification Settings */}
                {activeTab === 'notifications' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaBell /> Notification Preferences
                    </h3>
                    <p className="section-description">Manage how you receive notifications</p>

                    <div className="settings-form">
                      <div className="notification-group">
                        <h4 className="group-title">Email Notifications</h4>
                        
                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Email Notifications</label>
                            <p className="toggle-description">Receive notifications via email</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={() => handleNotificationToggle('emailNotifications')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Course Updates</label>
                            <p className="toggle-description">Get notified about new course content</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.courseUpdates}
                              onChange={() => handleNotificationToggle('courseUpdates')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">New Messages</label>
                            <p className="toggle-description">Alert me when I receive new messages</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.newMessages}
                              onChange={() => handleNotificationToggle('newMessages')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Assignment Reminders</label>
                            <p className="toggle-description">Remind me about upcoming assignments</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.assignmentReminders}
                              onChange={() => handleNotificationToggle('assignmentReminders')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>

                      <div className="notification-group">
                        <h4 className="group-title">Other Notifications</h4>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Marketing Emails</label>
                            <p className="toggle-description">Receive promotional content and offers</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.marketingEmails}
                              onChange={() => handleNotificationToggle('marketingEmails')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Weekly Digest</label>
                            <p className="toggle-description">Get a weekly summary of your activity</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.weeklyDigest}
                              onChange={() => handleNotificationToggle('weeklyDigest')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Push Notifications</label>
                            <p className="toggle-description">Receive push notifications on your device</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.pushNotifications}
                              onChange={() => handleNotificationToggle('pushNotifications')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">SMS Notifications</label>
                            <p className="toggle-description">Receive notifications via text message</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={notifications.smsNotifications}
                              onChange={() => handleNotificationToggle('smsNotifications')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Appearance Settings */}
                {activeTab === 'appearance' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaPalette /> Appearance
                    </h3>
                    <p className="section-description">Customize the look and feel of your interface</p>

                    <div className="settings-form">
                      <div className="form-group">
                        <label className="form-label">Theme</label>
                        <div className="theme-options">
                          <div
                            className={`theme-option ${appearance.theme === 'light' ? 'active' : ''}`}
                            onClick={() => handleAppearanceChange('theme', 'light')}
                          >
                            <FaSun className="theme-icon" />
                            <span>Light</span>
                            {appearance.theme === 'light' && <FaCheck className="check-icon" />}
                          </div>
                          <div
                            className={`theme-option ${appearance.theme === 'dark' ? 'active' : ''}`}
                            onClick={() => handleAppearanceChange('theme', 'dark')}
                          >
                            <FaMoon className="theme-icon" />
                            <span>Dark</span>
                            {appearance.theme === 'dark' && <FaCheck className="check-icon" />}
                          </div>
                          <div
                            className={`theme-option ${appearance.theme === 'auto' ? 'active' : ''}`}
                            onClick={() => handleAppearanceChange('theme', 'auto')}
                          >
                            <FaPalette className="theme-icon" />
                            <span>Auto</span>
                            {appearance.theme === 'auto' && <FaCheck className="check-icon" />}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">
                          <FaGlobe /> Language
                        </label>
                        <select
                          value={appearance.language}
                          onChange={(e) => handleAppearanceChange('language', e.target.value)}
                          className="form-select"
                        >
                          <option value="en">English</option>
                          <option value="fr">Français</option>
                          <option value="ar">العربية</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Font Size</label>
                        <div className="font-size-options">
                          {['small', 'medium', 'large'].map(size => (
                            <button
                              key={size}
                              type="button"
                              className={`size-option ${appearance.fontSize === size ? 'active' : ''}`}
                              onClick={() => handleAppearanceChange('fontSize', size)}
                            >
                              {size.charAt(0).toUpperCase() + size.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="form-group">
                        <label className="form-label">Color Scheme</label>
                        <div className="color-schemes">
                          {['default', 'blue', 'green', 'purple', 'orange'].map(scheme => (
                            <div
                              key={scheme}
                              className={`color-scheme ${appearance.colorScheme === scheme ? 'active' : ''}`}
                              onClick={() => handleAppearanceChange('colorScheme', scheme)}
                            >
                              <div className={`color-preview ${scheme}`}></div>
                              <span>{scheme.charAt(0).toUpperCase() + scheme.slice(1)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Privacy Settings */}
                {activeTab === 'privacy' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaShieldAlt /> Privacy Settings
                    </h3>
                    <p className="section-description">Control who can see your information</p>

                    <div className="settings-form">
                      <div className="form-group">
                        <label className="form-label">Profile Visibility</label>
                        <select
                          value={privacy.profileVisibility}
                          onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                          className="form-select"
                        >
                          <option value="public">Public - Anyone can see my profile</option>
                          <option value="students">Students Only - Only enrolled students</option>
                          <option value="private">Private - Only me</option>
                        </select>
                      </div>

                      <div className="notification-group">
                        <h4 className="group-title">Contact Information</h4>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Show Email Address</label>
                            <p className="toggle-description">Allow others to see your email</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={privacy.showEmail}
                              onChange={() => handlePrivacyChange('showEmail', !privacy.showEmail)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Show Phone Number</label>
                            <p className="toggle-description">Allow others to see your phone number</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={privacy.showPhone}
                              onChange={() => handlePrivacyChange('showPhone', !privacy.showPhone)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>

                      <div className="notification-group">
                        <h4 className="group-title">Activity & Status</h4>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Allow Messages</label>
                            <p className="toggle-description">Let others send you messages</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={privacy.allowMessages}
                              onChange={() => handlePrivacyChange('allowMessages', !privacy.allowMessages)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Show Online Status</label>
                            <p className="toggle-description">Display when you're online</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={privacy.showOnlineStatus}
                              onChange={() => handlePrivacyChange('showOnlineStatus', !privacy.showOnlineStatus)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>

                        <div className="toggle-item">
                          <div className="toggle-info">
                            <label className="toggle-label">Data Collection</label>
                            <p className="toggle-description">Allow collection of usage data for improvement</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={privacy.dataCollection}
                              onChange={() => handlePrivacyChange('dataCollection', !privacy.dataCollection)}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="settings-section">
                    <h3 className="section-title">
                      <FaKey /> Security
                    </h3>
                    <p className="section-description">Manage your account security settings</p>

                    <div className="settings-form">
                      <div className="security-card">
                        <div className="security-card-header">
                          <div>
                            <h4>Two-Factor Authentication</h4>
                            <p>Add an extra layer of security to your account</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={security.twoFactorAuth}
                              onChange={() => handleSecurityToggle('twoFactorAuth')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                        {security.twoFactorAuth && (
                          <div className="security-card-body">
                            <p className="security-info">Two-factor authentication is enabled. You'll need to enter a code from your authenticator app when you sign in.</p>
                            <button className="btn-secondary">Manage 2FA</button>
                          </div>
                        )}
                      </div>

                      <div className="security-card">
                        <div className="security-card-header">
                          <div>
                            <h4>Login Alerts</h4>
                            <p>Get notified of new login attempts</p>
                          </div>
                          <label className="toggle-switch">
                            <input
                              type="checkbox"
                              checked={security.loginAlerts}
                              onChange={() => handleSecurityToggle('loginAlerts')}
                            />
                            <span className="toggle-slider"></span>
                          </label>
                        </div>
                      </div>

                      <div className="security-card">
                        <div className="security-card-header">
                          <div>
                            <h4>Session Timeout</h4>
                            <p>Automatically log out after period of inactivity</p>
                          </div>
                        </div>
                        <div className="security-card-body">
                          <select
                            value={security.sessionTimeout}
                            onChange={(e) => setSecurity(prev => ({ ...prev, sessionTimeout: e.target.value }))}
                            className="form-select"
                          >
                            <option value="15">15 minutes</option>
                            <option value="30">30 minutes</option>
                            <option value="60">1 hour</option>
                            <option value="never">Never</option>
                          </select>
                        </div>
                      </div>

                      <div className="security-card">
                        <div className="security-card-header">
                          <div>
                            <h4>Active Sessions</h4>
                            <p>Manage devices where you're currently logged in</p>
                          </div>
                        </div>
                        <div className="security-card-body">
                          <div className="active-sessions">
                            <div className="session-item">
                              <div className="session-info">
                                <strong>Chrome on Windows</strong>
                                <p>Last active: 2 minutes ago</p>
                                <p>IP: 192.168.1.1</p>
                              </div>
                              <span className="session-badge current">Current</span>
                            </div>
                            <div className="session-item">
                              <div className="session-info">
                                <strong>Safari on iPhone</strong>
                                <p>Last active: 2 hours ago</p>
                                <p>IP: 192.168.1.5</p>
                              </div>
                              <button className="btn-danger-small">
                                <FaSignOutAlt /> Sign Out
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="danger-zone">
                        <h4 className="danger-title">Danger Zone</h4>
                        <div className="danger-actions">
                          <div className="danger-action">
                            <div>
                              <strong>Download Your Data</strong>
                              <p>Export all your account data</p>
                            </div>
                            <button className="btn-secondary">
                              <FaDownload /> Download
                            </button>
                          </div>
                          <div className="danger-action">
                            <div>
                              <strong>Delete Account</strong>
                              <p>Permanently delete your account and all data</p>
                            </div>
                            <button className="btn-danger">
                              <FaTrash /> Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;