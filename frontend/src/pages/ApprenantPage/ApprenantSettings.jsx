import React, { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser, FaLock, FaShareAlt, FaLink, FaBell, FaMapMarkerAlt, FaTrash, FaUpload, FaSave, FaCheck } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { getApprenantProfile, updateApprenantProfile } from '../../services/apprenentService';
import './dashboard.css';

// Dynamic tab configuration
const TAB_CONFIG = {
  profile: {
    id: 'profile',
    label: 'Edit Profile',
    icon: <FaUser />,
    title: 'Personal Details',
    subtitle: 'Edit your personal information',
    hasPhoto: true,
    hasDelete: true
  },
  security: {
    id: 'security',
    label: 'Security',
    icon: <FaLock />,
    title: 'Change Password',
    subtitle: 'Update your password to keep your account secure'
  },
  social: {
    id: 'social',
    label: 'Social Profiles',
    icon: <FaShareAlt />,
    title: 'Social Profiles',
    subtitle: 'Connect your social media accounts',
    comingSoon: true
  },
  linked: {
    id: 'linked',
    label: 'Linked Accounts',
    icon: <FaLink />,
    title: 'Linked Accounts',
    subtitle: 'Manage your connected accounts',
    comingSoon: true
  },
  notifs: {
    id: 'notifs',
    label: 'Notifications',
    icon: <FaBell />,
    title: 'Notifications',
    subtitle: 'Choose what notifications you want to receive'
  },
  billing: {
    id: 'billing',
    label: 'Billing Address',
    icon: <FaMapMarkerAlt />,
    title: 'Billing Address',
    subtitle: 'Update your billing information',
    comingSoon: true
  }
};

// Dynamic form field configuration
const FORM_CONFIG = {
  profile: [
    { name: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'First Name', grid: 'half' },
    { name: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Last Name', grid: 'half' },
    { name: 'userName', label: 'User Name', type: 'text', required: true, placeholder: 'Username', grid: 'half' },
    { name: 'phoneNumber', label: 'Phone Number', type: 'tel', required: true, placeholder: 'Phone', grid: 'half' },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      required: true,
      options: [
        { value: '', label: 'Select' },
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' }
      ],
      grid: 'half'
    },
    { name: 'dob', label: 'Date of Birth', type: 'date', required: true, grid: 'half' },
    { name: 'bio', label: 'Bio', type: 'textarea', required: true, placeholder: 'Tell us about yourself...', rows: 4, grid: 'full' }
  ],
  security: [
    { name: 'current', label: 'Current Password', type: 'password', required: true, placeholder: 'Current password', grid: 'full' },
    { name: 'newPass', label: 'New Password', type: 'password', required: true, placeholder: 'New password', grid: 'half' },
    { name: 'confirm', label: 'Confirm Password', type: 'password', required: true, placeholder: 'Confirm password', grid: 'half' }
  ],
  notifs: [
    { name: 'email', label: 'Email Notifications', type: 'checkbox', description: 'Receive notifications via email' },
    { name: 'sms', label: 'SMS Notifications', type: 'checkbox', description: 'Receive notifications via SMS' },
    { name: 'push', label: 'Push Notifications', type: 'checkbox', description: 'Receive push notifications' }
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
        newErrors[field.name] = `${field.label} is required`;
      }

      // Special validations
      if (field.name === 'confirm' && data.newPass !== data.confirm) {
        newErrors.confirm = 'Passwords do not match';
      }

      if (field.name === 'newPass' && data.newPass && data.newPass.length < 6) {
        newErrors.newPass = 'Password must be at least 6 characters';
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
      setErrors({ general: error.response?.data?.message || 'Failed to save. Please try again.' });
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
          {field.label}
          {field.required && <span className="req">*</span>}
        </label>

        {field.type === 'textarea' ? (
          <textarea
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
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
                {option.label}
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
            <span>{field.description}</span>
          </label>
        ) : (
          <input
            type={field.type || 'text'}
            name={field.name}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
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
        <div className="sett-loading">Loading settings...</div>
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
              <span>{tab.label}</span>
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
              <FaCheck /> Settings saved successfully!
            </div>
          )}

          {/* Dynamic content based on tab */}
          {currentTabConfig.comingSoon ? (
            <div className="sett-coming-soon">
              <h3>{currentTabConfig.title}</h3>
              <p>This feature is coming soon.</p>
            </div>
          ) : (
            <>
              {/* Photo section for profile tab */}
              {currentTabConfig.hasPhoto && (
                <div className="sett-photo-row">
                  <img
                    src={user?.profileImage || require('../../assets/image/student/ava.jpg')}
                    alt="Profile"
                    className="sett-avatar"
                  />
                  <div>
                    <p className="sett-photo-title">Profile Photo</p>
                    <p className="sett-photo-hint">PNG or JPG no bigger than 800px width and height</p>
                    <div className="sett-photo-btns">
                      <button className="sett-btn-upload">
                        <FaUpload /> Upload
                      </button>
                      <button className="sett-btn-del-photo">Delete</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic section title */}
              <h3 className="sett-section-title">
                {currentTabConfig.title}
                {currentTabConfig.subtitle && (
                  <span className="sett-section-sub">{currentTabConfig.subtitle}</span>
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
                  <>Saving...</>
                ) : saved ? (
                  <><FaCheck /> Saved!</>
                ) : (
                  <><FaSave /> {activeTab === 'security' ? 'Update Password' : 'Save Changes'}</>
                )}
              </button>

              {/* Delete account section for profile tab */}
              {currentTabConfig.hasDelete && (
                <div className="sett-danger-zone">
                  <h3>Delete Account</h3>
                  <p className="sett-danger-title">Are you sure you want to delete your account?</p>
                  <p className="sett-danger-desc">This action permanently removes your account and all associated data.</p>
                  <button className="sett-btn-danger">
                    <FaTrash /> Delete Account
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