import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';
import { requestPasswordReset, verifyPasswordResetOtp } from '../../services/authService';

const OTPVerification = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
      return;
    }

    if (timer > 0 && !canResend) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend, email, navigate]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (value.match(/^[0-9]?$/)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError(t('enterValidOTP'));
      return;
    }

    setLoading(true);

    try {
      await verifyPasswordResetOtp({ email, otp: otpCode });
      setSuccess('OTP verified successfully');
      navigate('/set-password', { state: { email, otp: otpCode } });
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const validationMessage = err.response?.data?.errors?.[0]?.msg;
      setError(backendMessage || validationMessage || t('errorOccurred'));
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await requestPasswordReset({ email, language: i18n.language });
      setOtp(['', '', '', '', '', '']);
      setTimer(60);
      setCanResend(false);
      setSuccess('A new OTP has been sent to your email');
      inputRefs.current[0]?.focus();
    } catch (err) {
      const backendMessage = err.response?.data?.message;
      const validationMessage = err.response?.data?.errors?.[0]?.msg;
      setError(backendMessage || validationMessage || t('errorOccurred'));
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
            <Link to="/" className="back-link">{t('backToHome')}</Link>
          </div>

          <div className="auth-form-container">
            <h2 style={{ textAlign: 'center' }}>{t('emailOTP')}</h2>
            <p style={{ textAlign: 'center', color: '#666', marginBottom: '30px' }}>
              {t('otpSent')} <strong>{email}</strong>
            </p>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="otp-input-container">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    className="otp-input"
                    ref={(ref) => (inputRefs.current[index] = ref)}
                    type="text"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>

              <button type="submit" className="btn-signin" disabled={loading}>
                {loading ? 'Verifying...' : t('verifyProceed')}
              </button>
            </form>

            <div className="auth-footer" style={{ textAlign: 'center', marginTop: '30px' }}>
              <p>
                {canResend ? (
                  <button
                    className="resend-otp-btn"
                    onClick={handleResendOTP}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : t('resendOTP')}
                  </button>
                ) : (
                  <span className="otp-timer">{t('resendOTPIn')} <strong>{timer}s</strong></span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
