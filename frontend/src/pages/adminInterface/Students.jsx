import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/students-admin.css';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaBookOpen,
  FaGraduationCap,
  FaTrophy,
  FaCertificate,
  FaHeart,
  FaChartLine,
  FaUsers,
  FaClock,
  FaCheckCircle
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import { getAdminProfile, getAdminUsers } from '../../services/adminService';
import { getUserAvatar } from '../../utils/userAvatar';

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'verified', label: 'Email Verified' },
  { value: 'unverified', label: 'Email Not Verified' }
];

const progressOptions = [
  { value: 'all', label: 'All Progress' },
  { value: 'beginner', label: 'Beginner (0-25%)' },
  { value: 'intermediate', label: 'Intermediate (26-75%)' },
  { value: 'advanced', label: 'Advanced (76-99%)' },
  { value: 'completed', label: 'Completed (100%)' }
];

const Students = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgress, setFilterProgress] = useState('all');
  const [studentsData, setStudentsData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const [studentsResponse, profileResponse] = await Promise.all([
          getAdminUsers({ role: 'visiteur', search: searchTerm || undefined }),
          getAdminProfile()
        ]);

        setStudentsData(studentsResponse.data?.data || []);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load students.');
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, [searchTerm]);

  const getAverageProgress = (enrolledCourses = []) => {
    if (enrolledCourses.length === 0) return 0;
    const total = enrolledCourses.reduce((sum, course) => sum + Number(course.progress || 0), 0);
    return Math.round(total / enrolledCourses.length);
  };

  const filteredStudents = useMemo(() => {
    return studentsData.filter((student) => {
      let matchesStatus = true;
      if (filterStatus === 'active') matchesStatus = student.isActive;
      else if (filterStatus === 'inactive') matchesStatus = !student.isActive;
      else if (filterStatus === 'verified') matchesStatus = student.isEmailVerified;
      else if (filterStatus === 'unverified') matchesStatus = !student.isEmailVerified;

      let matchesProgress = true;
      const avgProgress = getAverageProgress(student.enrolledCourses || []);
      if (filterProgress === 'beginner') matchesProgress = avgProgress <= 25;
      else if (filterProgress === 'intermediate') matchesProgress = avgProgress > 25 && avgProgress <= 75;
      else if (filterProgress === 'advanced') matchesProgress = avgProgress > 75 && avgProgress < 100;
      else if (filterProgress === 'completed') matchesProgress = avgProgress === 100;

      return matchesStatus && matchesProgress;
    });
  }, [filterProgress, filterStatus, studentsData]);

  const stats = {
    total: filteredStudents.length,
    active: filteredStudents.filter(s => s.isActive).length,
    verified: filteredStudents.filter(s => s.isEmailVerified).length,
    totalEnrolled: filteredStudents.reduce((sum, s) => sum + (s.enrolledCourses?.length || 0), 0),
    totalCompleted: filteredStudents.reduce((sum, s) => sum + Number(s.totalCoursesCompleted || 0), 0),
    certificatesIssued: filteredStudents.reduce((sum, s) =>
      sum + (s.enrolledCourses || []).filter(c => c.certificateIssued).length, 0
    )
  };

  const getProgressStatus = (progress) => {
    if (progress === 0) return { label: 'Not Started', class: 'not-started' };
    if (progress < 25) return { label: 'Just Started', class: 'just-started' };
    if (progress < 50) return { label: 'In Progress', class: 'in-progress' };
    if (progress < 75) return { label: 'Halfway', class: 'halfway' };
    if (progress < 100) return { label: 'Almost Done', class: 'almost-done' };
    return { label: 'Completed', class: 'completed' };
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <Header title='Students'/>
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            <ProfileCard name={profile?.fullName || 'Administrator'} role="Administrateur" image={profile?.profilePicture} />

            {error && <div className="error-message">{error}</div>}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.total}</p>
                <p className="stat-subtext">
                  {stats.active} Active • {stats.verified} Verified
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Total Enrollments</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.totalEnrolled}</p>
                <p className="stat-subtext">Across all courses</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaTrophy />
                  </div>
                  <span className="stat-label">Completed Courses</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.totalCompleted}</p>
                <p className="stat-subtext">Successfully finished</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaCertificate />
                  </div>
                  <span className="stat-label">Certificates Issued</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.certificatesIssued}</p>
                <p className="stat-subtext">Total awarded</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="courses-filters">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <div className="filter-item">
                    <FaFilter className="filter-icon" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-item">
                    <select
                      value={filterProgress}
                      onChange={(e) => setFilterProgress(e.target.value)}
                      className="filter-select"
                    >
                      {progressOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  All Students ({filteredStudents.length})
                </h3>
              </div>

              <div className="students-grid">
                {filteredStudents.map(student => {
                  const avgProgress = getAverageProgress(student.enrolledCourses || []);
                  const progressStatus = getProgressStatus(avgProgress);

                  return (
                    <div key={student._id} className="student-card">
                      <div className="student-header">
                        <div className="student-avatar-wrapper">
                          <img
                            src={getUserAvatar(student)}
                            alt={student.fullName}
                            className="student-avatar"
                          />
                          <div className={`student-status-dot ${student.isActive ? 'active' : 'inactive'}`}></div>
                        </div>

                        <div className="student-badges">
                          {student.isEmailVerified ? (
                            <span className="student-badge verified">
                              <FaCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="student-badge unverified">
                              <FaClock /> Unverified
                            </span>
                          )}
                          <span className="student-badge language">
                            {(student.language || 'en').toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="student-body">
                        <h3 className="student-name">{student.fullName}</h3>
                        <p className="student-joined">
                          <FaClock /> Joined {formatDate(student.createdAt)}
                        </p>

                        <div className="student-contact">
                          <div className="contact-item">
                            <FaEnvelope />
                            <span>{student.email}</span>
                          </div>
                          <div className="contact-item">
                            <FaPhone />
                            <span>{student.phoneNumber}</span>
                          </div>
                        </div>

                        <div className="student-progress-section">
                          <div className="progress-header">
                            <span className="progress-label">Overall Progress</span>
                            <span className={`progress-status ${progressStatus.class}`}>
                              {progressStatus.label}
                            </span>
                          </div>
                          <div className="progress-bar-wrapper">
                            <div
                              className="progress-bar-fill"
                              style={{ width: `${avgProgress}%` }}
                            ></div>
                          </div>
                          <span className="progress-percentage">{avgProgress}%</span>
                        </div>

                        <div className="student-stats-row">
                          <div className="student-stat">
                            <FaBookOpen />
                            <div>
                              <span className="stat-number">{student.enrolledCourses?.length || 0}</span>
                              <span className="stat-text">Enrolled</span>
                            </div>
                          </div>
                          <div className="student-stat">
                            <FaGraduationCap />
                            <div>
                              <span className="stat-number">{student.totalCoursesCompleted || 0}</span>
                              <span className="stat-text">Completed</span>
                            </div>
                          </div>
                          <div className="student-stat">
                            <FaHeart />
                            <div>
                              <span className="stat-number">{student.wishlist?.length || 0}</span>
                              <span className="stat-text">Wishlist</span>
                            </div>
                          </div>
                        </div>

                        {(student.interests || []).length > 0 && (
                          <div className="student-interests">
                            <label>Interests:</label>
                            <div className="interest-tags">
                              {student.interests.slice(0, 2).map((interest, index) => (
                                <span key={index} className="interest-tag">{interest}</span>
                              ))}
                              {student.interests.length > 2 && (
                                <span className="interest-tag more">+{student.interests.length - 2}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(student.skillsNeeded || []).length > 0 && (
                          <div className="student-skills">
                            <label>Learning:</label>
                            <div className="skill-tags">
                              {student.skillsNeeded.slice(0, 3).map((skill, index) => (
                                <span key={index} className="skill-tag-small">{skill}</span>
                              ))}
                              {student.skillsNeeded.length > 3 && (
                                <span className="skill-tag-small more">+{student.skillsNeeded.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {(student.enrolledCourses || []).some(c => c.certificateIssued) && (
                          <div className="student-certificates">
                            <FaCertificate />
                            <span>
                              {(student.enrolledCourses || []).filter(c => c.certificateIssued).length} Certificate(s) Earned
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="student-footer">
                        <button
                          className="student-btn view"
                          onClick={() => navigate(`/admin/students/${student._id}`)}
                        >
                          <FaEye /> View Details
                        </button>
                        <button
                          className="student-btn progress"
                          onClick={() => navigate(`/admin/students/${student._id}`)}
                        >
                          <FaChartLine /> Track Progress
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!loading && filteredStudents.length === 0 && (
                <div className="empty-state">
                  <FaUsers className="empty-icon" />
                  <h3>No students found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Students;
