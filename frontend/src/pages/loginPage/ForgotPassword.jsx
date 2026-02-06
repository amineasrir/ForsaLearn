import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setSuccess('OTP sent to your email. Check your inbox!');
    setTimeout(() => {
      navigate('/otp-verification', { state: { email } });
    }, 1000);
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
            <h2 style={{ textAlign: 'center' }}>{t('forgotPasswordTitle')}</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              {t('forgotPasswordSubtitle')}
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t('email')}</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn-signin" disabled={loading}>
                {loading ? 'Loading...' : t('submit')}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                <Link to="/signin" style={{ color: '#FF6B6B' }}>{t('rememberPassword')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
