import React, { useState } from "react";
import logo from "../../assets/image/home_page/logo_rem.png";
import { NavLink } from "react-router-dom";
import "../../styles/dashboard.css";
import Sidebar from "../../components/admin/Sidebar";
import { FaBook, FaBookOpen, FaBookReader, FaUserTie } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import Header from "../../components/admin/Header";
import ProfileCard from "../../components/admin/ProfileCard";

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState(2025);
 
  const studentGrowthData = [
    { month: "Jan", value: 20 },
    { month: "Feb", value: 35 },
    { month: "Mar", value: 45 },
    { month: "Apr", value: 55 },
    { month: "May", value: 70 },
    { month: "Jun", value: 85 },
    { month: "Jul", value: 95 },
    { month: "Aug", value: 105 },
    { month: "Sep", value: 110 },
    { month: "Oct", value: 110 },
    { month: "Nov", value: 115 },
    { month: "Dec", value: 120 },
  ];

  const maxValue = 120;



  return (
    <div className="dashboard">
      {/* Hero Section */}
      <Header title='Dashboard'/>
      {/* Main Content */}
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>
          {/* Main Dashboard Content */}
          <main className="main">
            {/* Profile Card */}
           <ProfileCard />

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaUserTie />
                  </div>
                  <span className="stat-label">Total instructor</span>
                </div>
                <p className="stat-value">13</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Active Courses</span>
                </div>
                <p className="stat-value">08</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                <div className="stat-icon purple"><FaBookReader /></div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">17</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                <div className="stat-icon cyan"><FaBook /></div>
                  <span className="stat-label">Total Courses</span>
                </div>
                <p className="stat-value">11</p>
              </div>
            </div>

            {/* Total Earnings */}
            <div className="stat-card earnings-card">
              <div className="stat-header">
              <div className="stat-icon purple-gradient"><FcMoneyTransfer /></div>
                <span className="stat-label">Total Earnings</span>
              </div>
              <p className="stat-value">$486</p>
            </div>

            {/* Students Growth Chart */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Students Growth</h3>
                <button className="year-selector">
                  <span>📅</span>
                  <span>{selectedYear}</span>
                </button>
              </div>

              <div className="chart-container">
                <div className="chart-y-axis">
                  <span>120</span>
                  <span>100</span>
                  <span>80</span>
                  <span>60</span>
                  <span>40</span>
                  <span>20</span>
                  <span>-</span>
                </div>

                <div className="chart-area">
                  {studentGrowthData.map((data, index) => (
                    <div key={data.month} className="chart-bar-wrapper">
                      <div
                        className="chart-bar"
                        style={{ height: `${(data.value / maxValue) * 100}%` }}
                      ></div>
                      <span className="chart-label">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
