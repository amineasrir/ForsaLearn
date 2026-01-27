import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import loginImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const OTPVerification = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

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

    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setError('Please enter a valid OTP');
      return;
    }

    navigate('/set-password', { state: { email, otpToken: 'temp-token' } });
  };

  const handleResendOTP = async () => {
    setError('');
    setTimer(60);
    setCanResend(false);
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

              <button type="submit" className="btn-signin" disabled={false}>
                {t('verifyProceed')}
              </button>
            </form>

            <div className="auth-footer" style={{ textAlign: 'center', marginTop: '30px' }}>
              <p>
                {canResend ? (
                  <button
                    className="resend-otp-btn"
                    onClick={handleResendOTP}
                  >
                    {t('resendOTP')}
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
