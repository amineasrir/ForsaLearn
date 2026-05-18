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
      <button className="cd-back-btn" onClick={() => navigate('/apprenant/courses')}>
        <FaArrowLeft /> Back to Courses
      </button>

      {/* ══════════════════════════════════════════
          TOP SECTION: Header card (like screenshot)
      ══════════════════════════════════════════ */}
      <div className="cd-header-card">
        {/* Left: thumbnail */}
        <div className="cd-header-thumb" onClick={handleStartLearning}>
          {previewUrl ? (
            <video
              className="cd-header-video"
              controls
              src={getMediaUrl(previewUrl)}
              poster={getMediaUrl(course.thumbnail)}
            />
          ) : (
            <img
              src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours.jpg')}
              alt={course.title}
            />
          )}
          <div className="cd-header-thumb-overlay">
            <FaPlayCircle className="cd-play-icon" />
          </div>
        </div>

        {/* Right: info */}
        <div className="cd-header-info">
          {/* badges row */}
          <div className="cd-badges-row">
            {course.category && <span className="cd-badge-cat">{course.category}</span>}
            {course.level && <span className="cd-badge-level">{course.level}</span>}
          </div>

          <h1 className="cd-title">{course.title}</h1>
          <p className="cd-desc">{course.description}</p>

          {/* Meta stats */}
          <div className="cd-meta-row">
            <span className="cd-meta-item">
              <FaBookOpen /> {course.sections?.length || 0}+ Lesson
            </span>
            <span className="cd-meta-item">
              <FaClock /> {fmt(course.totalDuration || 0)}
            </span>
            <span className="cd-meta-item">
              <FaUsers /> {course.totalEnrollments || 0} students enrolled
            </span>
          </div>

          {/* Rating */}
          <div className="cd-rating-row">
            {[1,2,3,4,5].map(s => (
              <FaStar
                key={s}
                className={`cd-star ${s <= Math.round(course.averageRating || 0) ? 'filled' : ''}`}
              />
            ))}
            <span className="cd-rating-val">{Number(course.averageRating || 0).toFixed(1)}</span>
            <span className="cd-rating-count">({course.totalReviews || 0})</span>
          </div>

          {/* Instructor */}
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

        {/* Right sidebar: price card */}
        <div className="cd-price-card">
          <div className="cd-price-top">
            <span className={`cd-price-main ${isFree ? 'free' : ''}`}>{price}</span>
            {originalPrice && <span className="cd-price-orig">{originalPrice}</span>}
            {discount && <span className="cd-discount">{discount}% off</span>}
          </div>

          <div className="cd-price-actions">
            <button
              className={`cd-wishlist-btn ${inWishlist ? 'active' : ''}`}
              onClick={() => setInWishlist(v => !v)}
            >
              <FaHeart /> {inWishlist ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            <button className="cd-share-btn">
              <FaShareAlt /> Share
            </button>
          </div>

          <button
            className="cd-enroll-btn"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
          <button
            type="button"
            className="cd-start-learning-btn"
            onClick={handleStartLearning}
          >
            Start Learning
          </button>

          {/* Includes */}
          <div className="cd-includes">
            <p className="cd-includes-title">Includes</p>
            <ul className="cd-includes-list">
              {includes.map((item, i) => (
                <li key={i} className="cd-includes-item">
                  <span className="cd-inc-icon">{item.icon}</span>
                  {item.text}
                </li>
              ))}
            </ul>
          </div>

          {/* Course Features */}
          <div className="cd-features-block">
            <p className="cd-includes-title">Course Features</p>
            <ul className="cd-features-list">
              {features.map((f, i) => (
                <li key={i} className="cd-feature-item">
                  <span className="cd-feat-label">{f.label}</span>
                  <span className="cd-feat-value">{f.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════
          OVERVIEW SECTION
      ══════════════════════════════════════════ */}
      <div className="cd-section-card">
        <h2 className="cd-section-h2">Overview</h2>

        {/* Course Description */}
        {course.description && (
          <>
            <h3 className="cd-section-h3">Course Description</h3>
            <p className="cd-section-text">{course.description}</p>
          </>
        )}

        {/* What you'll learn */}
        {course.learningOutcomes && course.learningOutcomes.length > 0 && (
          <>
            <h3 className="cd-section-h3">What you'll learn</h3>
            <ul className="cd-learn-list">
              {course.learningOutcomes.map((item, i) => (
                <li key={i} className="cd-learn-item">
                  <FaCheckCircle className="cd-check" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        {/* Requirements */}
        {course.requirements && course.requirements.length > 0 && (
          <>
            <h3 className="cd-section-h3">Requirements</h3>
            <ul className="cd-req-list">
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
        <div className="cd-section-card">
          <h2 className="cd-section-h2">Course Content</h2>
          <div className="cd-curriculum">
            {course.sections.map((sec, idx) => (
              <div key={sec._id || idx} className="cd-sec-item">
                <button
                  className={`cd-sec-header ${openSection === idx ? 'open' : ''}`}
                  onClick={() => setOpenSection(openSection === idx ? null : idx)}
                >
                  <span className="cd-sec-title">{sec.title}</span>
                  <span className="cd-sec-dur">{fmt(sec.duration)}</span>
                  <span className="cd-sec-arrow">{openSection === idx ? '▲' : '▼'}</span>
                </button>
                {openSection === idx && sec.lessons && sec.lessons.length > 0 && (
                  <div className="cd-lessons">
                    {sec.lessons.map((lesson, li) => (
                      <div key={lesson._id || li} className="cd-lesson-item">
                        <FaCheckCircle className="cd-lesson-icon" />
                        <span className="cd-lesson-title">{lesson.title}</span>
                        <span className="cd-lesson-dur">{fmt(lesson.duration)}</span>
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
              {course.formateur.specialty && (
                <p className="cd-inst-spec">{course.formateur.specialty}</p>
              )}
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

      {/* ══════════════════════════════════════════
          REVIEW SECTION
      ══════════════════════════════════════════ */}
      <div id="review" className="cd-section-card">
        <h2 className="cd-section-h2">Leave a Review</h2>

        <form className="cd-comment-form" onSubmit={handleSubmitReview}>
          <div className="cd-form-group">
            <label>Rating</label>
            <div className="cd-review-stars">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  className={`cd-review-star${reviewRating >= star ? ' filled' : ''}`}
                  onClick={() => setReviewRating(star)}
                  aria-label={`${star} star${star > 1 ? 's' : ''}`}
                >
                  <FaStar />
                </button>
              ))}
            </div>
          </div>
          <div className="cd-form-group">
            <label>Your review</label>
            <textarea
              rows={5}
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              placeholder="Share your experience with this course"
              required
            />
          </div>
          <button type="submit" className="cd-submit-btn" disabled={reviewSubmitting}>
            {reviewSubmitting ? 'Submitting review...' : 'Submit review'}
          </button>
        </form>
      </div>

      {/* ══════════════════════════════════════════
          COMMENTS SECTION
      ══════════════════════════════════════════ */}
      <div className="cd-section-card">
        <h2 className="cd-section-h2">Post A Comment</h2>

        <form className="cd-comment-form" onSubmit={handleSubmitComment}>
          <div className="cd-form-row">
            <div className="cd-form-group">
              <label>Name</label>
              <input
                type="text" name="name"
                value={formData.name}
                onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name"
                required
              />
            </div>
            <div className="cd-form-group">
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
          <div className="cd-form-group">
            <label>Subject</label>
            <input
              type="text" name="subject"
              value={formData.subject}
              onChange={e => setFormData(p => ({ ...p, subject: e.target.value }))}
              placeholder="Subject (optional)"
            />
          </div>
          <div className="cd-form-group">
            <label>Comments</label>
            <textarea
              name="comment" rows={5}
              value={formData.comment}
              onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))}
              placeholder="Write your comment here..."
              required
            />
          </div>
          <button type="submit" className="cd-submit-btn" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>

        {/* Comments list */}
        {commentsLoading ? (
          <p style={{ color: '#9ca3af', marginTop: '1rem' }}>Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="cd-comments-list">
            <h3 className="cd-section-h3">All Comments ({comments.length})</h3>
            {comments.map(c => (
              <div key={c._id || c.id} className="cd-comment-item">
                <div className="cd-comment-avatar">
                  {(c.name || 'U')[0].toUpperCase()}
                </div>
                <div className="cd-comment-body">
                  <div className="cd-comment-header">
                    <span className="cd-comment-author">{c.name}</span>
                    {c.subject && <span className="cd-comment-subject">{c.subject}</span>}
                    <span className="cd-comment-date">
                      {new Date(c.createdAt || c.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="cd-comment-text">{c.content || c.comment}</p>
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