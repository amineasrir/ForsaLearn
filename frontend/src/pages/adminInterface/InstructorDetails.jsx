import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/instructor-details-admin.css';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaExternalLinkAlt,
  FaGlobe,
  FaMoneyBillWave,
  FaPhone,
  FaProjectDiagram,
  FaStar,
  FaTimesCircle,
  FaUserCheck,
  FaUsers
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import {
  approveFormateur,
  getAdminProfile,
  getAdminUserDetails,
  rejectFormateur
} from '../../services/adminService';
import { getUserAvatar } from '../../utils/userAvatar';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const currency = (value = 0) => `$${Number(value || 0).toLocaleString()}`;

const InstructorDetails = () => {
  const navigate = useNavigate();
  const { instructorId } = useParams();

  const [profile, setProfile] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const [detailsResponse, profileResponse] = await Promise.all([
          getAdminUserDetails(instructorId),
          getAdminProfile()
        ]);

        const details = detailsResponse.data?.data || null;
        setInstructor(details?.role === 'formateur' ? details : null);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load instructor details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [instructorId]);

  const stats = useMemo(() => ({
    totalCourses: instructor?.stats?.totalCourses || 0,
    publishedCourses: instructor?.stats?.publishedCourses || 0,
    totalEnrollments: instructor?.stats?.totalEnrollments || instructor?.totalStudents || 0,
    totalRevenue: instructor?.stats?.totalRevenue || instructor?.totalEarnings || 0,
    issuedCertificates: instructor?.stats?.issuedCertificates || 0,
    rating: Number(instructor?.rating || 0)
  }), [instructor]);

  const handleApprove = async () => {
    try {
      await approveFormateur(instructorId);
      setInstructor((prev) => (
        prev
          ? {
              ...prev,
              isApproved: true,
              rejectionReason: '',
              approvedAt: new Date().toISOString()
            }
          : prev
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve instructor.');
    }
  };

  const handleReject = async () => {
    const reason = window.prompt('Enter a rejection reason');
    if (!reason) return;

    try {
      await rejectFormateur(instructorId, reason);
      setInstructor((prev) => (
        prev
          ? {
              ...prev,
              isApproved: false,
              rejectionReason: reason
            }
          : prev
      ));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject instructor.');
    }
  };

  return (
    <div className="dashboard">
      <Header title="Instructor Details" />
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            <ProfileCard
              name={profile?.fullName || 'Administrator'}
              role="Administrateur"
              image={profile?.profilePicture}
            />

            {error && <div className="aid-error">{error}</div>}

            {loading ? (
              <div className="aid-state-card">Loading instructor details...</div>
            ) : !instructor ? (
              <div className="aid-state-card">Instructor not found.</div>
            ) : (
              <>
                <div className="aid-hero">
                  <div className="aid-hero-panel">
                    <div className="aid-hero-avatar-wrap">
                      <img
                        src={getUserAvatar(instructor)}
                        alt={instructor.fullName}
                        className="aid-hero-avatar"
                      />
                      <span className={`aid-status-dot ${instructor.isActive ? 'active' : 'inactive'}`} />
                    </div>

                    <div className="aid-hero-copy">
                      <div className="aid-badges">
                        <span className={`aid-badge ${instructor.isApproved ? 'approved' : 'pending'}`}>
                          {instructor.isApproved ? <FaCheckCircle /> : <FaTimesCircle />}
                          {instructor.isApproved ? 'Approved' : 'Pending Approval'}
                        </span>
                        <span className={`aid-badge ${instructor.isActive ? 'active' : 'inactive'}`}>
                          <FaUserCheck />
                          {instructor.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="aid-badge language">
                          <FaGlobe />
                          {(instructor.language || 'en').toUpperCase()}
                        </span>
                      </div>

                      <h1 className="aid-title">{instructor.fullName}</h1>
                      <p className="aid-field">{instructor.field || 'General Instructor'}</p>
                      <p className="aid-bio">{instructor.bio || 'No biography available for this instructor yet.'}</p>

                      <div className="aid-meta">
                        <span><FaEnvelope /> {instructor.email}</span>
                        <span><FaPhone /> {instructor.phoneNumber || 'No phone number'}</span>
                        <span><FaClock /> Joined {formatDate(instructor.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="aid-toolbar">
                  <button className="aid-btn back" onClick={() => navigate('/admin/instructors')}>
                    <FaArrowLeft /> Back to instructors
                  </button>
                  <div className="aid-toolbar-actions">
                    {!instructor.isApproved && (
                      <button className="aid-btn approve" onClick={handleApprove}>
                        <FaCheckCircle /> Approve
                      </button>
                    )}
                    <button className="aid-btn reject" onClick={handleReject}>
                      <FaTimesCircle /> Reject
                    </button>
                  </div>
                </div>

                <div className="aid-stats">
                  <div className="aid-stat-card">
                    <div className="aid-stat-icon purple"><FaBookOpen /></div>
                    <span className="aid-stat-label">Courses</span>
                    <strong className="aid-stat-value">{stats.totalCourses}</strong>
                    <span className="aid-stat-note">{stats.publishedCourses} published</span>
                  </div>

                  <div className="aid-stat-card">
                    <div className="aid-stat-icon cyan"><FaUsers /></div>
                    <span className="aid-stat-label">Enrollments</span>
                    <strong className="aid-stat-value">{stats.totalEnrollments}</strong>
                    <span className="aid-stat-note">Across all courses</span>
                  </div>

                  <div className="aid-stat-card">
                    <div className="aid-stat-icon pink"><FaMoneyBillWave /></div>
                    <span className="aid-stat-label">Revenue</span>
                    <strong className="aid-stat-value">{currency(stats.totalRevenue)}</strong>
                    <span className="aid-stat-note">Instructor earnings</span>
                  </div>

                  <div className="aid-stat-card">
                    <div className="aid-stat-icon amber"><FaStar /></div>
                    <span className="aid-stat-label">Rating</span>
                    <strong className="aid-stat-value">
                      {stats.rating > 0 ? stats.rating.toFixed(1) : 'N/A'}
                    </strong>
                    <span className="aid-stat-note">{instructor.totalReviews || 0} reviews</span>
                  </div>
                </div>

                <div className="aid-grid">
                  <div className="aid-card">
                    <h3 className="aid-card-title">Account overview</h3>
                    <div className="aid-info-list">
                      <div className="aid-info-row">
                        <span>Approval date</span>
                        <strong>{formatDate(instructor.approvedAt)}</strong>
                      </div>
                      <div className="aid-info-row">
                        <span>Approved by</span>
                        <strong>{instructor.approvedBy?.fullName || 'Not assigned'}</strong>
                      </div>
                      <div className="aid-info-row">
                        <span>Certificates issued</span>
                        <strong>{stats.issuedCertificates}</strong>
                      </div>
                      <div className="aid-info-row">
                        <span>Uploaded credentials</span>
                        <strong>{(instructor.certificates || []).length}</strong>
                      </div>
                      <div className="aid-info-row">
                        <span>Projects shared</span>
                        <strong>{(instructor.projects || []).length}</strong>
                      </div>
                    </div>
                    {instructor.rejectionReason && (
                      <div className="aid-warning-box">
                        <strong>Latest rejection reason:</strong> {instructor.rejectionReason}
                      </div>
                    )}
                  </div>

                  <div className="aid-card">
                    <h3 className="aid-card-title">Skills</h3>
                    {(instructor.skills || []).length === 0 ? (
                      <p className="aid-empty">No skills listed.</p>
                    ) : (
                      <div className="aid-tags">
                        {instructor.skills.map((skill, index) => (
                          <span key={`${skill}-${index}`} className="aid-tag">{skill}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="aid-grid">
                  <div className="aid-card">
                    <h3 className="aid-card-title">Uploaded certificates</h3>
                    {(instructor.certificates || []).length === 0 ? (
                      <p className="aid-empty">No uploaded certificates.</p>
                    ) : (
                      <div className="aid-resource-list">
                        {instructor.certificates.map((item, index) => (
                          <a
                            key={`${item.name}-${index}`}
                            className="aid-resource-row"
                            href={item.value}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div>
                              <strong>{item.name}</strong>
                              <span>{item.type} · {formatDate(item.uploadedAt)}</span>
                            </div>
                            <FaExternalLinkAlt />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="aid-card">
                    <h3 className="aid-card-title">Projects</h3>
                    {(instructor.projects || []).length === 0 ? (
                      <p className="aid-empty">No projects uploaded.</p>
                    ) : (
                      <div className="aid-resource-list">
                        {instructor.projects.map((item, index) => (
                          <a
                            key={`${item.title}-${index}`}
                            className="aid-resource-row"
                            href={item.value}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <div>
                              <strong>{item.title}</strong>
                              <span>{item.type} · {formatDate(item.uploadedAt)}</span>
                            </div>
                            <FaProjectDiagram />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="aid-card">
                  <div className="aid-section-head">
                    <h3 className="aid-card-title">Courses by this instructor</h3>
                    <span className="aid-section-note">{(instructor.courses || []).length} total</span>
                  </div>
                  {(instructor.courses || []).length === 0 ? (
                    <p className="aid-empty">This instructor has not created any courses yet.</p>
                  ) : (
                    <div className="aid-course-list">
                      {instructor.courses.map((course) => (
                        <div key={course._id} className="aid-course-row">
                          <img
                            src={course.thumbnail || 'https://via.placeholder.com/88x60'}
                            alt={course.title}
                            className="aid-course-thumb"
                          />
                          <div className="aid-course-content">
                            <div className="aid-course-top">
                              <div>
                                <strong className="aid-course-title">{course.title}</strong>
                                <p className="aid-course-meta">
                                  {course.category || 'Other'} · {course.level || 'All Levels'} · {formatDate(course.createdAt)}
                                </p>
                              </div>
                              <span className={`aid-course-status ${course.status}`}>{course.status}</span>
                            </div>

                            <div className="aid-course-stats">
                              <span><FaUsers /> {course.totalEnrollments || 0}</span>
                              <span><FaMoneyBillWave /> {currency(course.totalRevenue || 0)}</span>
                              <span><FaStar /> {Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0})</span>
                            </div>
                          </div>
                          <button
                            className="aid-course-btn"
                            onClick={() => navigate(`/admin/courses/${course._id}`)}
                          >
                            View course
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="aid-card">
                  <div className="aid-section-head">
                    <h3 className="aid-card-title">Recently issued certificates</h3>
                    <span className="aid-section-note">{stats.issuedCertificates} visible here</span>
                  </div>
                  {(instructor.issuedCertificates || []).length === 0 ? (
                    <p className="aid-empty">No learner certificates have been issued yet.</p>
                  ) : (
                    <div className="aid-issued-list">
                      {instructor.issuedCertificates.map((item) => (
                        <a
                          key={item._id}
                          href={item.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="aid-issued-row"
                        >
                          <div className="aid-issued-icon">
                            <FaCertificate />
                          </div>
                          <div className="aid-issued-copy">
                            <strong>{item.studentName}</strong>
                            <span>{item.courseName}</span>
                          </div>
                          <div className="aid-issued-meta">
                            <span>{item.certificateId}</span>
                            <small>{formatDate(item.completionDate || item.createdAt)}</small>
                          </div>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstructorDetails;
