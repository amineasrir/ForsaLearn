import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';
import { loginUser } from '../../services/authService';
import { adminLogin } from '../../services/adminService';
import { setAuthSession } from '../../utils/authStorage';

const SignIn = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password');
      setLoading(false);
      return;
    }

    try {
      const payload = { email, password };
      let response;
      let loginError;

      try {
        response = await loginUser(payload);
      } catch (err) {
        loginError = err;
      }

      if (!response) {
        try {
          response = await adminLogin(payload);
        } catch (adminErr) {
          throw loginError || adminErr; // throw the original error if both fail
        }
      }

      const { token, user } = response.data;
      setAuthSession({ token, user });

      if (user.role === 'admin') {
        navigate('/admin/dashboard');
        return;
      }

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
      setError(backendMessage || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <AuthSidebar image={loginImage} />

        <div className="auth-right">
          <div className="auth-header">
            <img src={logo_rem} alt="ForsaLearn" className="auth-logo" />
            <Link to="/" className="back-link"><span className="back-link-icon">←</span></Link>
          </div>

          <div className="auth-form-container">
            <h2 style={{ textAlign: 'center' }}>{t('signInTitle') || 'Sign into Your Account'}</h2>

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

              <div className="form-options" style={{ marginTop: "10px", marginLeft: "3px" }}>
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

              <button type="submit" className="btn-signin" disabled={loading}>
                {loading ? 'Loading...' : (t('login') || 'Login')}
              </button>
            </form>

            <div className="auth-footer">
              <p>
                {t('noAccount') || "Don't you have an account?"} <Link to="/signup">{t('signUp') || 'Sign up'}</Link>
                <br />

              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
