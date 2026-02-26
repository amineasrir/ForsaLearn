import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('apprenant'); // 'apprenant' or 'formateur'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    // Redirect based on user type
    if (userType === 'formateur') {
      navigate('/formateur');
    } else {
      // After successful apprenant login, go to the Apprenant dashboard/page
      navigate('/apprenant');
    }
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
            <h2 style={{ textAlign: 'center' }}>{t('signInTitle') || 'Sign into Your Account'}</h2>

            {/* User Type Selection */}
            <div className="user-type-selector">
              <button
                type="button"
                className={`user-type-btn ${userType === 'apprenant' ? 'active' : ''}`}
                onClick={() => setUserType('apprenant')}
              >
                👨‍🎓 Apprenant
              </button>
              <button
                type="button"
                className={`user-type-btn ${userType === 'formateur' ? 'active' : ''}`}
                onClick={() => setUserType('formateur')}
              >
                👨‍🏫 Formateur
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}

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

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  {t('rememberMe') || 'Remember Me'}
                </label>
                <Link to="/forgot-password" className="forgot-password">{t('forgotPassword') || 'Forgot Password?'}</Link>
              </div>

              <button type="submit" className="btn-signin" disabled={false}>
                {(t('login') || 'Login')}
              </button>
            </form>

            <div className="auth-footer">
              <p>{t('noAccount') || "Don't you have an account?"} <Link to="/signup">{t('signUp') || 'Sign up'}</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
