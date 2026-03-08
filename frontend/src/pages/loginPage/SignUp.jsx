import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import signupImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('apprenant'); // 'apprenant' or 'formateur'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    weak_subjects : '', 
  });
  const [agreeTOS, setAgreeTOS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to FormatterSignUp if formateur is selected


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

    // Redirect based on user type
    if (userType === 'formateur') {
      navigate('/formateur/signup');
    } else {
      // Redirect student to apprenant dashboard
      navigate('/apprenant/dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <AuthSidebar image={signupImage} />

        <div className="auth-right">
          <div className="auth-header">
            <img src={logo_rem} alt="ForsaLearn" className="auth-logo" />
            <Link to="/" className="back-link">{t('backToHome')}</Link>
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
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>{t('student') || 'Student'}</span>
              </label>
              <label className={`role-option ${userType === 'formateur' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="userType"
                  value="formateur"
                  checked={userType === 'formateur'}
                  onChange={(e) => setUserType(e.target.value)}
                />
                <span>{t('instructor') || 'Instructor'}</span>
              </label>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
               <div className="form-group">
                <label htmlFor="weak_subjects *">{t('weak subjects *')}</label>
                <input
                  type="tel"
                  id="weak_subjects"
                  name="weak_subjects"
                  value={formData.weak_subjects}
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
                  <span>{t('agreeTerms') || 'I agree with'} <a href="#">{t('termsOfService') || 'Terms of Service'}</a> {t('and')} <a href="#">{t('privacyPolicy') || 'Privacy Policy'}</a></span>
                </label>
              </div>

        <button type="submit" className="btn-signup">
  {t("signUp")}
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
