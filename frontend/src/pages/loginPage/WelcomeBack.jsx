import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import '../../styles/auth.css';

const WelcomeBack = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!password) {
      setError(t('passwordRequired'));
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'));
      return;
    }

    navigate('/');
  };

  return (
    <div className="welcome-back-container">
      <div className="welcome-back-card">
        <div className="welcome-back-logo" style={{ display: 'flex', justifyContent: 'center' ,alignItems: 'center'}}>
          <img src={logo_rem} alt="ForsaLearn" style={{ height: 150}} />
        </div>

        <h1 className="welcome-back-title">{t('welcomeBack')}</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="welcome-back-form-group">
            <label htmlFor="password">{t('password')} *</label>
            <div className="password-input-wrapper">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('enterPassword')}
                required
              />
            </div>
          </div>

          <button type="submit" className="welcome-back-btn">
            {t('signInButton')}
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '14px', color: '#666' ,textAlign: 'center'}}>
            <Link to="/signin" style={{
              color: '#FF6B6B',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer'
            }}>{t('useAnotherAccount')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBack;
