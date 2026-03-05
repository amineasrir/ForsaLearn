import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import '../../styles/auth.css';

const WaitingApproval = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);
  const MAX_RETRIES = 5;

  useEffect(() => {
    // Get email from location state or localStorage
    const state = location.state;
    if (state && state.email) {
      setEmail(state.email);
    } else {
      const storedEmail = localStorage.getItem('formateur_pending_email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    }
  }, [location.state]);

  const checkApprovalStatus = async () => {
    if (!email) {
      setError('Email not found. Please register again.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/auth/check-approval', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (response.ok && data.isApproved) {
        // Account approved, redirect to login
        localStorage.removeItem('formateur_pending_email');
        navigate('/signin', {
          state: {
            message: 'Your account has been approved! You can now log in.',
            email: email
          }
        });
      } else if (response.status === 410 && data.isRejected) {
        // Account rejected, redirect to rejection page
        localStorage.removeItem('formateur_pending_email');
        navigate('/formateur/account-rejected', {
          state: {
            email: email,
            rejectionReason: data.rejectionReason
          }
        });
      } else {
        setRetryAttempts(prev => prev + 1);
        if (retryAttempts < MAX_RETRIES) {
          setError('Your account is still pending approval. Please check back later.');
        } else {
          setError('Too many check attempts. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error checking approval status:', err);
      setError('Unable to check approval status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('formateur_pending_email');
    localStorage.removeItem('token');
    navigate('/signin');
  };

  const handleContactSupport = () => {
    // This could open a contact form or redirect to support page
    window.open('mailto:support@forsalearn.com?subject=Account Approval Status', '_blank');
  };

  return (
    <div className="auth-container auth-page">
      <div className="auth-wrapper">
        <div className="waiting-approval-container">
          {/* Header with Logo */}
          <div className="waiting-header">
            <img src={logo_rem} alt="ForsaLearn" className="waiting-logo" />
            <h1>{t('waitingApproval.title') || 'Account Under Review'}</h1>
          </div>

          {/* Main Content */}
          <div className="waiting-content">
            {/* Status Icon */}
            <div className="status-icon pending">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="40" r="35" fill="#FFF3CD" stroke="#FFC107" strokeWidth="2" />
                <path
                  d="M40 15V45M40 60V65"
                  stroke="#FFC107"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="40" cy="65" r="2" fill="#FFC107" />
              </svg>
            </div>

            {/* Message Section */}
            <div className="waiting-message">
              <h2>{t('waitingApproval.thank') || 'Thank You for Registering!'}</h2>
              <p className="primary-message">
                {t('waitingApproval.description') ||
                  'Your instructor account application is under review by our admin team.'}
              </p>
              <p className="secondary-message">
                {t('waitingApproval.whatsNext') ||
                  'We will verify your qualifications and certifications. You\'ll receive an email notification once your account is approved.'}
              </p>

              {/* Email Display */}
              <div className="email-display">
                <label>{t('waitingApproval.registeredEmail') || 'Registered Email:'}</label>
                <p>{email || 'Loading...'}</p>
              </div>

              {/* Error Message */}
              {error && (
                <div className={`alert-message ${error.includes('rejected') ? 'error' : 'warning'}`}>
                  <p>{error}</p>
                </div>
              )}

              {/* Estimated Timeline */}
              <div className="timeline-info">
                <h3>{t('waitingApproval.timeline') || 'Review Timeline'}</h3>
                <ul className="timeline-list">
                  <li>
                    <span className="timeline-step">1</span>
                    <span className="timeline-text">Document Verification - 24-48 hours</span>
                  </li>
                  <li>
                    <span className="timeline-step">2</span>
                    <span className="timeline-text">Admin Review - 2-3 business days</span>
                  </li>
                  <li>
                    <span className="timeline-step">3</span>
                    <span className="timeline-text">Final Approval - 0-24 hours</span>
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
               

                <button
                  className="btn btn-secondary"
                  onClick={handleContactSupport}
                >
                  {t('waitingApproval.contact') || 'Contact Support'}
                </button>

                <button
                  className="btn btn-outline"
                  onClick={handleLogout}
                >
                  {t('waitingApproval.logout') || 'Logout'}
                </button>
              </div>

              {/* Additional Info */}
              <div className="info-box">
                <h4>{t('waitingApproval.tips') || 'Tips for Faster Approval'}</h4>
                <ul>
                  <li>✓ Ensure all your documents are clear and valid</li>
                  <li>✓ Complete your profile with accurate information</li>
                  <li>✓ Include a professional profile picture</li>
                  <li>✓ Provide detailed information about your expertise</li>
                </ul>
              </div>

              {/* Retry Attempts Counter */}
              {retryAttempts > 0 && retryAttempts < MAX_RETRIES && (
                <p className="retry-counter">
                  {t('waitingApproval.checkAttempts') || `Check attempts: ${retryAttempts}/${MAX_RETRIES}`}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          background: linear-gradient(135deg, #9ebaef 0%, #f5bde8 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .auth-wrapper {
          width: 100%;
          max-width: 600px;
        }

        .waiting-approval-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          overflow: hidden;
        }

        .waiting-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 20px;
          text-align: center;
        }

        .waiting-logo {
          height: 150px;
          margin-bottom: 2px;
        }

        .waiting-header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 600;
        }

        .waiting-content {
          padding: 40px 30px;
          text-align: center;
        }

        .status-icon {
          margin-bottom: 30px;
          display: flex;
          justify-content: center;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .waiting-message h2 {
          font-size: 24px;
          color: #333;
          margin: 0 0 10px 0;
          font-weight: 600;
        }

        .primary-message {
          font-size: 16px;
          color: #666;
          margin: 0 0 15px 0;
          line-height: 1.6;
        }

        .secondary-message {
          font-size: 14px;
          color: #999;
          margin: 0 0 30px 0;
          line-height: 1.6;
        }

        .email-display {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #667eea;
        }

        .email-display label {
          display: block;
          font-size: 12px;
          color: #999;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .email-display p {
          margin: 0;
          font-size: 16px;
          color: #333;
          font-weight: 500;
        }

        .alert-message {
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          line-height: 1.5;
        }

        .alert-message.error {
          background: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }

        .alert-message.warning {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeeba;
        }

        .alert-message p {
          margin: 0;
        }

        .timeline-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
          text-align: left;
        }

        .timeline-info h3 {
          margin: 0 0 15px 0;
          font-size: 14px;
          text-transform: uppercase;
          color: #667eea;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .timeline-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .timeline-list li {
          display: flex;
          align-items: center;
          margin-bottom: 12px;
          font-size: 14px;
          color: #666;
        }

        .timeline-list li:last-child {
          margin-bottom: 0;
        }

        .timeline-step {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 28px;
          height: 28px;
          background: #667eea;
          color: white;
          border-radius: 50%;
          font-size: 12px;
          font-weight: 600;
          margin-right: 12px;
          flex-shrink: 0;
        }

        .timeline-text {
          flex: 1;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 30px;
        }

        .btn {
          padding: 12px 24px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
        }

        .btn-secondary {
          background: #f8f9fa;
          color: #667eea;
          border: 2px solid #667eea;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #667eea;
          color: white;
        }

        .btn-outline {
          background: transparent;
          color: #999;
          border: 2px solid #ddd;
        }

        .btn-outline:hover:not(:disabled) {
          background: #f8f9fa;
          border-color: #667eea;
          color: #667eea;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .info-box {
          background: #e8f1ff;
          border: 1px solid #d0e1ff;
          border-radius: 8px;
          padding: 20px;
          text-align: left;
          margin-bottom: 20px;
        }

        .info-box h4 {
          margin: 0 0 15px 0;
          color: #667eea;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .info-box ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .info-box li {
          color: #666;
          font-size: 14px;
          margin-bottom: 8px;
          line-height: 1.5;
        }

        .info-box li:last-child {
          margin-bottom: 0;
        }

        .retry-counter {
          color: #999;
          font-size: 12px;
          margin-top: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        @media (max-width: 600px) {
          .waiting-content {
            padding: 30px 20px;
          }

          .waiting-header {
            padding: 30px 20px;
          }

          .waiting-message h2 {
            font-size: 20px;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn {
            font-size: 14px;
            padding: 10px 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default WaitingApproval;
