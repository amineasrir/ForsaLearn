import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/course-details-admin.css';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCheckCircle,
  FaClock,
  FaCubes,
  FaDollarSign,
  FaStar,
  FaUsers,
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import {
  approveAdminCourse,
  getAdminCourseDetails,
  getAdminProfile,
} from '../../services/adminService';

/* ─────────────────────────── helpers ─────────────────────────── */
const formatDuration = (minutes = 0) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (!h) return `${m}m`;
  return `${h}h ${m}m`;
};

const getFinalPrice = (course) => {
  const disc = course?.discount?.percentage || 0;
  if (course?.priceType === 'free') return 0;
  if (disc > 0) {
    return Number(course.price || 0) - (Number(course.price || 0) * disc) / 100;
  }
  return Number(course?.price || 0);
};

const StarRow = ({ rating }) => {
  const full = Math.round(rating);
  return (
    <span className="cd-star-row">
      {[1, 2, 3, 4, 5].map((i) => (
        <FaStar key={i} className={i <= full ? 'star-filled' : 'star-empty'} />
      ))}
    </span>
  );
};

/* ─────────────────────────── component ───────────────────────── */
const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [courseRes, profileRes] = await Promise.all([
          getAdminCourseDetails(courseId),
          getAdminProfile(),
        ]);
        setCourse(courseRes.data?.data || null);
        setProfile(profileRes.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load course details.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const overview = useMemo(
    () => ({
      sections: course?.sections?.length || 0,
      lessons: (course?.sections || []).reduce(
        (sum, s) => sum + (s.lessons?.length || 0),
        0
      ),
      students: course?.totalEnrollments || 0,
    }),
    [course]
  );

  const handleApprove = async () => {
    try {
      await approveAdminCourse(courseId);
      setCourse((prev) =>
        prev
          ? { ...prev, status: 'published', isPublished: true, isApproved: true }
          : prev
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve course.');
    }
  };

  const finalPrice = course ? getFinalPrice(course) : 0;
  const hasDiscount = (course?.discount?.percentage || 0) > 0;

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

            {error && <div className="cd-error">{error}</div>}

            {loading ? (
              <div className="cd-state-card">
                <p>Loading course details…</p>
              </div>
            ) : !course ? (
              <div className="cd-state-card">
                <p>Course not found.</p>
              </div>
            ) : (
              <>
                {/* ── HERO ───────────────────────────────────── */}
                <div className="cd-hero">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=1200'
                    }
                    alt={course.title}
                    className="cd-hero-img"
                  />
                  <div className="cd-hero-overlay" />

                  <div className="cd-hero-content">
                    <div className="cd-hero-badges">
                      <span className="cd-badge cd-badge-cat">{course.category}</span>
                      <span
                        className={`cd-badge cd-badge-status cd-badge-${course.status}`}
                      >
                        {course.status}
                      </span>
                    </div>

                    <h1 className="cd-hero-title">{course.title}</h1>
                    <p className="cd-hero-desc">
                      {course.shortDescription || course.description}
                    </p>

                    <div className="cd-hero-meta">
                      <span>
                        <FaUsers /> {course.totalEnrollments || 0} Students
                      </span>
                      <span>
                        <FaStar /> {Number(course.averageRating || 0).toFixed(1)}{' '}
                        ({course.totalReviews || 0} reviews)
                      </span>
                      <span>
                        <FaClock /> {formatDuration(course.totalDuration || 0)}
                      </span>
                      <span>
                        <FaBookOpen /> {overview.lessons} Lessons
                      </span>
                    </div>

                    <div className="cd-hero-price-block">
                      <div className="cd-hero-price">
                        {course.priceType === 'free'
                          ? 'Free'
                          : `$${finalPrice.toFixed(2)}`}
                      </div>
                      {hasDiscount && course.priceType !== 'free' && (
                        <div className="cd-hero-price-sub">
                          Original ${Number(course.price).toFixed(2)} ·{' '}
                          {course.discount.percentage}% off
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── TOOLBAR ─────────────────────────────────── */}
                <div className="cd-toolbar">
                  <button
                    className="cd-btn-back"
                    onClick={() => navigate('/admin/courses')}
                  >
                    <FaArrowLeft /> Back to courses
                  </button>
                  {course.status === 'pending' && (
                    <button className="cd-btn-approve" onClick={handleApprove}>
                      <FaCheckCircle /> Approve course
                    </button>
                  )}
                </div>

                {/* ── STATS ───────────────────────────────────── */}
                <div className="cd-stats">
                  {[
                    {
                      icon: <FaCubes />,
                      label: 'Sections',
                      value: overview.sections,
                      mod: 'purple',
                    },
                    {
                      icon: <FaCheckCircle />,
                      label: 'Lessons',
                      value: overview.lessons,
                      mod: 'green',
                    },
                    {
                      icon: <FaUsers />,
                      label: 'Enrollments',
                      value: overview.students.toLocaleString(),
                      mod: 'pink',
                    },
                    {
                      icon: <FaDollarSign />,
                      label: 'Revenue',
                      value: `$${Number(course.totalRevenue || 0).toLocaleString()}`,
                      mod: 'amber',
                    },
                  ].map(({ icon, label, value, mod }) => (
                    <div key={label} className="cd-stat">
                      <div className={`cd-stat-icon cd-si-${mod}`}>{icon}</div>
                      <span className="cd-stat-label">{label}</span>
                      <strong className="cd-stat-value">{value}</strong>
                    </div>
                  ))}
                </div>

                {/* ── 2-COL GRID ──────────────────────────────── */}
                <div className="cd-grid-2">
                  {/* Instructor */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">Instructor</h3>
                    <div className="cd-instr-row">
                      <img
                        src={
                          course.formateur?.profilePicture ||
                          'https://via.placeholder.com/60'
                        }
                        alt={course.formateur?.fullName || 'Instructor'}
                        className="cd-instr-avatar"
                      />
                      <div>
                        <div className="cd-instr-name">
                          {course.formateur?.fullName || 'Unknown Instructor'}
                        </div>
                        <div className="cd-instr-field">
                          {course.formateur?.field || 'No field specified'}
                        </div>
                        <div className="cd-instr-email">
                          {course.formateur?.email || 'No email available'}
                        </div>
                        <p className="cd-instr-bio">
                          {course.formateur?.bio || 'No biography available.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">Requirements</h3>
                    {(course.requirements || []).length === 0 ? (
                      <p className="cd-empty">No requirements added.</p>
                    ) : (
                      <ul className="cd-bullet-list">
                        {course.requirements.map((item, i) => (
                          <li key={`req-${i}`}>
                            <span className="cd-bullet" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Learning Outcomes */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">Learning outcomes</h3>
                    {(course.learningOutcomes || []).length === 0 ? (
                      <p className="cd-empty">No learning outcomes added.</p>
                    ) : (
                      <ul className="cd-bullet-list">
                        {course.learningOutcomes.map((item, i) => (
                          <li key={`lo-${i}`}>
                            <span className="cd-bullet" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Top Students */}
                  <div className="cd-card">
                    <h3 className="cd-card-title">Top enrolled students</h3>
                    {(course.enrolledStudents || []).length === 0 ? (
                      <p className="cd-empty">No students enrolled yet.</p>
                    ) : (
                      <div className="cd-student-list">
                        {course.enrolledStudents.slice(0, 5).map((en) => (
                          <div
                            key={en.student?._id || en._id}
                            className="cd-student-row"
                          >
                            <img
                              src={
                                en.student?.profilePicture ||
                                'https://via.placeholder.com/38'
                              }
                              alt={en.student?.fullName || 'Student'}
                              className="cd-student-avatar"
                            />
                            <div className="cd-student-info">
                              <strong>{en.student?.fullName || 'Student'}</strong>
                              <span>{en.student?.email || 'No email'}</span>
                            </div>
                            <span className="cd-prog-pill">
                              {en.progress || 0}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── COURSE CONTENT ──────────────────────────── */}
                <div className="cd-card">
                  <h3 className="cd-card-title">Course content</h3>
                  {(course.sections || []).length === 0 ? (
                    <p className="cd-empty">No sections available.</p>
                  ) : (
                    <div className="cd-sections">
                      {course.sections.map((section, si) => (
                        <div key={section._id || si} className="cd-section">
                          <div className="cd-section-header">
                            <div className="cd-section-left">
                              <span className="cd-section-num">
                                {section.order}
                              </span>
                              <span className="cd-section-title">
                                {section.title}
                              </span>
                            </div>
                            <span className="cd-section-count">
                              {section.lessons?.length || 0} lessons
                            </span>
                          </div>
                          {section.description && (
                            <p className="cd-section-desc">
                              {section.description}
                            </p>
                          )}
                          <div className="cd-lessons">
                            {(section.lessons || []).map((lesson, li) => (
                              <div key={lesson._id || li} className="cd-lesson-row">
                                <div className="cd-lesson-left">
                                  <span className="cd-lesson-dot" />
                                  <span className="cd-lesson-title">
                                    {lesson.order}. {lesson.title}
                                  </span>
                                  <span className="cd-lesson-type">
                                    {lesson.type}
                                  </span>
                                </div>
                                <span className="cd-lesson-dur">
                                  {formatDuration(lesson.duration || 0)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* ── REVIEWS ─────────────────────────────────── */}
                <div className="cd-card">
                  <h3 className="cd-card-title">Recent reviews</h3>
                  {(course.reviews || []).length === 0 ? (
                    <p className="cd-empty">No reviews yet.</p>
                  ) : (
                    <div className="cd-reviews">
                      {course.reviews.slice(0, 5).map((review) => (
                        <div key={review._id} className="cd-review-card">
                          <div className="cd-review-top">
                            <strong className="cd-review-name">
                              {review.user?.fullName || 'Student'}
                            </strong>
                            <div className="cd-review-rating">
                              <StarRow rating={review.rating} />
                              <span>{review.rating}</span>
                            </div>
                          </div>
                          <p className="cd-review-text">
                            {review.comment || 'No comment provided.'}
                          </p>
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