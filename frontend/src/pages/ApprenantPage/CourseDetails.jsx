import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaStar, FaClock, FaUsers, FaBookOpen, FaPlayCircle,
  FaCheckCircle, FaArrowLeft, FaDownload, FaMobileAlt,
  FaTv, FaInfinity, FaTasks, FaCertificate, FaHeart,
  FaShareAlt
} from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import {
  getCourseDetails, enrollInCourse,
  getCourseComments, postCourseComment, postCourseReview
} from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';
import { getUserAvatar } from '../../utils/userAvatar';
import './CourseDetails.css';

const CourseDetails = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [openSection, setOpenSection] = useState(null);
  const [inWishlist, setInWishlist] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', comment: '' });
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCourseDetails(id)
      .then(r => setCourse(r.data?.data))
      .catch(e => setError(e.response?.data?.message || t('errorOccurred')))
      .finally(() => setLoading(false));

    setCommentsLoading(true);
    getCourseComments(id)
      .then(r => setComments(r.data?.data || []))
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!course) return;

    const isFree = course.priceType === 'free' || Number(course.price || 0) === 0;
    if (!isFree) {
      navigate(`/apprenant/course/${id}/checkout`, {
        state: {
          isPaid: true,
          price: course.price,
          title: course.title,
        },
      });
      return;
    }

    try {
      setEnrolling(true);
      setError('');
      await enrollInCourse(id);
      setSuccess(t('apprenant.enrolledSuccessfully'));
      setCourse(prev => ({ ...prev, totalEnrollments: (prev.totalEnrollments || 0) + 1 }));
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.response?.data?.message || t('errorOccurred'));
    } finally {
      setEnrolling(false);
    }
  };

  const handleStartLearning = () => {
    const isFree = course?.priceType === 'free' || Number(course?.price || 0) === 0;
    if (!isFree) {
      navigate(`/apprenant/course/${id}/checkout`, {
        state: {
          isPaid: true,
          price: course?.price,
          title: course?.title,
        },
      });
      return;
    }

    navigate(`/apprenant/course/${id}/learn`);
  };

  const handleSubmitComment = async e => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.comment) return;
    try {
      setSubmitting(true);
      await postCourseComment(id, {
        name: formData.name, email: formData.email,
        subject: formData.subject, content: formData.comment
      });
      setFormData({ name: '', email: '', subject: '', comment: '' });
      const r = await getCourseComments(id);
      setComments(r.data?.data || []);
      setSuccess('Comment added!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (e) {
      setError(e.response?.data?.message || 'Error posting comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async e => {
    e.preventDefault();
    if (!reviewRating || !reviewText) {
      setError('Please choose a rating and write a review.');
      setTimeout(() => setError(''), 3000);
      return;
    }

    try {
      setReviewSubmitting(true);
      setError('');
      await postCourseReview(id, {
        rating: reviewRating,
        comment: reviewText
      });

      setReviewRating(5);
      setReviewText('');
      const details = await getCourseDetails(id);
      setCourse(details.data?.data);
      setSuccess('Review submitted!');
      setTimeout(() => setSuccess(''), 2500);
    } catch (e) {
      setError(e.response?.data?.message || 'Error submitting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  const fmt = (min = 0) => {
    const h = Math.floor(min / 60), m = min % 60;
    return h > 0 ? `${h}hr ${m > 0 ? m + 'min' : ''}`.trim() : `${m}min`;
  };

  if (loading) {
    return (
      <ApprenantLayout title="Course Details" breadcrumb={[{ to: '/', label: 'Home' }]}>
        <div className="course-details__loading">Loading...</div>
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
  const price = isFree ? 'FREE' : `$${Number(course.price || 0).toFixed(2)}`;
  const originalPrice = isFree ? null : course.originalPrice ? `$${Number(course.originalPrice).toFixed(2)}` : null;
  const discount = course.discount?.percentage;
  const previewUrl = course.videoUrl || course.sections?.flatMap(sec => sec.lessons || []).find(lesson => lesson.type === 'video')?.content;
  const isPreviewVideo = previewUrl && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(previewUrl);

  const includes = [
    { icon: <FaPlayCircle />, text: `${fmt(course.totalDuration)} on-demand video` },
    { icon: <FaDownload />, text: `${course.resources || 0} downloadable resources` },
    { icon: <FaInfinity />, text: 'Full lifetime access' },
    { icon: <FaMobileAlt />, text: 'Access on mobile and TV' },
    { icon: <FaTasks />, text: 'Assignments' },
    { icon: <FaCertificate />, text: 'Certificate of Completion' },
  ];

  const features = [
    { label: 'Enrolled', value: `${course.totalEnrollments || 0} students` },
    { label: 'Duration', value: `${course.totalDuration || 0} hours` },
    { label: 'Chapters', value: `${course.sections?.length || 0}` },
    { label: 'Video', value: `${Math.round((course.totalDuration || 0) / 60)} hours` },
    { label: 'Level', value: course.level || 'Beginner' },
  ];

  return (
    <ApprenantLayout>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      {/* ── Back button ── */}
      <button className="course-details__back-btn" onClick={() => navigate('/apprenant/courses')}>
        <FaArrowLeft /> Back to Courses
      </button>


<div className="course-details__header">
        <div className="course-details__hero" onClick={handleStartLearning}>
          <img
            src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours.jpg')}
            alt={course.title}
          />
        </div>

        <div className="course-details__grid">
          <div className="course-details__info">
          {/* badges row */}
          <div className="course-details__badges">
            {course.category && <span className="course-details__badge--category">{course.category}</span>}
            {course.level && <span className="course-details__badge--level">{course.level}</span>}
          </div>

          <h1 className="course-details__title">{course.title}</h1>
          <p className="course-details__description">{course.description}</p>

          {/* Meta stats */}
          <div className="course-details__meta">
            <span className="course-details__meta-item">
              <FaBookOpen /> {course.sections?.length || 0}+ Lesson
            </span>
            <span className="course-details__meta-item">
              <FaClock /> {fmt(course.totalDuration || 0)}
            </span>
            <span className="course-details__meta-item">
              <FaUsers /> {course.totalEnrollments || 0} students enrolled
            </span>
          </div>

          {/* Rating */}
          <div className="course-details__rating">
            {[1,2,3,4,5].map(s => (
              <FaStar
                key={s}
                className={`course-details__star ${s <= Math.round(course.averageRating || 0) ? 'course-details__star--filled' : ''}`}
              />
            ))}
            <span className="course-details__rating-value">{Number(course.averageRating || 0).toFixed(1)}</span>
            <span className="course-details__rating-count">({course.totalReviews || 0})</span>
          </div>

          {/* Instructor */}
          <div className="course-details__instructor">
            <img
              src={getUserAvatar(course.formateur)}
              alt={course.formateur?.fullName}
              className="course-details__instructor-avatar"
            />
            <div>
              <span className="course-details__instructor-name">{course.formateur?.fullName || 'Instructor'}</span>
              <span className="course-details__instructor-role">Instructor</span>
            </div>
          </div>
        </div>

        {/* Right sidebar: price card */}
        <div className="course-details__price-card">
          <div className="course-details__price-top">
            <span className={`course-details__price ${isFree ? 'course-details__price--free' : ''}`}>{price}</span>
            {originalPrice && <span className="course-details__price-original">{originalPrice}</span>}
            {discount && <span className="course-details__discount">{discount}% off</span>}
          </div>

          <div className="course-details__actions">
            <button
              className={`course-details__wishlist-btn ${inWishlist ? 'course-details__wishlist-btn--active' : ''}`}
              onClick={() => setInWishlist(v => !v)}
            >
              <FaHeart /> {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button className="course-details__share-btn">
              <FaShareAlt /> Share
            </button>
          </div>

          <button
            className="course-details__enroll-btn"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
          <button
            type="button"
            className="course-details__learn-btn"
            onClick={handleStartLearning}
          >
            Start Learning
          </button>

          {/* Includes */}
          <div className="course-details__includes">
            <p className="course-details__includes-title">Includes</p>
            <ul className="course-details__includes-list">
              {includes.map((item, i) => (
                <li key={i} className="course-details__includes-item">
                  <span className="course-details__includes-icon">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Features */}
          <div className="course-details__features">
            <p className="course-details__includes-title">Course Features</p>
            <ul className="course-details__features-list">
              {features.map((f, i) => (
                <li key={i} className="course-details__feature-item">
                  <span className="course-details__feature-label">{f.label}</span>
                  <span className="course-details__feature-value">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>

      {/* ══════════════════════════════════════════
          OVERVIEW SECTION
      ══════════════════════════════════════════ */}
      <div className="course-details__section">
        <h2 className="course-details__section-title">Overview</h2>

        {/* Course Description */}
        {course.description && (
          <>
            <h3 className="course-details__section-subtitle">Course Description</h3>
            <p className="course-details__text">{course.description}</p>
          </>
        )}

        {/* What you'll learn */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <>
            <h3 className="course-details__section-subtitle">What you'll learn</h3>
            <ul className="course-details__learn-list">
              {course.learningOutcomes.map((item, i) => (
                <li key={i} className="course-details__learn-item">
                  <FaCheckCircle className="course-details__check-icon" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <>
            <h3 className="course-details__section-subtitle">Requirements</h3>
            <ul className="course-details__requirements-list">
              {course.requirements.map((req, i) => (
                <li key={i}>{req}</li>
              ))}
            </ul>
          </>
        )}
      </div>

      {/* ══════════════════════════════════════════
          CURRICULUM / COURSE CONTENT
      ══════════════════════════════════════════ */}
      {course.sections && course.sections.length > 0 && (
        <div className="course-details__section">
          <h2 className="course-details__section-title">Course Content</h2>
          <div className="course-details__curriculum">
            {course.sections.map((sec, idx) => (
              <div key={sec._id || idx} className="course-details__section-item">
                <button
                  className={`course-details__section-header ${openSection === idx ? 'course-details__section-header--open' : ''}`}
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <span className="course-details__section-item-title">{sec.title}</span>
                  <span className="course-details__section-duration">{fmt(sec.duration)}</span>
                  <span className="course-details__section-arrow">{openSection === idx ? '▲' : '▼'}</span>
                </button>
                {openSection === idx && sec.lessons && sec.lessons.length > 0 && (
                  <div className="course-details__lessons">
                    {sec.lessons.map((lesson, li) => (
                      <div key={lesson._id || li} className="course-details__lesson">
                        <FaCheckCircle className="course-details__lesson-icon" />
                        <span className="course-details__lesson-title">{lesson.title}</span>
                        <span className="course-details__lesson-duration">{fmt(lesson.duration)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          INSTRUCTOR SECTION
      ══════════════════════════════════════════ */}
      {course.formateur && (
        <div className="course-details__section">
          <h2 className="course-details__section-title">About the instructor</h2>
          <div className="course-details__instructor-card">
            <img
              src={getUserAvatar(course.formateur)}
              alt={course.formateur.fullName}
              className="course-details__instructor-avatar-lg"
            />
            <div className="course-details__instructor-info">
              <h3 className="course-details__instructor-name-lg">{course.formateur.fullName}</h3>
              {course.formateur.specialty && (
                <p className="course-details__instructor-specialty">{course.formateur.specialty}</p>
              )}
              <div className="course-details__instructor-stats">
                <span><FaStar className="course-details__star course-details__star--filled" /> {Number(course.formateur.rating || 4.5).toFixed(1)}</span>
                <span><FaUsers /> {course.formateur.totalStudents || 0} students</span>
                <span><FaBookOpen /> {course.formateur.totalCourses || 0} Courses</span>
              </div>
              {course.formateur.bio && <p className="course-details__instructor-bio">{course.formateur.bio}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════
          REVIEW SECTION
      ══════════════════════════════════════════ */}
      <div className="course-details__section">
        <h2 className="course-details__section-title">Leave a Review</h2>

        <form className="course-details__form" onSubmit={handleSubmitReview}>
          <div className="course-details__form-group">
            <label>Rating</label>
            <div className="course-details__stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`course-details__star-btn${reviewRating >= star ? ' course-details__star-btn--filled' : ''}`}
                  onClick={() => setReviewRating(star)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
          <div className="course-details__form-group">
            <label>Your review</label>
            <textarea
              rows={5}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Share your experience with this course"
              required
            />
          </div>
          <button type="submit" className="course-details__submit-btn" disabled={reviewSubmitting}>
            {reviewSubmitting ? 'Submitting review...' : 'Submit review'}
          </button>
        </form>
      </div>

      {/* ══════════════════════════════════════════
          COMMENTS SECTION
      ══════════════════════════════════════════ */}
      <div className="course-details__section">
        <h2 className="course-details__section-title">Post A Comment</h2>

        <form className="course-details__form" onSubmit={handleSubmitComment}>
          <div className="course-details__form-row">
            <div className="course-details__form-group">
              <label>Name</label>
              <input
                type="text" name="name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div className="course-details__form-group">
              <label>Email</label>
              <input
                type="email" name="email"
                value={formData.email}
                onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                placeholder="Your email"
                required
              />
            </div>
          </div>
          <div className="course-details__form-group">
            <label>Subject</label>
            <input
              type="text" name="subject"
              value={formData.subject}
              onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
              placeholder="Subject (optional)"
            />
          </div>
          <div className="course-details__form-group">
            <label>Comments</label>
            <textarea
              name="comment" rows={5}
              value={formData.comment}
              onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))}
              placeholder="Write your comment here..."
              required
            />
          </div>
          <button type="submit" className="course-details__submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Comments list */}
        {commentsLoading ? (
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="course-details__comments">
            <h3 className="course-details__section-subtitle">All Comments ({comments.length})</h3>
            {comments.map(c => (
              <div key={c._id || c.id} className="course-details__comment">
                <div className="course-details__comment-avatar">
                  {(c.name || 'U')[0].toUpperCase()}
                </div>
                <div className="course-details__comment-body">
                  <div className="course-details__comment-header">
                    <span className="course-details__comment-author">{c.name}</span>
                    {c.subject && <span className="course-details__comment-subject">{c.subject}</span>}
                    <span className="course-details__comment-date">
                      {new Date(c.createdAt || c.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="course-details__comment-text">{c.content || c.comment}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="course-details__no-comments">No comments yet. Be the first!</p>
        )}
      </div>
    </ApprenantLayout>
  );
};

export default CourseDetails;
