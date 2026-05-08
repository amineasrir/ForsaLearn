import React, { useState } from 'react';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import Sidebar from './Sidebar';
import '../../pages/ApprenantPage/dashboard.css';

const ApprenantLayout = ({ title, breadcrumb = [], rightContent = null, className = '', children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title={title}
        breadcrumb={breadcrumb}
        rightContent={rightContent}
        onMenuClick={toggleSidebar}
      />

      <div className={`dashboard-container ${className}`}>
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
        <main className="main-content" onClick={closeSidebar}>
          {children}
        </main>
      </div>

      <div className={`sidebar-overlay${sidebarOpen ? ' active' : ''}`} onClick={closeSidebar} />
    </div>
  );
};

export default ApprenantLayout;
