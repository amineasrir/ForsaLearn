import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import '../../styles/auth.css';

const AccountRejected = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    // Get data from location state
    const state = location.state;
    if (state) {
      setEmail(state.email || '');
      setRejectionReason(state.rejectionReason || '');
    }
  }, [location.state]);

  const handleContactSupport = () => {
    window.open(`mailto:support@forsalearn.com?subject=Account Appeal - ${email}`, '_blank');
  };

  const handleReturnHome = () => {
    navigate('/');
  };

  const handleReapply = () => {
    localStorage.removeItem('formateur_pending_email');
    navigate('/formateur/signup');
  };

  return (
    <div className="auth-container auth-page">
      <div className="auth-wrapper">
        <div className="waiting-approval-container">
          {/* Header with Logo */}
          <div className="waiting-header rejected-header">
            <img src={logo_rem} alt="ForsaLearn" className="waiting-logo" />
            <h1>{t('accountRejected.title') || 'Application Not Approved'}</h1>
          </div>

          {/* Main Content */}
          <div className="waiting-content">
            {/* Status Icon */}
            <div className="status-icon rejected">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="40" cy="40" r="35" fill="#F8D7DA" stroke="#DC3545" strokeWidth="2" />
                <path
                  d="M25 25L55 55M55 25L25 55"
                  stroke="#DC3545"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Message Section */}
            <div className="waiting-message">
              <h2>{t('accountRejected.sorry') || 'Application Not Approved'}</h2>
              <p className="primary-message">
                {t('accountRejected.message') ||
                  'Unfortunately, your instructor account application could not be approved at this time.'}
              </p>

              {/* Email Display */}
              <div className="email-display">
                <label>{t('accountRejected.account') || 'Account Email:'}</label>
                <p>{email || 'Loading...'}</p>
              </div>

              {/* Rejection Reason */}
              {rejectionReason && (
                <div className="rejection-reason">
                  <h4>{t('accountRejected.reason') || 'Reason for Rejection:'}</h4>
                  <div className="reason-box">
                    <p>{rejectionReason}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="action-buttons">
                <button
                  className="btn btn-danger"
                  onClick={handleContactSupport}
                >
                  {t('accountRejected.appeal') || 'Appeal Decision'}
                </button>

                <button
                  className="btn btn-secondary"
                  onClick={handleReapply}
                >
                  {t('accountRejected.reapply') || 'Reapply'}
                </button>

                <button
                  className="btn btn-outline"
                  onClick={handleReturnHome}
                >
                  {t('accountRejected.home') || 'Return Home'}
                </button>
              </div>

              {/* Additional Info */}
              <div className="info-box rejected-info">
                <h4>{t('accountRejected.nextSteps') || 'What You Can Do'}</h4>
                <ul>
                  <li>📧 {t('accountRejected.email') || 'Contact our support team to understand the reasons'}</li>
                  <li>📋 {t('accountRejected.update') || 'Update your qualifications and reapply'}</li>
                  <li>💬 {t('accountRejected.appeal2') || 'Appeal the decision if you believe this is a mistake'}</li>
                  <li>🔗 {t('accountRejected.join') || 'Join our community as a student'}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .rejected-header {
          background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
        }

        .status-icon.rejected {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .rejection-reason {
          background: #f8d7da;
          border: 1px solid #f5c6cb;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 30px;
          text-align: left;
        }

        .rejection-reason h4 {
          margin: 0 0 15px 0;
          color: #721c24;
          font-size: 14px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        .reason-box {
          background: white;
          border-left: 4px solid #dc3545;
          padding: 15px;
          border-radius: 4px;
        }

        .reason-box p {
          margin: 0;
          color: #666;
          line-height: 1.6;
          font-size: 14px;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
        }

        .btn-danger:hover:not(:disabled) {
          background: #c82333;
          transform: translateY(-2px);
          box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
        }

        .rejected-info {
          background: #ffeaea;
          border-left-color: #dc3545;
        }

        .rejected-info h4 {
          color: #dc3545;
        }

        .rejected-info ul {
          color: #666;
        }

        .rejected-info li {
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default AccountRejected;
