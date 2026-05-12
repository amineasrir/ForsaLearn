import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/courses-admin.css';
import '../../styles/course-details-admin.css';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
  FaStar,
  FaUsers
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import { approveAdminCourse, getAdminCourseDetails, getAdminProfile } from '../../services/adminService';

const formatDuration = (minutes = 0) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (!hours) return `${remainingMinutes}m`;
  return `${hours}h ${remainingMinutes}m`;
};

const getFinalPrice = (course) => {
  const discountPercentage = course?.discount?.percentage || 0;
  if (course?.priceType === 'free') return 0;
  if (discountPercentage > 0) {
    return Number(course.price || 0) - ((Number(course.price || 0) * discountPercentage) / 100);
  }
  return Number(course?.price || 0);
};

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDetails = async () => {
      try {
        setLoading(true);
        const [courseResponse, profileResponse] = await Promise.all([
          getAdminCourseDetails(courseId),
          getAdminProfile()
        ]);

        setCourse(courseResponse.data?.data || null);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [courseId]);

  const overview = useMemo(() => ({
    sections: course?.sections?.length || 0,
    lessons: (course?.sections || []).reduce((sum, section) => sum + (section.lessons?.length || 0), 0),
    students: course?.totalEnrollments || 0,
    rating: Number(course?.averageRating || 0).toFixed(1)
  }), [course]);

  const handleApprove = async () => {
    try {
      await approveAdminCourse(courseId);
      setCourse((prev) => prev ? {
        ...prev,
        status: 'published',
        isPublished: true,
        isApproved: true
      } : prev);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve course.');
    }
  };

  return (
    <div className="dashboard">
      <Header title="Course Details" />
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

            <div className="chart-card course-details-toolbar">
              <button className="back-btn-admin" onClick={() => navigate('/admin/courses')}>
                <FaArrowLeft /> Back to Courses
              </button>
              {course?.status === 'pending' && (
                <button className="approve-course-btn" onClick={handleApprove}>
                  Approve Course
                </button>
              )}
            </div>

            {error && <div className="error-message">{error}</div>}

            {loading ? (
              <div className="chart-card"><p>Loading course details...</p></div>
            ) : !course ? (
              <div className="chart-card"><p>Course not found.</p></div>
            ) : (
              <>
                <div className="chart-card course-hero-card">
                  <div className="course-hero-layout">
                    <img
                      src={course.thumbnail || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800'}
                      alt={course.title}
                      className="course-hero-image"
                    />

                    <div className="course-hero-content">
                      <div className="course-hero-top">
                        <span className="course-category">{course.category}</span>
                        <span className={`course-badge status-${course.status}`}>{course.status}</span>
                      </div>

                      <h2 className="course-hero-title">{course.title}</h2>
                      <p className="course-hero-description">{course.shortDescription || course.description}</p>

                      <div className="course-hero-meta">
                        <span><FaUsers /> {course.totalEnrollments || 0} Students</span>
                        <span><FaStar /> {Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0})</span>
                        <span><FaClock /> {formatDuration(course.totalDuration || 0)}</span>
                        <span><FaBookOpen /> {overview.lessons} Lessons</span>
                      </div>

                      <div className="course-hero-price">
                        {course.priceType === 'free' ? 'Free' : `$${getFinalPrice(course).toFixed(2)}`}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon purple"><FaBookOpen /></div>
                      <span className="stat-label">Sections</span>
                    </div>
                    <p className="stat-value">{overview.sections}</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon cyan"><FaCheckCircle /></div>
                      <span className="stat-label">Lessons</span>
                    </div>
                    <p className="stat-value">{overview.lessons}</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon pink"><FaUsers /></div>
                      <span className="stat-label">Enrollments</span>
                    </div>
                    <p className="stat-value">{overview.students}</p>
                  </div>

                  <div className="stat-card">
                    <div className="stat-header">
                      <div className="stat-icon purple-gradient"><FaMoneyBillWave /></div>
                      <span className="stat-label">Revenue</span>
                    </div>
                    <p className="stat-value">${Number(course.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                </div>

                <div className="course-details-grid">
                  <div className="chart-card course-detail-section">
                    <h3 className="chart-title">Instructor</h3>
                    <div className="instructor-detail-card">
                      <img
                        src={course.formateur?.profilePicture || 'https://via.placeholder.com/80'}
                        alt={course.formateur?.fullName || 'Instructor'}
                        className="instructor-detail-avatar"
                      />
                      <div>
                        <h4>{course.formateur?.fullName || 'Unknown Instructor'}</h4>
                        <p>{course.formateur?.email || 'No email available'}</p>
                        <p>{course.formateur?.field || 'No field specified'}</p>
                        <p>{course.formateur?.bio || 'No biography available.'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="chart-card course-detail-section">
                    <h3 className="chart-title">Requirements</h3>
                    {(course.requirements || []).length === 0 ? (
                      <p>No requirements added.</p>
                    ) : (
                      <ul className="course-list-admin">
                        {course.requirements.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="chart-card course-detail-section">
                    <h3 className="chart-title">Learning Outcomes</h3>
                    {(course.learningOutcomes || []).length === 0 ? (
                      <p>No learning outcomes added.</p>
                    ) : (
                      <ul className="course-list-admin">
                        {course.learningOutcomes.map((item, index) => (
                          <li key={`${item}-${index}`}>{item}</li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="chart-card course-detail-section">
                    <h3 className="chart-title">Top Enrolled Students</h3>
                    {(course.enrolledStudents || []).length === 0 ? (
                      <p>No students enrolled yet.</p>
                    ) : (
                      <div className="student-mini-list">
                        {course.enrolledStudents.slice(0, 5).map((enrollment) => (
                          <div key={enrollment.student?._id || enrollment._id} className="student-mini-card">
                            <img
                              src={enrollment.student?.profilePicture || 'https://via.placeholder.com/44'}
                              alt={enrollment.student?.fullName || 'Student'}
                            />
                            <div>
                              <strong>{enrollment.student?.fullName || 'Student'}</strong>
                              <span>{enrollment.student?.email || 'No email'}</span>
                            </div>
                            <span className="student-progress-badge">{enrollment.progress || 0}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="chart-card course-detail-section">
                  <h3 className="chart-title">Course Content</h3>
                  {(course.sections || []).length === 0 ? (
                    <p>No sections available.</p>
                  ) : (
                    <div className="admin-sections-list">
                      {course.sections.map((section, sectionIndex) => (
                        <div key={section._id || sectionIndex} className="admin-section-card">
                          <div className="admin-section-header">
                            <h4>{section.order}. {section.title}</h4>
                            <span>{section.lessons?.length || 0} lessons</span>
                          </div>
                          {section.description && <p className="admin-section-description">{section.description}</p>}
                          <div className="admin-lessons-list">
                            {(section.lessons || []).map((lesson, lessonIndex) => (
                              <div key={lesson._id || lessonIndex} className="admin-lesson-row">
                                <div>
                                  <strong>{lesson.order}. {lesson.title}</strong>
                                  <span>{lesson.type}</span>
                                </div>
                                <span>{formatDuration(lesson.duration || 0)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="chart-card course-detail-section">
                  <h3 className="chart-title">Recent Reviews</h3>
                  {(course.reviews || []).length === 0 ? (
                    <p>No reviews yet.</p>
                  ) : (
                    <div className="admin-reviews-list">
                      {course.reviews.slice(0, 5).map((review) => (
                        <div key={review._id} className="admin-review-card">
                          <div className="admin-review-top">
                            <strong>{review.user?.fullName || 'Student'}</strong>
                            <span><FaStar /> {review.rating}</span>
                          </div>
                          <p>{review.comment || 'No comment provided.'}</p>
                        </div>
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

export default CourseDetails;
