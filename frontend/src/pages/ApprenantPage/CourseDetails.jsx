import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft,
  FaBookOpen,
  FaCertificate,
  FaCheckCircle,
  FaClock,
  FaDownload,
  FaHeart,
  FaInfinity,
  FaMobileAlt,
  FaPlayCircle,
  FaShareAlt,
  FaStar,
  FaTasks,
  FaUsers
} from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import {
  enrollInCourse,
  getCourseComments,
  getCourseDetails,
  postCourseComment,
  submitQuizAttempt
} from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';
import './CourseDetails.css';

const emptyCommentForm = { name: '', email: '', subject: '', comment: '' };

const formatDuration = (minutes = 0) => {
  const totalMinutes = Number(minutes || 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}hr ${mins > 0 ? `${mins}min` : ''}`.trim();
  }

  return `${mins}min`;
};

const CourseDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [activeQuizLessonId, setActiveQuizLessonId] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [formData, setFormData] = useState(emptyCommentForm);

  const loadCourse = useCallback(async () => {
    const response = await getCourseDetails(id);
    setCourse(response.data?.data || null);
  }, [id]);

  const loadComments = useCallback(async () => {
    setCommentsLoading(true);
    try {
      const response = await getCourseComments(id);
      setComments(response.data?.data || []);
    } catch (loadError) {
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const bootstrap = async () => {
      setLoading(true);
      setError('');

      try {
        await Promise.all([loadCourse(), loadComments()]);
      } catch (loadError) {
        setError(loadError.response?.data?.message || t('errorOccurred'));
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [id, loadComments, loadCourse, t]);

  const handleEnroll = async () => {
    try {
      setEnrolling(true);
      setError('');
      await enrollInCourse(id);
      await loadCourse();
      setSuccess(t('apprenant.enrolledSuccessfully'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || t('errorOccurred'));
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitComment = async (event) => {
    event.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) {
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      await postCourseComment(id, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        content: formData.comment
      });
      setFormData(emptyCommentForm);
      await loadComments();
      setSuccess('Comment added!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error posting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const prepareQuiz = (lesson) => {
    const initialAnswers = {};
    (lesson.quiz?.questions || []).forEach((question) => {
      initialAnswers[question._id] = '';
    });

    setActiveQuizLessonId(lesson._id);
    setQuizAnswers(initialAnswers);
    setError('');
    setSuccess('');
  };

  const handleQuizAnswerChange = (questionId, value) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmitQuiz = async (lesson) => {
    const answers = (lesson.quiz?.questions || []).map((question) => ({
      questionId: question._id,
      selectedAnswer: quizAnswers[question._id] || ''
    }));

    try {
      setSubmittingQuiz(true);
      setError('');
      const response = await submitQuizAttempt(id, lesson._id, answers);
      const result = response.data?.data;

      await loadCourse();
      setActiveQuizLessonId(null);
      setQuizAnswers({});
      setSuccess(
        result?.passed
          ? `Quiz passed with ${result.percentageScore}%`
          : `Quiz submitted with ${result?.percentageScore || 0}%.`
      );
      setTimeout(() => setSuccess(''), 3500);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error submitting quiz');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  if (loading) {
    return (
      <ApprenantLayout title="Course Details" breadcrumb={[{ to: '/', label: 'Home' }]}>
        <div className="cd-loading">Loading...</div>
      </ApprenantLayout>
    );
  }

  if (!course) {
    return (
      <ApprenantLayout title="Course Details" breadcrumb={[{ to: '/', label: 'Home' }]}>
        <div className="error-message">Course not found.</div>
      </ApprenantLayout>
    );
  }

  const isFree = course.priceType === 'free';
  const isEnrolled = Boolean(course.enrolledAt);
  const price = isFree ? 'FREE' : `$${Number(course.price || 0).toFixed(2)}`;
  const originalPrice = isFree ? null : course.originalPrice ? `$${Number(course.originalPrice).toFixed(2)}` : null;
  const discount = course.discount?.percentage;
  const quizCount = (course.sections || []).reduce(
    (sum, section) => sum + (section.lessons || []).filter((lesson) => lesson.type === 'quiz').length,
    0
  );

  const includes = [
    { icon: <FaPlayCircle />, text: `${formatDuration(course.totalDuration)} on-demand video` },
    { icon: <FaDownload />, text: `${quizCount} quiz lesson(s)` },
    { icon: <FaInfinity />, text: 'Full lifetime access' },
    { icon: <FaMobileAlt />, text: 'Access on mobile and TV' },
    { icon: <FaTasks />, text: `${quizCount} integrated quizzes` },
    { icon: <FaCertificate />, text: 'Certificate of Completion' }
  ];

  const features = [
    { label: 'Enrolled', value: `${course.totalEnrollments || 0} students` },
    { label: 'Duration', value: formatDuration(course.totalDuration || 0) },
    { label: 'Chapters', value: `${course.sections?.length || 0}` },
    { label: 'Quizzes', value: `${quizCount}` },
    { label: 'Level', value: course.level || 'Beginner' }
  ];

  return (
    <ApprenantLayout
      title={course.title}
      breadcrumb={[
        { to: '/', label: 'Home' },
        { to: '/apprenant/courses', label: 'Courses' },
        { label: course.title }
      ]}
      rightContent={<><div className="notification-icon" /><div className="cart-icon" /></>}
    >
      <CardP />

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button className="cd-back-btn" onClick={() => navigate('/apprenant/courses')}>
        <FaArrowLeft /> Back to Courses
      </button>

      <div className="cd-header-card">
        <div className="cd-header-thumb">
          <img
            src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours.jpg')}
            alt={course.title}
          />
          <div className="cd-header-thumb-overlay">
            <FaPlayCircle className="cd-play-icon" />
          </div>
        </div>

        <div className="cd-header-info">
          <div className="cd-badges-row">
            {course.category && <span className="cd-badge-cat">{course.category}</span>}
            {course.level && <span className="cd-badge-level">{course.level}</span>}
            {quizCount > 0 && <span className="cd-badge-level">Quiz Ready</span>}
          </div>

          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-desc">{course.description}</p>

          <div className="cd-meta-row">
            <span className="cd-meta-item">
              <FaBookOpen /> {course.sections?.length || 0}+ Lesson
            </span>
            <span className="cd-meta-item">
              <FaClock /> {formatDuration(course.totalDuration || 0)}
            </span>
            <span className="cd-meta-item">
              <FaUsers /> {course.totalEnrollments || 0} students enrolled
            </span>
          </div>

          <div className="cd-rating-row">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cd-star ${star <= Math.round(course.averageRating || 0) ? 'filled' : ''}`}
              />
            ))}
            <span className="cd-rating-val">{Number(course.averageRating || 0).toFixed(1)}</span>
            <span className="cd-rating-count">({course.totalReviews || 0})</span>
          </div>

          <div className="cd-instructor-row">
            <img
              src={getMediaUrl(course.formateur?.profileImage) || require('../../assets/image/student/ava.jpg')}
              alt={course.formateur?.fullName}
              className="cd-inst-avatar"
            />
            <div>
              <span className="cd-inst-name">{course.formateur?.fullName || 'Instructor'}</span>
              <span className="cd-inst-role">Instructor</span>
            </div>
          </div>
        </div>

        <div className="cd-price-card">
          <div className="cd-price-top">
            <span className={`cd-price-main ${isFree ? 'free' : ''}`}>{price}</span>
            {originalPrice && <span className="cd-price-orig">{originalPrice}</span>}
            {discount && <span className="cd-discount">{discount}% off</span>}
          </div>

          <div className="cd-price-actions">
            <button
              className={`cd-wishlist-btn ${inWishlist ? 'active' : ''}`}
              onClick={() => setInWishlist((value) => !value)}
            >
              <FaHeart /> {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button className="cd-share-btn">
              <FaShareAlt /> Share
            </button>
          </div>

          <button className="cd-enroll-btn" onClick={handleEnroll} disabled={enrolling || isEnrolled}>
            {isEnrolled ? 'Already Enrolled' : enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>

          {isEnrolled && typeof course.myProgress === 'number' && (
            <div className="cd-progress-box">
              <strong>Progress</strong>
              <span>{course.myProgress}% completed</span>
            </div>
          )}

          <div className="cd-includes">
            <p className="cd-includes-title">Includes</p>
            <ul className="cd-includes-list">
              {includes.map((item, index) => (
                <li key={index} className="cd-includes-item">
                  <span className="cd-inc-icon">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="cd-features-block">
            <p className="cd-includes-title">Course Features</p>
            <ul className="cd-features-list">
              {features.map((feature, index) => (
                <li key={index} className="cd-feature-item">
                  <span className="cd-feat-label">{feature.label}</span>
                  <span className="cd-feat-value">{feature.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="cd-section-card">
        <h2 className="cd-section-h2">Overview</h2>

        {course.description && (
          <>
            <h3 className="cd-section-h3">Course Description</h3>
            <p className="cd-section-text">{course.description}</p>
          </>
        )}

        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <>
            <h3 className="cd-section-h3">What you'll learn</h3>
            <ul className="cd-learn-list">
              {course.learningOutcomes.map((item, index) => (
                <li key={index} className="cd-learn-item">
                  <FaCheckCircle className="cd-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {course.requirements && course.requirements.length > 0 && (
          <>
            <h3 className="cd-section-h3">Requirements</h3>
            <ul className="cd-req-list">
              {course.requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {course.sections && course.sections.length > 0 && (
        <div className="cd-section-card">
          <h2 className="cd-section-h2">Course Content</h2>
          <div className="cd-curriculum">
            {course.sections.map((section, sectionIndex) => (
              <div key={section._id || sectionIndex} className="cd-sec-item">
                <button
                  className={`cd-sec-header ${openSection === sectionIndex ? 'open' : ''}`}
                  onClick={() => setOpenSection(openSection === sectionIndex ? null : sectionIndex)}
                >
                  <span className="cd-sec-title">{section.title}</span>
                  <span className="cd-sec-dur">{(section.lessons || []).length} lessons</span>
                  <span className="cd-sec-arrow">{openSection === sectionIndex ? '▲' : '▼'}</span>
                </button>

                {openSection === sectionIndex && section.lessons && section.lessons.length > 0 && (
                  <div className="cd-lessons">
                    {section.lessons.map((lesson, lessonIndex) => {
                      const latestAttempt = lesson.quizSummary?.latestAttempt;
                      const isActiveQuiz = activeQuizLessonId === lesson._id;

                      return (
                        <div key={lesson._id || lessonIndex} className={`cd-lesson-item ${lesson.type === 'quiz' ? 'quiz' : ''}`}>
                          <FaCheckCircle className="cd-lesson-icon" />
                          <div className="cd-lesson-main">
                            <span className="cd-lesson-title">{lesson.title}</span>
                            {lesson.description && (
                              <span className="cd-lesson-subtitle">{lesson.description}</span>
                            )}
                            {lesson.type === 'quiz' && (
                              <div className="cd-quiz-meta">
                                <span>{lesson.quiz?.questions?.length || 0} question(s)</span>
                                <span>Pass score {lesson.quiz?.passingScore || 50}%</span>
                                {latestAttempt && (
                                  <span className={latestAttempt.passed ? 'passed' : 'failed'}>
                                    Latest {latestAttempt.percentageScore}% {latestAttempt.passed ? 'passed' : 'failed'}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="cd-lesson-dur">{formatDuration(lesson.duration)}</span>

                          {lesson.type === 'quiz' && (
                            <button
                              className="cd-quiz-toggle-btn"
                              onClick={() => prepareQuiz(lesson)}
                              disabled={!isEnrolled}
                            >
                              {!isEnrolled ? 'Enroll to unlock' : latestAttempt ? 'Retake Quiz' : 'Start Quiz'}
                            </button>
                          )}

                          {isActiveQuiz && lesson.type === 'quiz' && (
                            <div className="cd-quiz-panel">
                              {lesson.quiz?.instructions && (
                                <p className="cd-quiz-instructions">{lesson.quiz.instructions}</p>
                              )}

                              {(lesson.quiz?.questions || []).map((question, questionIndex) => (
                                <div key={question._id} className="cd-quiz-question-card">
                                  <div className="cd-quiz-question-head">
                                    <strong>{questionIndex + 1}. {question.prompt}</strong>
                                    <span>{question.points || 1} pt</span>
                                  </div>

                                  {(question.type === 'multiple-choice' || question.type === 'true-false') ? (
                                    <div className="cd-quiz-options">
                                      {(question.options || []).map((option, optionIndex) => (
                                        <label key={`${question._id}-${optionIndex}`} className="cd-quiz-option">
                                          <input
                                            type="radio"
                                            name={`question-${question._id}`}
                                            value={option.text}
                                            checked={quizAnswers[question._id] === option.text}
                                            onChange={(event) => handleQuizAnswerChange(question._id, event.target.value)}
                                          />
                                          <span>{option.text}</span>
                                        </label>
                                      ))}
                                    </div>
                                  ) : (
                                    <textarea
                                      className="cd-quiz-textarea"
                                      rows="3"
                                      value={quizAnswers[question._id] || ''}
                                      onChange={(event) => handleQuizAnswerChange(question._id, event.target.value)}
                                      placeholder="Write your answer"
                                    />
                                  )}
                                </div>
                              ))}

                              <div className="cd-quiz-actions">
                                <button
                                  className="cd-submit-btn"
                                  onClick={() => handleSubmitQuiz(lesson)}
                                  disabled={submittingQuiz}
                                >
                                  {submittingQuiz ? 'Submitting...' : 'Submit Quiz'}
                                </button>
                                <button
                                  className="cd-quiz-cancel-btn"
                                  onClick={() => {
                                    setActiveQuizLessonId(null);
                                    setQuizAnswers({});
                                  }}
                                  disabled={submittingQuiz}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {course.formateur && (
        <div className="cd-section-card">
          <h2 className="cd-section-h2">About the instructor</h2>
          <div className="cd-instructor-card">
            <img
              src={getMediaUrl(course.formateur.profileImage) || require('../../assets/image/student/ava.jpg')}
              alt={course.formateur.fullName}
              className="cd-inst-big-avatar"
            />
            <div className="cd-inst-info">
              <h3 className="cd-inst-big-name">{course.formateur.fullName}</h3>
              <div className="cd-inst-stats">
                <span><FaStar className="cd-star filled" /> {Number(course.formateur.rating || 4.5).toFixed(1)}</span>
                <span><FaUsers /> {course.formateur.totalStudents || 0} students</span>
                <span><FaBookOpen /> {course.formateur.totalCourses || 0} Courses</span>
              </div>
              {course.formateur.bio && <p className="cd-inst-bio">{course.formateur.bio}</p>}
            </div>
          </div>
        </div>
      )}

      <div className="cd-section-card">
        <h2 className="cd-section-h2">Post A Comment</h2>

        <form className="cd-comment-form" onSubmit={handleSubmitComment}>
          <div className="cd-form-row">
            <div className="cd-form-group">
              <label>Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div className="cd-form-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div className="cd-form-group">
            <label>Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(event) => setFormData((prev) => ({ ...prev, subject: event.target.value }))}
              placeholder="Subject (optional)"
            />
          </div>
          <div className="cd-form-group">
            <label>Comments</label>
            <textarea
              rows={5}
              value={formData.comment}
              onChange={(event) => setFormData((prev) => ({ ...prev, comment: event.target.value }))}
              placeholder="Write your comment here..."
              required
            />
          </div>
          <button type="submit" className="cd-submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {commentsLoading ? (
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="cd-comments-list">
            <h3 className="cd-section-h3">All Comments ({comments.length})</h3>
            {comments.map((comment) => (
              <div key={comment._id || comment.id} className="cd-comment-item">
                <div className="cd-comment-avatar">
                  {(comment.name || 'U')[0].toUpperCase()}
                </div>
                <div className="cd-comment-body">
                  <div className="cd-comment-header">
                    <span className="cd-comment-author">{comment.name}</span>
                    {comment.subject && <span className="cd-comment-subject">{comment.subject}</span>}
                    <span className="cd-comment-date">
                      {new Date(comment.createdAt || comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="cd-comment-text">{comment.content || comment.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="cd-no-comments">No comments yet. Be the first!</p>
        )}
      </div>
    </ApprenantLayout>
  );
};

export default CourseDetails;
