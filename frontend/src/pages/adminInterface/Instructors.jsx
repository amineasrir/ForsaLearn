import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/instructors-admin.css';
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaUsers,
  FaMoneyBillWave,
  FaBookOpen,
  FaCertificate,
  FaProjectDiagram,
  FaEnvelope,
  FaPhone,
  FaGraduationCap
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import {
  approveFormateur,
  getAdminProfile,
  getAdminUsers,
  getPendingFormateurs,
  rejectFormateur
} from '../../services/adminService';

const fields = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
  'Language Learning',
  'Other'
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending Approval' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterField, setFilterField] = useState('all');
  const [instructorsData, setInstructorsData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadInstructors = async () => {
      try {
        setLoading(true);
        const [usersResponse, pendingResponse, profileResponse] = await Promise.all([
          getAdminUsers({ role: 'formateur', search: searchTerm || undefined }),
          getPendingFormateurs(),
          getAdminProfile()
        ]);

        const pendingMap = new Map((pendingResponse.data?.data || []).map((item) => [item._id, item]));
        const mergedInstructors = (usersResponse.data?.data || []).map((instructor) => ({
          ...instructor,
          ...pendingMap.get(instructor._id)
        }));

        setInstructorsData(mergedInstructors);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load instructors.');
      } finally {
        setLoading(false);
      }
    };

    loadInstructors();
  }, [searchTerm]);

  const filteredInstructors = useMemo(() => {
    return instructorsData.filter((instructor) => {
      let matchesStatus = true;
      if (filterStatus === 'approved') matchesStatus = instructor.isApproved;
      else if (filterStatus === 'pending') matchesStatus = !instructor.isApproved;
      else if (filterStatus === 'active') matchesStatus = instructor.isActive;
      else if (filterStatus === 'inactive') matchesStatus = !instructor.isActive;

      const matchesField = filterField === 'all' || instructor.field === filterField;
      return matchesStatus && matchesField;
    });
  }, [filterField, filterStatus, instructorsData]);

  const stats = {
    total: filteredInstructors.length,
    approved: filteredInstructors.filter(i => i.isApproved).length,
    pending: filteredInstructors.filter(i => !i.isApproved).length,
    active: filteredInstructors.filter(i => i.isActive).length,
    totalStudents: filteredInstructors.reduce((sum, i) => sum + Number(i.totalStudents || 0), 0),
    totalEarnings: filteredInstructors.reduce((sum, i) => sum + Number(i.totalEarnings || 0), 0),
    averageRating: filteredInstructors.filter(i => Number(i.rating) > 0).length
      ? (filteredInstructors.reduce((sum, i) => sum + Number(i.rating || 0), 0) / filteredInstructors.filter(i => Number(i.rating) > 0).length).toFixed(1)
      : '0.0'
  };

  const handleApprove = async (id) => {
    try {
      await approveFormateur(id);
      setInstructorsData((prev) => prev.map((item) => (
        item._id === id ? { ...item, isApproved: true } : item
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve instructor.');
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt('Enter a rejection reason');
    if (!reason) return;

    try {
      await rejectFormateur(id, reason);
      setInstructorsData((prev) => prev.map((item) => (
        item._id === id ? { ...item, isApproved: false, rejectionReason: reason } : item
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject instructor.');
    }
  };

  return (
    <div className="dashboard">
      <Header title='Instructors'/>
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
                    <FaGraduationCap />
                  </div>
                  <span className="stat-label">Total Instructors</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.total}</p>
                <p className="stat-subtext">
                  {stats.approved} Approved • {stats.pending} Pending
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.totalStudents}</p>
                <p className="stat-subtext">Across all instructors</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaStar />
                  </div>
                  <span className="stat-label">Average Rating</span>
                </div>
                <p className="stat-value">{loading ? '...' : stats.averageRating}</p>
                <p className="stat-subtext">Based on reviews</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaMoneyBillWave />
                  </div>
                  <span className="stat-label">Total Earnings</span>
                </div>
                <p className="stat-value">{loading ? '...' : `$${stats.totalEarnings.toLocaleString()}`}</p>
                <p className="stat-subtext">Instructor earnings</p>
              </div>
            </div>

            <div className="chart-card">
              <div className="courses-filters">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search instructors..."
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
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Fields</option>
                      {fields.map(field => (
                        <option key={field} value={field}>
                          {field}
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
                  All Instructors ({filteredInstructors.length})
                </h3>
              </div>

              <div className="instructors-grid">
                {filteredInstructors.map(instructor => (
                  <div key={instructor._id} className="instructor-card">
                    <div className="instructor-header">
                      <div className="instructor-avatar-wrapper">
                        <img
                          src={instructor.profilePicture || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'}
                          alt={instructor.fullName}
                          className="instructor-avatar"
                        />
                        <div className={`instructor-status-dot ${instructor.isActive ? 'active' : 'inactive'}`}></div>
                      </div>

                      <div className="instructor-badges">
                        {instructor.isApproved ? (
                          <span className="instructor-badge approved">
                            <FaCheckCircle /> Approved
                          </span>
                        ) : (
                          <span className="instructor-badge pending">
                            <FaTimesCircle /> Pending
                          </span>
                        )}
                        <span className="instructor-badge language">
                          {(instructor.language || 'en').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="instructor-body">
                      <h3 className="instructor-name">{instructor.fullName}</h3>
                      <p className="instructor-field">
                        <FaBookOpen /> {instructor.field || 'Other'}
                      </p>

                      <p className="instructor-bio">{instructor.bio || 'No bio available.'}</p>

                      <div className="instructor-skills">
                        {(instructor.skills || []).slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {(instructor.skills || []).length > 3 && (
                          <span className="skill-tag more">+{instructor.skills.length - 3}</span>
                        )}
                      </div>

                      <div className="instructor-contact">
                        <div className="contact-item">
                          <FaEnvelope />
                          <span>{instructor.email}</span>
                        </div>
                        <div className="contact-item">
                          <FaPhone />
                          <span>{instructor.phoneNumber}</span>
                        </div>
                      </div>

                      <div className="instructor-stats-row">
                        <div className="instructor-stat">
                          <FaUsers />
                          <div>
                            <span className="stat-number">{instructor.totalStudents || 0}</span>
                            <span className="stat-text">Students</span>
                          </div>
                        </div>
                        <div className="instructor-stat">
                          <FaStar />
                          <div>
                            <span className="stat-number">
                              {Number(instructor.rating || 0) > 0 ? Number(instructor.rating).toFixed(1) : 'N/A'}
                            </span>
                            <span className="stat-text">Rating</span>
                          </div>
                        </div>
                        <div className="instructor-stat">
                          <FaMoneyBillWave />
                          <div>
                            <span className="stat-number">${Number(instructor.totalEarnings || 0).toLocaleString()}</span>
                            <span className="stat-text">Earnings</span>
                          </div>
                        </div>
                      </div>

                      <div className="instructor-resources">
                        <div className="resource-item">
                          <FaCertificate />
                          <span>{(instructor.certificates || []).length} Certificates</span>
                        </div>
                        <div className="resource-item">
                          <FaProjectDiagram />
                          <span>{(instructor.projects || []).length} Projects</span>
                        </div>
                      </div>
                    </div>

                    <div className="instructor-footer">
                      <button className="instructor-btn view">
                        <FaEye /> View Profile
                      </button>
                      {!instructor.isApproved && (
                        <>
                          <button className="instructor-btn approve" onClick={() => handleApprove(instructor._id)}>
                            <FaCheckCircle /> Approve
                          </button>
                          <button className="instructor-btn reject" onClick={() => handleReject(instructor._id)}>
                            <FaTimesCircle /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {!loading && filteredInstructors.length === 0 && (
                <div className="empty-state">
                  <FaGraduationCap className="empty-icon" />
                  <h3>No instructors found</h3>
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

export default Instructors;
