import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const SetPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const otpToken = location.state?.otpToken || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    navigate('/welcome-back');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <AuthSidebar image={loginImage} />

        <div className="auth-right">
          <div className="auth-header">
            <img src={logo_rem} alt="ForsaLearn" className="auth-logo" />
            <Link to="/" className="back-link">{t('backToHome')}</Link>
          </div>

          <div className="auth-form-container">
            <h2 style={{ textAlign: 'center' }}>{t('setPasswordTitle')}</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              {t('setPasswordSubtitle')}
            </p>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="password">{t('password')}</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-signin" disabled={loading}>
                {loading ? 'Resetting...' : t('resetPassword')}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                <Link to="/signin" style={{ color: '#FF6B6B' }}>{t('backToSignIn')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
