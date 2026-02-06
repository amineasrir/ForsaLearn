import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import signupImage from "../../assets/image/login/image.png";
import AuthSidebar from '../../components/auth/AuthSidebar';
import '../../styles/auth.css';

const FormatterSignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('formateur'); // Default to formateur
  const [step, setStep] = useState(1);
  const [basicInfo, setBasicInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [professionalInfo, setProfessionalInfo] = useState({
    specialty: '',
    skills: '',
    projectLink: '',
    certification: null,
    bio: '',
  });
  const [agreeTOS, setAgreeTOS] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect to SignUp if apprenant is selected
  useEffect(() => {
    if (userType === 'apprenant') {
      navigate('/signup');
    }
  }, [userType, navigate]);

  const handleBasicChange = (e) => {
    const { name, value } = e.target;
    setBasicInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setProfessionalInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCertificationChange = (e) => {
    const file = e.target.files[0];
    setProfessionalInfo(prev => ({
      ...prev,
      certification: file
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError('');

    if (basicInfo.password !== basicInfo.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreeTOS) {
      setError('Please agree to Terms of Service and Privacy Policy');
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!professionalInfo.specialty || !professionalInfo.skills || !professionalInfo.bio) {
      setError('Please fill in all professional information fields');
      return;
    }

    navigate('/formateur/dashboard');
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <AuthSidebar image={signupImage} />

        <div className="auth-right">
          <div className="auth-header">
            <img src={logo_rem} alt="ForsaLearn" className="auth-logo" />
            <Link to="/" className="back-link">{t('backToHome')}</Link>
          </div>

          <div className="auth-form-container">
            <h2>{step === 1 ? (t('signUpTitle') || 'Sign Up') : (t('professionalInfo') || 'Professional Information')}</h2>

            {/* Role Selector */}
            {step === 1 && (
              <div className="role-selector">
                <label className={`role-option ${userType === 'apprenant' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="apprenant"
                    checked={userType === 'apprenant'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <span>{t('student') || 'Student'}</span>
                </label>
                <label className={`role-option ${userType === 'formateur' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="userType"
                    value="formateur"
                    checked={userType === 'formateur'}
                    onChange={(e) => setUserType(e.target.value)}
                  />
                  <span>{t('instructor') || 'Instructor'}</span>
                </label>
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {step === 1 ? (
              <form onSubmit={handleNextStep}>
                <div className="form-group">
                  <label htmlFor="fullName">{t('fullName')}</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={basicInfo.fullName}
                    onChange={handleBasicChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('email')}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={basicInfo.email}
                    onChange={handleBasicChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={basicInfo.phone}
                    onChange={handleBasicChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">{t('password')}</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={basicInfo.password}
                    onChange={handleBasicChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">{t('confirmPassword')}</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={basicInfo.confirmPassword}
                    onChange={handleBasicChange}
                    required
                  />
                </div>

                <div className="form-terms">
                  <label className="terms-checkbox">
                    <input
                      type="checkbox"
                      checked={agreeTOS}
                      onChange={(e) => setAgreeTOS(e.target.checked)}
                    />
                    <span>{t('agreeTerms') || 'I agree with'} <a href="#">{t('termsOfService') || 'Terms of Service'}</a> {t('and')} <a href="#">{t('privacyPolicy') || 'Privacy Policy'}</a></span>
                  </label>
                </div>

                <button type="submit" className="btn-signup" disabled={loading}>
                  {t('continue') || 'Continue'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="specialty">{t('specialty') || 'Specialty'}</label>
                  <input
                    type="text"
                    id="specialty"
                    name="specialty"
                    value={professionalInfo.specialty}
                    onChange={handleProfessionalChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="skills">{t('skills') || 'Skills'}</label>
                  <input
                    type="text"
                    id="skills"
                    name="skills"
                    value={professionalInfo.skills}
                    onChange={handleProfessionalChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="projectLink">{t('projectLink') || 'Project Link'}</label>
                  <input
                    type="url"
                    id="projectLink"
                    name="projectLink"
                    value={professionalInfo.projectLink}
                    onChange={handleProfessionalChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="certification">{t('uploadCertification') || 'Upload Certification'}</label>
                  <input
                    type="file"
                    id="certification"
                    name="certification"
                    onChange={handleCertificationChange}
                    accept=".pdf,.jpg,.png,.jpeg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bio">{t('bio') || 'Bio'}</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={professionalInfo.bio}
                    onChange={handleProfessionalChange}
                    rows="4"
                    required
                  ></textarea>
                </div>

                <div className="form-buttons">
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)}>
                    {t('previous') || 'Previous'}
                  </button>
                  <button type="submit" className="btn-signup" disabled={false}>
                    {(t('continue') || 'Continue')}
                  </button>
                </div>
              </form>
            )}
          
            <div className="auth-footer">
              <p>
                {t('haveAccount', 'Already have an account?')}{' '}
                <Link to="/signin">{t('signIn')}</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormatterSignUp;
