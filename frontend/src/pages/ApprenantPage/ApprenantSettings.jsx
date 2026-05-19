import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser, FaLock, FaShareAlt, FaLink, FaBell, FaMapMarkerAlt, FaTrash, FaUpload, FaSave, FaCheck } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { getApprenantProfile, updateApprenantProfile } from '../../services/apprenentService';
import './apprenant.css';

// Dynamic tab configuration
const TAB_CONFIG = {
  profile: {
    id: 'profile',
    labelKey: 'apprenant.editProfile',
    icon: <FaUser />,
    titleKey: 'apprenant.personalDetails',
    subtitleKey: 'apprenant.editPersonalInformation',
    hasPhoto: true,
    hasDelete: true
  },
  security: {
    id: 'security',
    labelKey: 'apprenant.security',
    icon: <FaLock />,
    titleKey: 'apprenant.changePassword',
    subtitleKey: 'apprenant.updatePasswordSecure'
  },
  social: {
    id: 'social',
    labelKey: 'apprenant.socialProfiles',
    icon: <FaShareAlt />,
    titleKey: 'apprenant.socialProfiles',
    subtitleKey: 'apprenant.connectSocialAccounts',
    comingSoon: true
  },
  linked: {
    id: 'linked',
    labelKey: 'apprenant.linkedAccounts',
    icon: <FaLink />,
    titleKey: 'apprenant.linkedAccounts',
    subtitleKey: 'apprenant.manageConnectedAccounts',
    comingSoon: true
  },
  notifs: {
    id: 'notifs',
    labelKey: 'apprenant.notifications',
    icon: <FaBell />,
    titleKey: 'apprenant.notifications',
    subtitleKey: 'apprenant.chooseNotifications'
  },
  billing: {
    id: 'billing',
    labelKey: 'apprenant.billingAddress',
    icon: <FaMapMarkerAlt />,
    titleKey: 'apprenant.billingAddress',
    subtitleKey: 'apprenant.updateBillingInformation',
    comingSoon: true
  }
};

// Dynamic form field configuration
const FORM_CONFIG = {
  profile: [
    { name: 'firstName', labelKey: 'apprenant.firstName', type: 'text', required: true, placeholderKey: 'apprenant.firstName', grid: 'half' },
    { name: 'lastName', labelKey: 'apprenant.lastName', type: 'text', required: true, placeholderKey: 'apprenant.lastName', grid: 'half' },
    { name: 'userName', labelKey: 'apprenant.userName', type: 'text', required: true, placeholderKey: 'apprenant.userName', grid: 'half' },
    { name: 'phoneNumber', labelKey: 'apprenant.phoneNumber', type: 'tel', required: true, placeholderKey: 'apprenant.phone', grid: 'half' },
    {
      name: 'gender',
      labelKey: 'apprenant.gender',
      type: 'select',
      required: true,
      options: [
        { value: '', labelKey: 'apprenant.select' },
        { value: 'male', labelKey: 'apprenant.male' },
        { value: 'female', labelKey: 'apprenant.female' },
        { value: 'other', labelKey: 'apprenant.other' }
      ],
      grid: 'half'
    },
    { name: 'dob', labelKey: 'apprenant.dateOfBirth', type: 'date', required: true, grid: 'half' },
    { name: 'bio', labelKey: 'apprenant.bio', type: 'textarea', required: true, placeholderKey: 'apprenant.tellUsAboutYourself', rows: 4, grid: 'full' }
  ],
  security: [
    { name: 'current', labelKey: 'apprenant.currentPassword', type: 'password', required: true, placeholderKey: 'apprenant.currentPassword', grid: 'full' },
    { name: 'newPass', labelKey: 'apprenant.newPassword', type: 'password', required: true, placeholderKey: 'apprenant.newPassword', grid: 'half' },
    { name: 'confirm', labelKey: 'apprenant.confirmPassword', type: 'password', required: true, placeholderKey: 'apprenant.confirmPassword', grid: 'half' }
  ],
  notifs: [
    { name: 'email', labelKey: 'apprenant.emailNotifications', type: 'checkbox', descriptionKey: 'apprenant.receiveNotificationsViaEmail' },
    { name: 'sms', labelKey: 'apprenant.smsNotifications', type: 'checkbox', descriptionKey: 'apprenant.receiveNotificationsViaSMS' },
    { name: 'push', labelKey: 'apprenant.pushNotifications', type: 'checkbox', descriptionKey: 'apprenant.receivePushNotifications' }
  ]
};

const ApprenantSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errors, setErrors] = useState({});

  // Dynamic form state
  const [formData, setFormData] = useState({});

  // Initialize form data based on active tab
  const initializeFormData = useCallback((tabId, userData = null) => {
    const config = FORM_CONFIG[tabId];
    if (!config) return {};

    const initialData = {};

    if (tabId === 'profile' && userData) {
      const [first, ...rest] = (userData.fullName || '').split(' ');
      initialData.firstName = first || '';
      initialData.lastName = rest.join(' ') || '';
      initialData.userName = userData.username || 'studentdemo';
      initialData.phoneNumber = userData.phoneNumber || '';
      initialData.gender = userData.gender || '';
      initialData.dob = userData.dob ? userData.dob.split('T')[0] : '';
      initialData.bio = userData.bio || '';
    } else if (tabId === 'security') {
      initialData.current = '';
      initialData.newPass = '';
      initialData.confirm = '';
    } else if (tabId === 'notifs') {
      initialData.email = true;
      initialData.sms = false;
      initialData.push = true;
    }

    return initialData;
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const res = await getApprenantProfile();
        const userData = res.data?.user;
        if (userData) {
          setUser(userData);
          const initialData = initializeFormData(activeTab, userData);
          setFormData(initialData);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [activeTab, initializeFormData]);

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setErrors({});
    setSaved(false);
    // Form data will be reinitialized by useEffect
  };

  // Generic form field handler
  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: null
      }));
    }
  };

  // Validate form based on tab configuration
  const validateForm = (tabId, data) => {
    const config = FORM_CONFIG[tabId];
    if (!config) return {};

    const newErrors = {};

    config.forEach(field => {
      if (field.required && (!data[field.name] || data[field.name].toString().trim() === '')) {
        newErrors[field.name] = `${t(field.labelKey || field.label)} ${t('apprenant.isRequired')}`;
      }

      // Special validations
      if (field.name === 'confirm' && data.newPass !== data.confirm) {
        newErrors.confirm = t('apprenant.passwordsDoNotMatch');
      }

      if (field.name === 'newPass' && data.newPass && data.newPass.length < 6) {
        newErrors.newPass = t('apprenant.passwordMustBeAtLeast6');
      }
    });

    return newErrors;
  };

  // Save handler based on tab
  const handleSave = async () => {
    const validationErrors = validateForm(activeTab, formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);
      setErrors({});

      if (activeTab === 'profile') {
        await updateApprenantProfile({
          fullName: `${formData.firstName} ${formData.lastName}`.trim(),
          username: formData.userName,
          phoneNumber: formData.phoneNumber,
          gender: formData.gender,
          dob: formData.dob,
          bio: formData.bio,
        });
      } else if (activeTab === 'security') {
        // TODO: Implement password update API
        console.log('Password update requested:', {
          currentPassword: formData.current,
          newPassword: formData.newPass
        });
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Clear password fields after successful change
        setFormData(prev => ({
          ...prev,
          current: '',
          newPass: '',
          confirm: ''
        }));
      } else if (activeTab === 'notifs') {
        // TODO: Implement notifications update API
        console.log('Notifications update requested:', formData);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Save failed:', error);
      setErrors({ general: error.response?.data?.message || t('apprenant.failedToSave') });
    } finally {
      setSaving(false);
    }
  };

  // Dynamic field renderer
  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    const fieldClass = `sett-field ${field.grid === 'full' ? 'sett-field--full' : ''} ${error ? 'error' : ''}`;

    return (
      <div key={field.name} className={fieldClass}>
        <label>
          {t(field.labelKey || field.label)}
          {field.required && <span className="req">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : field.placeholder}
            rows={field.rows || 3}
          />
        ) : field.type === 'select' ? (
          <select
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
          >
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {t(option.labelKey || option.label)}
              </option>
            ))}
          </select>
        ) : field.type === 'checkbox' ? (
          <label className="sett-checkbox-label">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
            />
            <span>{field.descriptionKey ? t(field.descriptionKey) : field.description}</span>
          </label>
        ) : (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholderKey ? t(field.placeholderKey) : field.placeholder}
          />
        )}

        {error && <span className="field-error">{error}</span>}
      </div>
    );
  };

  const currentTabConfig = TAB_CONFIG[activeTab];
  const currentFormConfig = FORM_CONFIG[activeTab];

  if (loading) {
    return (
      <ApprenantLayout>
        <div className="sett-loading">{t('apprenant.loadingSettings')}</div>
      </ApprenantLayout>
    );
  }

  return (
    <ApprenantLayout>

      <div className="sett-page">
        {/* Dynamic tabs */}
        <div className="sett-tabs-bar">
          {Object.values(TAB_CONFIG).map(tab => (
            <button
              key={tab.id}
              className={`sett-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.icon}
              <span>{t(tab.labelKey || tab.label)}</span>
            </button>
          ))}
        </div>

        <div className="sett-body">

          {/* General error */}
          {errors.general && (
            <div className="sett-error-message">{errors.general}</div>
          )}

          {/* Success message */}
          {saved && (
            <div className="sett-success-message">
              <FaCheck /> {t('apprenant.settingsSavedSuccessfully')}
            </div>
          )}

          {/* Dynamic content based on tab */}
          {currentTabConfig.comingSoon ? (
            <div className="sett-coming-soon">
              <h3>{t(currentTabConfig.titleKey || currentTabConfig.title)}</h3>
              <p>{t('apprenant.featureComingSoon')}</p>
            </div>
          ) : (
            <>
              {/* Photo section for profile tab */}
              {currentTabConfig.hasPhoto && (
                <div className="sett-photo-row">
                  <img
                    src={user?.profileImage || require('../../assets/image/student/ava.jpg')}
                    alt={t('apprenant.profilePhoto')}
                    className="sett-avatar"
                  />
                  <div>
                    <p className="sett-photo-title">{t('apprenant.profilePhoto')}</p>
                    <p className="sett-photo-hint">{t('apprenant.profilePhotoHint')}</p>
                    <div className="sett-photo-btns">
                      <button className="sett-btn-upload">
                        <FaUpload /> {t('apprenant.upload')}
                      </button>
                      <button className="sett-btn-del-photo">{t('apprenant.delete')}</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic section title */}
              <h3 className="sett-section-title">
                {t(currentTabConfig.titleKey || currentTabConfig.title)}
                {currentTabConfig.subtitleKey && (
                  <span className="sett-section-sub">{t(currentTabConfig.subtitleKey)}</span>
                )}
              </h3>

              {/* Dynamic form fields */}
              {currentFormConfig && (
                <div className="sett-form-grid">
                  {currentFormConfig.map(renderField)}
                </div>
              )}

              {/* Save button */}
              <button
                className={`sett-btn-save ${saving ? 'loading' : ''}`}
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <>{t('apprenant.saving')}</>
                ) : saved ? (
                  <><FaCheck /> {t('apprenant.saved')}</>
                ) : (
                  <><FaSave /> {activeTab === 'security' ? t('apprenant.updatePassword') : t('apprenant.saveChanges')}</>
                )}
              </button>

              {/* Delete account section for profile tab */}
              {currentTabConfig.hasDelete && (
                <div className="sett-danger-zone">
                  <h3>{t('apprenant.deleteAccount')}</h3>
                  <p className="sett-danger-title">{t('apprenant.deleteAccountConfirmation')}</p>
                  <p className="sett-danger-desc">{t('apprenant.deleteAccountWarning')}</p>
                  <button className="sett-btn-danger">
                    <FaTrash /> {t('apprenant.deleteAccount')}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantSettings;