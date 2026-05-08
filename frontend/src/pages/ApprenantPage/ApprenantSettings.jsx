import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import '../../styles/formateur.css';

const ApprenantSettings = () => {
  const { t } = useTranslation();
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
    alert(t('apprenant.settingsSaved'));
  };

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.settings')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.settings') }]}
      rightContent={rightContent}
    >
      <CardP  />

          <div className="settings-page">
            <div className="settings-container">
              <div className="settings-tabs">
                <button
                  className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  {t('apprenant.accountInformation')}
                </button>
                <button
                  className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                  onClick={() => setActiveTab('security')}
                >
                  {t('apprenant.changePassword')}
                </button>
                <button
                  className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                  onClick={() => setActiveTab('notifications')}
                >
                  {t('apprenant.notifications')}
                </button>
              </div>
              <div className="settings-panel">
                {activeTab === 'account' && (
                  <div>
                    <h2>{t('apprenant.accountInformation')}</h2>
                    <div className="form-group">
                      <label>{t('email')}</label>
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
                    <h2>{t('apprenant.changePassword')}</h2>
                    <div className="form-group">
                      <label>{t('apprenant.currentPassword')}</label>
                      <input
                        type="password"
                        name="current"
                        value={passwords.current}
                        onChange={handlePassChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('apprenant.newPassword')}</label>
                      <input
                        type="password"
                        name="new"
                        value={passwords.new}
                        onChange={handlePassChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>{t('apprenant.confirmPassword')}</label>
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
                    <h2>{t('apprenant.notifications')}</h2>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="email"
                          checked={notifications.email}
                          onChange={handleNotifToggle}
                        /> {t('apprenant.emailNotifications')}
                      </label>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          name="sms"
                          checked={notifications.sms}
                          onChange={handleNotifToggle}
                        /> {t('apprenant.smsNotifications')}
                      </label>
                    </div>
                  </div>
                )}
                <button className="btn-save-settings" onClick={saveSettings}>
                  {t('apprenant.saveChanges')}
                </button>
              </div>
            </div>
          </div>
      </ApprenantLayout>
  );
};

export default ApprenantSettings;
