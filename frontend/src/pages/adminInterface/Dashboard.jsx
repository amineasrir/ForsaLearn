import React, { useEffect, useMemo, useState } from "react";
import "../../styles/dashboard.css";
import Sidebar from "../../components/admin/Sidebar";
import { FaBook, FaBookOpen, FaBookReader, FaUserTie } from "react-icons/fa";
import { FcMoneyTransfer } from "react-icons/fc";
import Header from "../../components/admin/Header";
import ProfileCard from "../../components/admin/ProfileCard";
import {
  getAdminDashboardStats,
  getAdminProfile,
  getAdminRevenue
} from "../../services/adminService";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const [statsResponse, revenueResponse, profileResponse] = await Promise.all([
          getAdminDashboardStats(),
          getAdminRevenue("year"),
          getAdminProfile()
        ]);

        setStats(statsResponse.data?.data || null);
        setRevenue(revenueResponse.data?.data || null);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const studentGrowthData = useMemo(() => {
    const revenueByDate = revenue?.revenueByDate || {};
    const monthMap = {};
    const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    Object.keys(revenueByDate).forEach((dateKey) => {
      const date = new Date(dateKey);
      const monthIndex = date.getMonth();
      monthMap[monthIndex] = (monthMap[monthIndex] || 0) + Number(revenueByDate[dateKey] || 0);
    });

    return monthLabels.map((month, index) => ({
      month,
      value: monthMap[index] || 0
    }));
  }, [revenue]);

  const maxValue = Math.max(...studentGrowthData.map((item) => item.value), 1);
  const overview = stats?.overview || {};
  const adminName = profile?.fullName || "Administrator";

  return (
    <div className="dashboard">
      <Header title='Dashboard'/>
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>
          <main className="main">
            <ProfileCard name={adminName} role="Administrateur" image={profile?.profilePicture} />

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaUserTie />
                  </div>
                  <span className="stat-label">Total instructor</span>
                </div>
                <p className="stat-value">{loading ? "..." : overview.totalFormateurs || 0}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Active Courses</span>
                </div>
                <p className="stat-value">{loading ? "..." : overview.publishedCourses || 0}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple"><FaBookReader /></div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{loading ? "..." : overview.totalVisiteurs || 0}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan"><FaBook /></div>
                  <span className="stat-label">Total Courses</span>
                </div>
                <p className="stat-value">{loading ? "..." : overview.totalCourses || 0}</p>
              </div>
            </div>

            <div className="stat-card earnings-card">
              <div className="stat-header">
                <div className="stat-icon purple-gradient"><FcMoneyTransfer /></div>
                <span className="stat-label">Total Earnings</span>
              </div>
              <p className="stat-value">
                {loading ? "..." : `$${Number(overview.totalRevenue || 0).toLocaleString()}`}
              </p>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">Revenue Growth</h3>
                <button className="year-selector">
                  <span>Year</span>
                </button>
              </div>

              <div className="chart-container">
                <div className="chart-y-axis">
                  <span>{maxValue}</span>
                  <span>{Math.round(maxValue * 0.8)}</span>
                  <span>{Math.round(maxValue * 0.6)}</span>
                  <span>{Math.round(maxValue * 0.4)}</span>
                  <span>{Math.round(maxValue * 0.2)}</span>
                  <span>0</span>
                  <span>-</span>
                </div>

                <div className="chart-area">
                  {studentGrowthData.map((data) => (
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
