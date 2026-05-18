import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import '../../styles/auth.css';
import { loginUser } from '../../services/authService';
import { setAuthSession } from '../../utils/authStorage';

const WelcomeBack = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      navigate('/signin', { replace: true });
    }
  }, [email, navigate]);

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

    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const { token, user } = response.data;

      setAuthSession({ token, user });

      if (user.role === 'formateur') {
        if (user.isApproved) {
          navigate('/formateur/dashboard');
        } else {
          navigate('/formateur/waiting-approval', { state: { email: user.email } });
        }
        return;
      }

      navigate('/apprenant/dashboard');
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const validationMessage = err.response?.data?.errors?.[0]?.msg;
      setError(backendMessage || validationMessage || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
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

          <button type="submit" className="welcome-back-btn" disabled={loading}>
            {loading ? 'Signing in...' : t('signInButton')}
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
