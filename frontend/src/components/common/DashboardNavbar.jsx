import React from 'react';
import { Link } from 'react-router-dom';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import '../../pages/ApprenantPage/dashboard.css';
/**
 * Props:
 * - title: page title string
 * - breadcrumb: array of { to?, label } objects; the last item may omit 'to'
 * - rightContent: optional React node to render inside right section (e.g. icons)
 */
const DashboardNavbar = ({ title, breadcrumb = [], rightContent = null }) => {
  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className=".header-left">
          <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
        </div>
        <div className="header-center">
          <h1>{title}</h1>
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="header-center .breadcrumb">
              {breadcrumb.map((item, idx) => (
                <React.Fragment key={idx}>
                  {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
                  {idx < breadcrumb.length - 1 && <span>/</span>}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
        <div className="navbar-dashboard-right">
          {rightContent}
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
