import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaUser, FaLock, FaShareAlt, FaLink, FaBell, FaMapMarkerAlt, FaTrash, FaUpload } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { getApprenantProfile, updateApprenantProfile } from '../../services/apprenentService';
import './dashboard.css';

const TABS = [
  { id: 'profile',   label: 'Edit Profile',      icon: <FaUser /> },
  { id: 'security',  label: 'Security',           icon: <FaLock /> },
  { id: 'social',    label: 'Social Profiles',    icon: <FaShareAlt /> },
  { id: 'linked',    label: 'Linked Accounts',    icon: <FaLink /> },
  { id: 'notifs',    label: 'Notifications',      icon: <FaBell /> },
  { id: 'billing',   label: 'Billing Address',    icon: <FaMapMarkerAlt /> },
];

const ApprenantSettings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    firstName: '', lastName: '', userName: '', phoneNumber: '',
    gender: '', dob: '', bio: '',
  });
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [notifications, setNotifications] = useState({ email: true, sms: false });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getApprenantProfile().then(res => {
      const u = res.data?.user;
      if (u) {
        setUser(u);
        const [first, ...rest] = (u.fullName || '').split(' ');
        setForm({
          firstName: first || '',
          lastName: rest.join(' ') || '',
          userName: u.username || 'studentdemo',
          phoneNumber: u.phoneNumber || '',
          gender: u.gender || '',
          dob: u.dob ? u.dob.split('T')[0] : '',
          bio: u.bio || '',
        });
      }
    }).catch(() => {});
  }, []);

  const handleForm = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handlePass = e => setPasswords(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleNotif = e => setNotifications(p => ({ ...p, [e.target.name]: e.target.checked }));

  const handleSave = async () => {
    try {
      await updateApprenantProfile({
        fullName: `${form.firstName} ${form.lastName}`.trim(),
        username: form.userName,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        dob: form.dob,
        bio: form.bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      alert('Failed to save. Please try again.');
    }
  };

  return (
    <ApprenantLayout
      title={t('apprenant.settings')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.settings') }]}
      rightContent={<><div className="notification-icon" /><div className="cart-icon" /></>}
    >
      <CardP user={user} />

      <div className="sett-page">
        {/* Horizontal tabs matching screenshot */}
        <div className="sett-tabs-bar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`sett-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="sett-body">

          {/* ---- Edit Profile ---- */}
          {activeTab === 'profile' && (
            <>
              {/* Photo */}
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
                    <button className="sett-btn-upload"><FaUpload /> Upload</button>
                    <button className="sett-btn-del-photo">Delete</button>
                  </div>
                </div>
              </div>

              {/* Personal Details */}
              <h3 className="sett-section-title">Personal Details
                <span className="sett-section-sub">Edit your personal information</span>
              </h3>

              <div className="sett-form-grid">
                <div className="sett-field">
                  <label>First Name <span className="req">*</span></label>
                  <input name="firstName" value={form.firstName} onChange={handleForm} placeholder="First Name" />
                </div>
                <div className="sett-field">
                  <label>Last Name <span className="req">*</span></label>
                  <input name="lastName" value={form.lastName} onChange={handleForm} placeholder="Last Name" />
                </div>
                <div className="sett-field">
                  <label>User Name <span className="req">*</span></label>
                  <input name="userName" value={form.userName} onChange={handleForm} placeholder="Username" />
                </div>
                <div className="sett-field">
                  <label>Phone Number <span className="req">*</span></label>
                  <input name="phoneNumber" value={form.phoneNumber} onChange={handleForm} placeholder="Phone" />
                </div>
                <div className="sett-field">
                  <label>Gender <span className="req">*</span></label>
                  <select name="gender" value={form.gender} onChange={handleForm}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="sett-field">
                  <label>DOB <span className="req">*</span></label>
                  <input type="date" name="dob" value={form.dob} onChange={handleForm} />
                </div>
                <div className="sett-field sett-field--full">
                  <label>Bio <span className="req">*</span></label>
                  <textarea name="bio" value={form.bio} onChange={handleForm} rows={4} placeholder="Tell us about yourself..." />
                </div>
              </div>

              <button className="sett-btn-save" onClick={handleSave}>
                {saved ? '✓ Saved!' : 'Update Profile'}
              </button>

              {/* Delete Account */}
              <div className="sett-danger-zone">
                <h3>Delete Account</h3>
                <p className="sett-danger-title">Are you sure you want to delete your account?</p>
                <p className="sett-danger-desc">Refers to the action of permanently removing a user's account and associated data from a system, service and platform.</p>
                <button className="sett-btn-danger"><FaTrash /> Delete Account</button>
              </div>
            </>
          )}

          {/* ---- Security ---- */}
          {activeTab === 'security' && (
            <>
              <h3 className="sett-section-title">Change Password</h3>
              <div className="sett-form-grid">
                <div className="sett-field sett-field--full">
                  <label>Current Password</label>
                  <input type="password" name="current" value={passwords.current} onChange={handlePass} placeholder="Current password" />
                </div>
                <div className="sett-field">
                  <label>New Password</label>
                  <input type="password" name="newPass" value={passwords.newPass} onChange={handlePass} placeholder="New password" />
                </div>
                <div className="sett-field">
                  <label>Confirm Password</label>
                  <input type="password" name="confirm" value={passwords.confirm} onChange={handlePass} placeholder="Confirm password" />
                </div>
              </div>
              <button className="sett-btn-save">Update Password</button>
            </>
          )}

          {/* ---- Notifications ---- */}
          {activeTab === 'notifs' && (
            <>
              <h3 className="sett-section-title">Notifications</h3>
              <div className="sett-notif-list">
                <label className="sett-notif-item">
                  <input type="checkbox" name="email" checked={notifications.email} onChange={handleNotif} />
                  <span>Email Notifications</span>
                </label>
                <label className="sett-notif-item">
                  <input type="checkbox" name="sms" checked={notifications.sms} onChange={handleNotif} />
                  <span>SMS Notifications</span>
                </label>
              </div>
              <button className="sett-btn-save" onClick={() => alert('Saved!')}>Save Preferences</button>
            </>
          )}

          {/* ---- Other tabs placeholder ---- */}
          {['social', 'linked', 'billing'].includes(activeTab) && (
            <div style={{ color: '#6b7280', padding: '2rem 0' }}>
              <p>This section is coming soon.</p>
            </div>
          )}

        </div>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantSettings;