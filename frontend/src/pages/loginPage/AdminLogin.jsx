import React, { useState } from 'react';
import '../../styles/login-admin.css';
import { FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/adminService.js';
import logo from '../../assets/image/home_page/logo_rem.png';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await adminLogin(formData);

      localStorage.setItem("adminToken", res.data.token);

      localStorage.setItem("adminUser", JSON.stringify(res.data.user));

      navigate("/admin/dashboard");

    } catch (error) {
      console.log(error.response.data);
      alert(error.response.data.message);
    }
  };


  return (
    <div className="admin-login-page">
      {/* Left Side - Illustration */}
      <div className="admin-login-left">
        <div className="illustration-container">
          <img 
            src={logo}
            alt="Admin Login Illustration" 
            className="login-illustration"
          />
        </div>
        
        <div className="welcome-content">
          <h1 className="welcome-title">
            Welcome to <br />
            <span className="brand-name">Forsa<span className="brand-highlight">Learn</span></span> Admin.
          </h1>
          <p className="welcome-description">
            Secure admin portal to manage, monitor, and control all platform activities, users, and content.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="admin-login-right">
        <div className="login-header">
          <div className="logo-section">
            <div className="logo">
              <span className="logo-text">
                FORSA<span className="logo-learn">LEARN</span>
              </span>
            </div>
          </div>
          <Link to="/" className="back-link">
            Back to Home
          </Link>
        </div>

        <div className="login-form-container">
          <div className="form-header">
            <div className="admin-badge">
              <FaShieldAlt /> Administrator Access
            </div>
            <h2 className="form-title">Sign into Admin Panel</h2>
            <p className="form-subtitle">Enter your credentials to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="admin-input"
                placeholder="admin@forsalearn.com"
                required
              />
            </div>

            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="admin-input"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-label">Remember Me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  Signing in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          <div className="security-notice">
            <FaShieldAlt className="shield-icon" />
            <p>
              This is a secure admin area. All login attempts are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;