import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/student-details-admin.css';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCertificate,
  FaChartLine,
  FaCheckCircle,
  FaClock,
  FaEnvelope,
  FaEye,
  FaGlobe,
  FaGraduationCap,
  FaHeart,
  FaPhone,
  FaStar,
  FaTrophy,
  FaUserCheck
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import { getAdminProfile, getAdminUserDetails } from '../../services/adminService';
import { getUserAvatar } from '../../utils/userAvatar';

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDuration = (minutes = 0) => {
  const total = Number(minutes || 0);
  if (!total) return '0m';
  const hours = Math.floor(total / 60);
  const mins = total % 60;
  if (!hours) return `${mins}m`;
  return `${hours}h ${mins}m`;
};

const getProgressState = (progress = 0) => {
  const value = Number(progress || 0);
  if (value >= 100) return { label: 'Completed', className: 'completed' };
  if (value >= 76) return { label: 'Advanced', className: 'advanced' };
  if (value >= 26) return { label: 'In Progress', className: 'in-progress' };
  if (value > 0) return { label: 'Just Started', className: 'just-started' };
  return { label: 'Not Started', className: 'not-started' };
};

const StudentDetails = () => {
  const navigate = useNavigate();
  const { studentId } = useParams();

  const [profile, setProfile] = useState(null);
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        setError('');

        const [detailsResponse, profileResponse] = await Promise.all([
          getAdminUserDetails(studentId),
          getAdminProfile()
        ]);

        const details = detailsResponse.data?.data || null;
        setStudent(details?.role === 'visiteur' ? details : null);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load learner details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [studentId]);

  const stats = useMemo(() => ({
    totalEnrolledCourses: student?.stats?.totalEnrolledCourses || 0,
    completedCourses: student?.stats?.completedCourses || student?.totalCoursesCompleted || 0,
    certificatesIssued: student?.stats?.certificatesIssued || 0,
    wishlistCount: student?.stats?.wishlistCount || 0,
    averageProgress: student?.stats?.averageProgress || 0
  }), [student]);

  return (
    <div className="dashboard">
      <Header title="Learner Details" />
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

            {error && <div className="asd-error">{error}</div>}

            {loading ? (
              <div className="asd-state-card">Loading learner details...</div>
            ) : !student ? (
              <div className="asd-state-card">Learner not found.</div>
            ) : (
              <>
                <div className="asd-hero">
                  <div className="asd-hero-panel">
                    <div className="asd-avatar-wrap">
                      <img
                        src={getUserAvatar(student)}
                        alt={student.fullName}
                        className="asd-avatar"
                      />
                      <span className={`asd-status-dot ${student.isActive ? 'active' : 'inactive'}`} />
                    </div>

                    <div className="asd-hero-copy">
                      <div className="asd-badges">
                        <span className={`asd-badge ${student.isEmailVerified ? 'verified' : 'unverified'}`}>
                          {student.isEmailVerified ? <FaCheckCircle /> : <FaClock />}
                          {student.isEmailVerified ? 'Verified Email' : 'Email Not Verified'}
                        </span>
                        <span className={`asd-badge ${student.isActive ? 'active' : 'inactive'}`}>
                          <FaUserCheck />
                          {student.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="asd-badge language">
                          <FaGlobe />
                          {(student.language || 'en').toUpperCase()}
                        </span>
                      </div>

                      <h1 className="asd-title">{student.fullName}</h1>
                      <p className="asd-subtitle">Learner account overview</p>

                      <div className="asd-meta">
                        <span><FaEnvelope /> {student.email}</span>
                        <span><FaPhone /> {student.phoneNumber || 'No phone number'}</span>
                        <span><FaClock /> Joined {formatDate(student.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="asd-toolbar">
                  <button className="asd-btn back" onClick={() => navigate('/admin/students')}>
                    <FaArrowLeft /> Back to students
                  </button>
                </div>

                <div className="asd-stats">
                  <div className="asd-stat-card">
                    <div className="asd-stat-icon purple"><FaBookOpen /></div>
                    <span className="asd-stat-label">Enrolled Courses</span>
                    <strong className="asd-stat-value">{stats.totalEnrolledCourses}</strong>
                    <span className="asd-stat-note">Currently registered</span>
                  </div>

                  <div className="asd-stat-card">
                    <div className="asd-stat-icon cyan"><FaChartLine /></div>
                    <span className="asd-stat-label">Average Progress</span>
                    <strong className="asd-stat-value">{stats.averageProgress}%</strong>
                    <span className="asd-stat-note">Across all courses</span>
                  </div>

                  <div className="asd-stat-card">
                    <div className="asd-stat-icon green"><FaTrophy /></div>
                    <span className="asd-stat-label">Completed</span>
                    <strong className="asd-stat-value">{stats.completedCourses}</strong>
                    <span className="asd-stat-note">Finished courses</span>
                  </div>

                  <div className="asd-stat-card">
                    <div className="asd-stat-icon amber"><FaCertificate /></div>
                    <span className="asd-stat-label">Certificates</span>
                    <strong className="asd-stat-value">{stats.certificatesIssued}</strong>
                    <span className="asd-stat-note">Earned certificates</span>
                  </div>
                </div>

                <div className="asd-grid">
                  <div className="asd-card">
                    <h3 className="asd-card-title">Learning profile</h3>
                    <div className="asd-info-list">
                      <div className="asd-info-row">
                        <span>Wishlist size</span>
                        <strong>{stats.wishlistCount}</strong>
                      </div>
                      <div className="asd-info-row">
                        <span>Total completed courses</span>
                        <strong>{student.totalCoursesCompleted || 0}</strong>
                      </div>
                      <div className="asd-info-row">
                        <span>Last account update</span>
                        <strong>{formatDate(student.updatedAt)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="asd-card">
                    <h3 className="asd-card-title">Interests & goals</h3>
                    <div className="asd-block">
                      <label className="asd-block-label">Interests</label>
                      {(student.interests || []).length === 0 ? (
                        <p className="asd-empty">No interests listed.</p>
                      ) : (
                        <div className="asd-tags">
                          {student.interests.map((item, index) => (
                            <span key={`${item}-${index}`} className="asd-tag interest">{item}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="asd-block">
                      <label className="asd-block-label">Skills to learn</label>
                      {(student.skillsNeeded || []).length === 0 ? (
                        <p className="asd-empty">No learning goals listed.</p>
                      ) : (
                        <div className="asd-tags">
                          {student.skillsNeeded.map((item, index) => (
                            <span key={`${item}-${index}`} className="asd-tag skill">{item}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="asd-card">
                  <div className="asd-section-head">
                    <h3 className="asd-card-title">Enrolled courses</h3>
                    <span className="asd-section-note">{(student.enrolledCourses || []).length} courses</span>
                  </div>

                  {(student.enrolledCourses || []).length === 0 ? (
                    <p className="asd-empty">This learner is not enrolled in any course yet.</p>
                  ) : (
                    <div className="asd-course-list">
                      {student.enrolledCourses.map((course) => {
                        const progressState = getProgressState(course.progress);

                        return (
                          <div key={course._id} className="asd-course-row">
                            <img
                              src={course.thumbnail || 'https://via.placeholder.com/88x60'}
                              alt={course.title}
                              className="asd-course-thumb"
                            />
                            <div className="asd-course-content">
                              <div className="asd-course-top">
                                <div>
                                  <strong className="asd-course-title">{course.title}</strong>
                                  <p className="asd-course-meta">
                                    {course.category || 'Other'} · {course.level || 'All Levels'} · Instructor: {course.formateur?.fullName || 'Unknown'}
                                  </p>
                                </div>
                                <span className={`asd-progress-badge ${progressState.className}`}>
                                  {progressState.label}
                                </span>
                              </div>

                              <div className="asd-progress-row">
                                <div className="asd-progress-bar">
                                  <div
                                    className="asd-progress-fill"
                                    style={{ width: `${Math.min(100, Number(course.progress || 0))}%` }}
                                  ></div>
                                </div>
                                <strong>{course.progress || 0}%</strong>
                              </div>

                              <div className="asd-course-stats">
                                <span><FaClock /> {formatDuration(course.totalDuration || 0)}</span>
                                <span><FaStar /> {Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0})</span>
                                <span><FaGraduationCap /> Enrolled {formatDate(course.enrolledAt)}</span>
                                {course.certificateIssued && <span><FaCertificate /> Certificate earned</span>}
                              </div>
                            </div>
                            <button
                              className="asd-course-btn"
                              onClick={() => navigate(`/admin/courses/${course._id}`)}
                            >
                              <FaEye /> View course
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="asd-grid">
                  <div className="asd-card">
                    <div className="asd-section-head">
                      <h3 className="asd-card-title">Certificates</h3>
                      <span className="asd-section-note">{(student.certificates || []).length} certificates</span>
                    </div>
                    {(student.certificates || []).length === 0 ? (
                      <p className="asd-empty">No certificates earned yet.</p>
                    ) : (
                      <div className="asd-certificate-list">
                        {student.certificates.map((certificate) => (
                          <a
                            key={certificate._id}
                            href={certificate.pdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="asd-certificate-row"
                          >
                            <div className="asd-certificate-icon">
                              <FaCertificate />
                            </div>
                            <div className="asd-certificate-copy">
                              <strong>{certificate.courseName}</strong>
                              <span>Instructor: {certificate.instructorName}</span>
                            </div>
                            <div className="asd-certificate-meta">
                              <span>{certificate.certificateId}</span>
                              <small>{formatDate(certificate.completionDate || certificate.createdAt)}</small>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="asd-card">
                    <div className="asd-section-head">
                      <h3 className="asd-card-title">Wishlist</h3>
                      <span className="asd-section-note">{(student.wishlistCourses || []).length} saved</span>
                    </div>
                    {(student.wishlistCourses || []).length === 0 ? (
                      <p className="asd-empty">Wishlist is empty.</p>
                    ) : (
                      <div className="asd-wishlist-list">
                        {student.wishlistCourses.map((course) => (
                          <div key={course._id} className="asd-wishlist-row">
                            <img
                              src={course.thumbnail || 'https://via.placeholder.com/72x52'}
                              alt={course.title}
                              className="asd-wishlist-thumb"
                            />
                            <div className="asd-wishlist-copy">
                              <strong>{course.title}</strong>
                              <span>{course.category || 'Other'} · {course.formateur?.fullName || 'Unknown Instructor'}</span>
                            </div>
                            <button
                              className="asd-inline-btn"
                              onClick={() => navigate(`/admin/courses/${course._id}`)}
                            >
                              <FaHeart /> Open
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default StudentDetails;
