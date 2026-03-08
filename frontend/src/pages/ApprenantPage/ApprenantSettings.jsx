import React, { useState } from 'react';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import '../../styles/formateur.css';
import DashboardNavbar from '../../components/common/DashboardNavbar';

const ApprenantSettings = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [account, setAccount] = useState({ email: 'studentdemo@example.com' });
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false });

  const handleAccountChange = e => {
    const { name, value } = e.target;
    setAccount(prev => ({ ...prev, [name]: value }));
  };
  const handlePassChange = e => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleNotifToggle = e => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
  };

  const saveSettings = () => {
    alert('Settings saved (mock)');
  };

  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="Settings"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'Settings' }]}
        rightContent={rightContent}
      />
      <CardP />
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="settings-page">
            <div className="settings-container">
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  Account
                </button>
                <button
                  className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  Security
                </button>
                <button
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  Notifications
                </button>
              </div>
              <div className="settings-panel">
                {activeTab === 'account' && (
                  <div>
                    <h2>Account Information</h2>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        name="email"
                        value={account.email}
                        onChange={handleAccountChange}
                      />
                    </div>
                  </div>
                )}
                {activeTab === 'security' && (
                  <div>
                    <h2>Change Password</h2>
                    <div className="form-group">
                      <label>Current Password</label>
                      <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePassChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handlePassChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm Password</label>
                      <input
                        type="password"
                        name="confirm"
                        value={passwords.confirm}
                        onChange={handlePassChange}
                      />
                    </div>
                  </div>
                )}
                {activeTab === 'notifications' && (
                  <div>
                    <h2>Notifications</h2>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="email"
                          checked={notifications.email}
                          onChange={handleNotifToggle}
                        /> Email notifications
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="sms"
                          checked={notifications.sms}
                          onChange={handleNotifToggle}
                        /> SMS notifications
                      </label>
                    </div>
                  </div>
                )}
                <button className="btn-save-settings" onClick={saveSettings}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantSettings;
