import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import signupImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';
import { registerApprenant, uploadProfilePicture } from '../../services/apprenentService';
import { setAuthSession } from '../../utils/authStorage';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('apprenant'); // 'apprenant' or 'formateur'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    weak_subjects: '',
    interests: '',
  });
  const [agreeTOS, setAgreeTOS] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUserTypeChange = (e) => {
    const value = e.target.value;
    setUserType(value);
    if (value === 'formateur') {
      navigate('/formateur/signup');
    }
  };
  // Redirect to FormatterSignUp if formateur is selected
  useEffect(() => {
    if (userType === 'formateur') {
      navigate('/formateur/signup');
    }
  }, [userType, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTOS) {
      setError('Please agree to Terms of Service and Privacy Policy');
      return;
    }

    if (userType === 'formateur') {
      navigate('/formateur/signup');
      return;
    }

    try {
      setLoading(true);
      const response = await registerApprenant({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        skillsNeeded: formData.weak_subjects
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean),
        interests: formData.interests
          .split(',')
          .map((item) => item.trim())
          .filter(Boolean)
      });
      const data = response.data;

      setAuthSession({ token: data.token, user: data.user });

      if (profilePicture) {
        try {
          await uploadProfilePicture(profilePicture);
        } catch (uploadErr) {
          console.error("Profile picture upload failed", uploadErr);
        }
      }

      navigate('/apprenant/dashboard');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <AuthSidebar image={signupImage} />

        <div className="auth-right">
          <div className="auth-header">
            <img src={logo_rem} alt="ForsaLearn" className="auth-logo" />
            <Link to="/" className="back-link"><span className="back-link-icon">←</span></Link>
          </div>

          <div className="auth-form-container">
            <h2>{t('signUpTitle') || 'Sign Up'}</h2>

            {/* Role Selector */}
            <div className="role-selector">
              <label className={`role-option ${userType === 'apprenant' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="apprenant"
                  checked={userType === 'apprenant'}
                  onChange={handleUserTypeChange}
                />
                <span>{t('student') || 'Student'}</span>
              </label>
              <label className={`role-option ${userType === 'formateur' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="formateur"
                  checked={userType === 'formateur'}
                  onChange={handleUserTypeChange}
                />
                <span>{t('instructor') || 'Instructor'}</span>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="profilePicture">{t('apprenant.profilePhoto') || 'Profile Photo (Optional)'}</label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fullName">{t('fullName')}</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">{t('phone')}</label>
                <input
                  type="tel"
                  id="phone"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="weak_subjects">{t('weak_subjects') || 'Weak subjects'}</label>
                <input
                  type="text"
                  id="weak_subjects"
                  name="weak_subjects"
                  value={formData.weak_subjects}
                  onChange={handleChange}
                  required
                />
              </div>
 <div className="form-group">
                <label htmlFor="profilePicture">{t('apprenant.profilePhoto') || 'Profile Photo (Optional)'}</label>
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={(e) => setProfilePicture(e.target.files[0])}
                  style={{ padding: '0.4rem', border: '1px solid var(--border)', borderRadius: '4px' }}
                />
              </div>
              <div className="form-group">
                <label htmlFor="interests">{t('interests') || 'Interests'}</label>
                <input
                  type="text"
                  id="interests"
                  name="interests"
                  value={formData.interests}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-terms">
                <label className="terms-checkbox">
                  <input
                    type="checkbox"
                    checked={agreeTOS}
                    onChange={(e) => setAgreeTOS(e.target.checked)}
                  />
                  <span>{t('agreeTerms') || 'I agree with'} <button type="button" className="link-button">{t('termsOfService') || 'Terms of Service'}</button> {t('and')} <button type="button" className="link-button">{t('privacyPolicy') || 'Privacy Policy'}</button></span>
                </label>
              </div>

              <button type="submit" className="btn-signup" disabled={loading}>
                {loading ? 'Registering...' : t("signUp")}
              </button>

            </form>
            <div className="auth-footer">
              <p>
                {t('haveAccount', 'Already have an account?')}{' '}
                <Link to="/signin">{t('signIn')}</Link>
              </p>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
