import React, { useEffect, useMemo, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  FaArrowLeft, FaCheck, FaLock, FaPlayCircle, FaChevronRight,
  FaChevronDown, FaChevronUp, FaBookOpen, FaBars, FaTimes, FaFileAlt,
  FaTrophy, FaClipboardCheck
} from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { getCourseDetails, completeLesson, getApprenantProfile, submitQuizAttempt } from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';
import './CourseDetails.css';

const AUTO_NEXT_DELAY = 5;

// ─────────────────────────────────────────────────────────────
// COURSE COMPLETION MODAL
// ─────────────────────────────────────────────────────────────
const CourseCompletionModal = ({ course, nextCourse, onGoNext, onClose }) => {
  const { t } = useTranslation();
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '2.5rem',
      maxWidth: '480px', width: '100%', textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
        <FaTrophy style={{ color: '#f59e0b' }} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
        {t('apprenant.courseCompleted')}
      </h2>
      <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        {t('apprenant.youFinished', { title: course?.title })}
      </p>

      {nextCourse && (
        <div style={{
          background: '#f9fafb', borderRadius: '12px', padding: '1rem',
          marginBottom: '1.5rem', border: '1.5px solid #e5e7eb', textAlign: 'left'
        }}>
          <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            {t('apprenant.upNext')}
          </p>
          <p style={{ fontWeight: 700, color: '#111827', fontSize: '0.95rem' }}>{nextCourse.title}</p>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {nextCourse && (
          <button
            onClick={onGoNext}
            style={{
              padding: '0.75rem 1.75rem', background: '#392C7D', color: '#fff',
              border: 'none', borderRadius: '10px', fontWeight: 700,
              fontSize: '0.9rem', cursor: 'pointer'
            }}
          >
            {t('apprenant.startNextCourse')} →
          </button>
        )}
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.75rem', background: '#fff', color: '#374151',
            border: '1.5px solid #e5e7eb', borderRadius: '10px', fontWeight: 600,
            fontSize: '0.9rem', cursor: 'pointer'
          }}
        >
          {t('apprenant.stayHere')}
        </button>
      </div>
    </div>
  </div>
);
}

const QuizFeedbackModal = ({ score, onClose }) => {
  const { t } = useTranslation();
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: '1rem'
    }}>
    <div style={{
      background: '#fff', borderRadius: '20px', padding: '2.5rem',
      maxWidth: '480px', width: '100%', textAlign: 'center',
      boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
    }}>
      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        <FaClipboardCheck style={{ color: '#10b981' }} />
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111827', marginBottom: '0.5rem' }}>
        {t('apprenant.quizSubmitted')}
      </h2>
      <p style={{ color: '#6b7280', fontSize: '1rem', marginBottom: '1.5rem', fontWeight: 600 }}>
        {t('apprenant.yourScore')}: <strong style={{ color: '#ff3b63', fontSize: '1.25rem' }}>{score || 0}%</strong>
      </p>
      <p style={{ color: '#374151', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        {t('apprenant.quizFeedbackMessage')}
      </p>
      <button
        onClick={onClose}
        style={{
          padding: '0.75rem 2rem', background: '#392C7D', color: '#fff',
          border: 'none', borderRadius: '10px', fontWeight: 700,
          fontSize: '0.9rem', cursor: 'pointer', width: '100%'
        }}
      >
        {t('apprenant.ok')}
      </button>
    </div>
  </div>
);
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
const CoursePlayer = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const countdownRef = useRef(null);

  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState(0);
  const [activeLesson, setActiveLesson] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState({});

  const [showNextBanner, setShowNextBanner] = useState(false);
  const [countdown, setCountdown] = useState(AUTO_NEXT_DELAY);
  const [autoNextCancelled, setAutoNextCancelled] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [nextCourseInfo, setNextCourseInfo] = useState(null);

  // ✅ FIX: local state pour les leçons complétées — mis à jour immédiatement
  const [localCompletedIds, setLocalCompletedIds] = useState([]);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [quizMessage, setQuizMessage] = useState('');
  const [showQuizFeedbackModal, setShowQuizFeedbackModal] = useState(false);
  const [quizFeedbackScore, setQuizFeedbackScore] = useState(null);

  // ─── LOAD ───
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [courseRes, userRes] = await Promise.all([
          getCourseDetails(id),
          getApprenantProfile()
        ]);
        const courseData = courseRes.data?.data;
        const userData = userRes.data?.user || null;
        setCourse(courseData);
        setUser(userData);

        const nextC = courseData?.nextCourse || null;
        setNextCourseInfo(nextC);

        if (courseData?.sections) {
          const init = {};
          courseData.sections.forEach((_, i) => { init[i] = true; });
          setOpenSections(init);
        }

        // ✅ FIX: initialiser localCompletedIds depuis l'enrollment au chargement
        const enrollmentEntry = courseData?.enrolledStudents?.find((entry) => {
          const studentId = entry.student?._id || entry.student;
          return studentId?.toString() === userData?._id?.toString();
        });
        const initialCompleted = enrollmentEntry?.completedLessons?.map((item) => item.toString()) || [];
        setLocalCompletedIds(initialCompleted);

      } catch (err) {
        setError(err.response?.data?.message || t('apprenant.unableToLoadCourse'));
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  // ─── ENROLLMENT (readonly, used only for progress & certificateUrl) ───
  const enrollment = useMemo(() => {
    if (!course || !user) return null;
    return course.enrolledStudents?.find((entry) => {
      const studentId = entry.student?._id || entry.student;
      return studentId?.toString() === user._id?.toString();
    }) || null;
  }, [course, user]);

  const sections = course?.sections || [];

  const lessonList = useMemo(() => {
    return sections.flatMap((section, sectionIndex) =>
      (section.lessons || []).map((lesson, lessonIndex) => ({
        sectionIndex, lessonIndex, lesson
      }))
    );
  }, [sections]);

  const currentLesson = useMemo(
    () => sections?.[activeSection]?.lessons?.[activeLesson] || null,
    [sections, activeSection, activeLesson]
  );

  const totalLessons = lessonList.length;

  // ✅ FIX: utilise localCompletedIds partout
  const completedCount = localCompletedIds.length;
  const progress = enrollment?.progress || 0;

  const currentIndex = useMemo(() => {
    if (!currentLesson) return 0;
    return lessonList.findIndex(
      (item) => (item.lesson._id || item.lesson.id)?.toString() === (currentLesson._id || currentLesson.id)?.toString()
    );
  }, [lessonList, currentLesson]);

  const nextLessonInfo = useMemo(() => {
    if (currentIndex < 0 || currentIndex >= lessonList.length - 1) return null;
    return lessonList[currentIndex + 1];
  }, [currentIndex, lessonList]);

  const prevLessonInfo = useMemo(() => {
    if (currentIndex <= 0) return null;
    return lessonList[currentIndex - 1];
  }, [currentIndex, lessonList]);

  // ✅ FIX: utilise localCompletedIds
  const isLessonCompleted = useMemo(() => {
    if (!currentLesson) return false;
    return localCompletedIds.includes((currentLesson._id || currentLesson.id)?.toString());
  }, [currentLesson, localCompletedIds]);

  // Reset banner on lesson change
  useEffect(() => {
    setShowNextBanner(false);
    setCountdown(AUTO_NEXT_DELAY);
    setAutoNextCancelled(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, [activeSection, activeLesson]);

  useEffect(() => {
    setQuizAnswers({});
    setQuizResult(null);
    setQuizError('');
    setQuizMessage('');
  }, [currentLesson?._id]);

  const goToNextLesson = useCallback(() => {
    if (!nextLessonInfo) return;
    setShowNextBanner(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setOpenSections((prev) => ({
      ...prev,
      [nextLessonInfo.sectionIndex]: true
    }));
    setActiveSection(nextLessonInfo.sectionIndex);
    setActiveLesson(nextLessonInfo.lessonIndex);
  }, [nextLessonInfo]);

  const cancelAutoNext = useCallback(() => {
    setAutoNextCancelled(true);
    setShowNextBanner(false);
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  useEffect(() => {
    if (!showNextBanner || autoNextCancelled) return;
    setCountdown(AUTO_NEXT_DELAY);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          goToNextLesson();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [showNextBanner, autoNextCancelled, goToNextLesson]);

  // ─── MARK COMPLETE ───
  const markComplete = useCallback(async (lessonId) => {
    // ✅ FIX: vérifie avec localCompletedIds pour éviter le double call
    if (!course || !enrollment || localCompletedIds.includes(lessonId)) return false;
    setSaving(true);
    try {
      const res = await completeLesson(course._id, lessonId);
      const updatedProgress = res.data?.progress;
      const updatedCertificateUrl = res.data?.certificateUrl;

      // ✅ FIX: mise à jour IMMÉDIATE locale — avant même le re-render de course
      setLocalCompletedIds((prev) => [...prev, lessonId]);

      setCourse((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          enrolledStudents: (prev.enrolledStudents || []).map((entry) => {
            const sId = entry.student?._id || entry.student;
            if (sId?.toString() === user._id?.toString()) {
              return {
                ...entry,
                progress: updatedProgress,
                completedLessons: [...(entry.completedLessons || []), lessonId],
                certificateUrl: updatedCertificateUrl || entry.certificateUrl
              };
            }
            return entry;
          })
        };
      });

      if (updatedProgress === 100) {
        setShowCompletionModal(true);
        setSuccess('');
      } else {
        setSuccess(t('apprenant.lessonCompletedProgress'));
        setTimeout(() => setSuccess(''), 3000);
      }

      return true;
    } catch (err) {
      setError(err.response?.data?.message || t('apprenant.unableToUpdateProgress'));
      return false;
    } finally {
      setSaving(false);
    }
  }, [course, enrollment, localCompletedIds, user]);

  // Video ended → auto mark complete + show next banner or jump to quiz
  const handleVideoEnded = useCallback(async () => {
    if (!currentLesson) return;
    const lessonId = (currentLesson._id || currentLesson.id)?.toString();
    const ok = await markComplete(lessonId);
    if (!ok || !nextLessonInfo || autoNextCancelled) return;

    if (nextLessonInfo.lesson.type === 'quiz') {
      goToNextLesson();
      return;
    }

    setShowNextBanner(true);
  }, [currentLesson, nextLessonInfo, autoNextCancelled, markComplete, goToNextLesson]);

  // Manual mark complete button
  const handleCompleteLesson = async () => {
    if (!course || !currentLesson) return;
    if (!enrollment) {
      setError(t('apprenant.mustEnrollToTrackProgress'));
      setTimeout(() => setError(''), 3000);
      return;
    }
    const lessonId = (currentLesson._id || currentLesson.id)?.toString();
    const ok = await markComplete(lessonId);
    if (!ok || !nextLessonInfo) return;

    if (nextLessonInfo.lesson.type === 'quiz') {
      goToNextLesson();
      return;
    }

    setShowNextBanner(true);
  };

  const handleQuizAnswerChange = (questionId, value) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmitQuiz = useCallback(async () => {
    if (!course || !currentLesson) return;
    const lessonId = (currentLesson._id || currentLesson.id)?.toString();
    const questions = currentLesson.quiz?.questions || [];
    if (!questions.length) {
      setQuizError(t('apprenant.quizNoQuestions'));
      return;
    }

    const answers = questions.map((question) => ({
      questionId: question._id || question.id,
      selectedAnswer: String(quizAnswers[question._id || question.id] || '').trim()
    }));

    setSubmittingQuiz(true);
    setQuizError('');
    setQuizMessage('');
    try {
      const response = await submitQuizAttempt(course._id, lessonId, answers);
      const data = response.data?.data || {};
      setQuizResult(data);
      setQuizMessage(response.data?.message || 'Quiz submitted.');

      // Show feedback modal if score < 100%
      if (data.percentageScore != null && data.percentageScore < 100) {
        setQuizFeedbackScore(data.percentageScore);
        setShowQuizFeedbackModal(true);
      }

      if (data.passed) {
        setLocalCompletedIds((prev) => (
          prev.includes(lessonId) ? prev : [...prev, lessonId]
        ));

        setCourse((prevCourse) => {
          if (!prevCourse) return prevCourse;
          return {
            ...prevCourse,
            enrolledStudents: (prevCourse.enrolledStudents || []).map((entry) => {
              const studentId = entry.student?._id || entry.student;
              if (studentId?.toString() === user?._id?.toString()) {
                const completedLessons = Array.from(new Set([
                  ...(entry.completedLessons || []).map((item) => item.toString()),
                  lessonId
                ]));
                return {
                  ...entry,
                  progress: data.progress,
                  completedLessons,
                  certificateIssued: data.certificateIssued || entry.certificateIssued,
                  certificateUrl: data.certificateUrl || entry.certificateUrl
                };
              }
              return entry;
            })
          };
        });

        if (data.progress >= 100) {
          setShowCompletionModal(true);
        }
      }
    } catch (err) {
      setQuizError(err.response?.data?.message || t('apprenant.unableToSubmitQuiz'));
    } finally {
      setSubmittingQuiz(false);
    }
  }, [course, currentLesson, quizAnswers, user]);

  // ✅ FIX: isLessonLocked utilise localCompletedIds
  const isLessonLocked = useCallback((flatIndex) => {
    if (flatIndex <= 0) return false;
    const prevLesson = lessonList[flatIndex - 1];
    const prevId = (prevLesson.lesson._id || prevLesson.lesson.id)?.toString();
    return !localCompletedIds.includes(prevId);
  }, [lessonList, localCompletedIds]);

  const handleLessonSelect = (sectionIndex, lessonIndex) => {
    const lesson = sections?.[sectionIndex]?.lessons?.[lessonIndex];
    if (!lesson) return;
    const flatIndex = lessonList.findIndex(
      (item) => (item.lesson._id || item.lesson.id)?.toString() === (lesson._id || lesson.id)?.toString()
    );
    if (isLessonLocked(flatIndex)) {
      setError(t('apprenant.completePreviousLesson'));
      setTimeout(() => setError(''), 3000);
      return;
    }
    setError('');
    setOpenSections((prev) => ({ ...prev, [sectionIndex]: true }));
    setActiveSection(sectionIndex);
    setActiveLesson(lessonIndex);
  };

  const toggleSection = (i) => setOpenSections((prev) => ({ ...prev, [i]: !prev[i] }));

  const handleGoNextCourse = () => {
    if (nextCourseInfo?._id) {
      navigate(`/apprenant/course-player/${nextCourseInfo._id}`);
    }
  };

  if (loading) {
    return (
      <div className="cp-fullpage-loading">
        <div className="cp-spinner" />
        <p>{t('apprenant.loadingCourse')}</p>
      </div>
    );
  }

  if (!course) {
    return <div className="cp-fullpage-error">{t('apprenant.courseNotFound')}</div>;
  }

  const lessonUrl = currentLesson?.type === 'video' ? getMediaUrl(currentLesson.content) : null;

  return (
    <div className="cp-root">

      {/* ── COMPLETION MODAL ── */}
      {showCompletionModal && (
        <CourseCompletionModal
          course={course}
          nextCourse={nextCourseInfo}
          onGoNext={handleGoNextCourse}
          onClose={() => setShowCompletionModal(false)}
        />
      )}

      {showQuizFeedbackModal && (
        <QuizFeedbackModal
          score={quizFeedbackScore}
          onClose={() => setShowQuizFeedbackModal(false)}
        />
      )}

      {/* ── TOP BAR ── */}
      <header className="cp-topbar">
        <button className="cp-back-btn" onClick={() => navigate(`/apprenant/course/${id}`)}>
          <FaArrowLeft />
          <span>{t('apprenant.back')}</span>
        </button>
        <div className="cp-topbar-middle">
          <span className="cp-topbar-course">{course.title}</span>
          {currentLesson && <span className="cp-topbar-sep">·</span>}
          {currentLesson && <span className="cp-topbar-lesson">{currentLesson.title}</span>}
        </div>
        <div className="cp-topbar-right">
          {progress === 100 && (
            <span title="Course completed!" style={{ color: '#f59e0b', fontSize: '1.1rem' }}>
              <FaTrophy />
            </span>
          )}
          <div className="cp-topbar-progress-wrap">
            <div className="cp-topbar-bar">
              <div className="cp-topbar-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="cp-topbar-pct">{completedCount}/{totalLessons}</span>
          </div>
          <button
            className="cp-toggle-sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={t('apprenant.toggleSidebar')}
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
            <span>{sidebarOpen ? t('apprenant.hide') : t('apprenant.content')}</span>
          </button>
        </div>
      </header>

      {/* ── ALERTS ── */}
      {(error || success) && (
        <div className="cp-alerts">
          {error && <div className="cp-alert error"><span>⚠</span> {error}</div>}
          {success && <div className="cp-alert success"><FaCheck /> {success}</div>}
        </div>
      )}

      {/* ── AUTO-NEXT BANNER ── */}
      {showNextBanner && nextLessonInfo && (
        <div className="cp-autonext">
          <div className="cp-autonext-left">
            <svg viewBox="0 0 36 36" className="cp-autonext-ring">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#3d3f41" strokeWidth="3" />
              <circle
                cx="18" cy="18" r="15" fill="none"
                stroke="#a435f0" strokeWidth="3"
                strokeDasharray={`${(countdown / AUTO_NEXT_DELAY) * 94.2} 94.2`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="23" textAnchor="middle" fontSize="13" fill="#fff" fontWeight="700">{countdown}</text>
            </svg>
            <div className="cp-autonext-info">
              <span className="cp-autonext-label">{t('apprenant.upNext')}</span>
              <span className="cp-autonext-title">{nextLessonInfo.lesson.title}</span>
              <span className="cp-autonext-meta">
                {sections[nextLessonInfo.sectionIndex]?.title} · {nextLessonInfo.lesson.duration || 0} min
              </span>
            </div>
          </div>
          <div className="cp-autonext-actions">
            <button className="cp-btn-gonext" onClick={goToNextLesson}>
              {t('apprenant.nextLesson')} <FaChevronRight />
            </button>
            <button className="cp-btn-cancelauto" onClick={cancelAutoNext}>{t('apprenant.cancel')}</button>
          </div>
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div className={`cp-layout ${sidebarOpen ? '' : 'no-sidebar'}`}>

        {/* ── VIDEO / CONTENT AREA ── */}
        <main className="cp-main">
          <div className="cp-video-wrap">
            {lessonUrl ? (
              <video
                ref={videoRef}
                key={lessonUrl}
                className="cp-video"
                controls
                src={lessonUrl}
                poster={getMediaUrl(course.thumbnail)}
                onEnded={handleVideoEnded}
              />
            ) : currentLesson?.type === 'article' ? (
              <div className="cp-article-wrap">
                <FaFileAlt className="cp-article-icon" />
                <div className="cp-article-body">{currentLesson.content}</div>
              </div>
            ) : currentLesson?.type === 'quiz' ? (
              <div className="cp-quiz-card">
                <div className="cp-quiz-header">
                  <h3>{currentLesson.title || t('apprenant.quiz')}</h3>
                  <p>{currentLesson.description || currentLesson.quiz?.instructions || t('apprenant.quizIntro')}</p>
                  {currentLesson.quiz?.passingScore != null && (
                    <p className="cp-quiz-meta">{t('apprenant.passingScore')}: {currentLesson.quiz.passingScore}%</p>
                  )}
                  {currentLesson.quiz?.instructions && (
                    <p className="cp-quiz-instructions">{currentLesson.quiz.instructions}</p>
                  )}
                </div>

                {quizError && <div className="cp-quiz-error">{quizError}</div>}
                {quizMessage && <div className="cp-quiz-success">{quizMessage}</div>}

                {(quizResult || currentLesson.quizSummary?.latestAttempt) && (
                  <div className="cp-quiz-result">
                    <div className="cp-quiz-result-row">
                      <span>{t('apprenant.score')}</span>
                      <strong>{(quizResult?.score ?? currentLesson.quizSummary.latestAttempt?.score) || 0}/
                        {(quizResult?.totalPoints ?? currentLesson.quizSummary.latestAttempt?.totalPoints) || 0}
                      </strong>
                    </div>
                    <div className="cp-quiz-result-row">
                      <span>{t('apprenant.percentage')}</span>
                      <strong>{(quizResult?.percentageScore ?? currentLesson.quizSummary.latestAttempt?.percentageScore) || 0}%</strong>
                    </div>
                    <div className="cp-quiz-result-row">
                      <span>{t('apprenant.status')}</span>
                      <strong>{(quizResult?.passed ?? currentLesson.quizSummary.latestAttempt?.passed) ? t('apprenant.passed') : t('apprenant.failed')}</strong>
                    </div>
                    <div className="cp-quiz-result-row">
                      <span>{t('apprenant.attempt')}</span>
                      <strong>{(quizResult?.attemptNumber ?? currentLesson.quizSummary.latestAttempt?.attemptNumber) || 1}</strong>
                    </div>
                  </div>
                )}

                {currentLesson.quiz?.questions?.length ? (
                  <div className="cp-quiz-questions">
                    {currentLesson.quiz.questions.map((question, index) => {
                      const questionId = question._id || question.id;
                      const selected = quizAnswers[questionId] || '';
                      const isMultiple = question.type === 'multiple-choice';
                      const isTrueFalse = question.type === 'true-false';
                      const options = question.options || [];

                      return (
                        <div key={questionId} className="cp-quiz-question">
                          <div className="cp-quiz-question-header">
                            <span className="cp-quiz-question-number">Question {index + 1}</span>
                            <span className="cp-quiz-question-points">{question.points || 1} pts</span>
                          </div>
                          <span className="cp-quiz-question-text">{question.text || question.question || question.prompt || t('apprenant.noQuestionText')}</span>

                          {isMultiple || isTrueFalse ? (
                            <div className="cp-quiz-options">
                              {(isTrueFalse ? [
                                { text: t('apprenant.true') },
                                { text: t('apprenant.false') }
                              ] : options).map((option, optionIndex) => {
                                const optionText = String(option.text || option).trim();
                                return (
                                  <label key={optionIndex} className="cp-quiz-option">
                                    <input
                                      type="radio"
                                      name={`quiz-${questionId}`}
                                      value={optionText}
                                      checked={selected === optionText}
                                      onChange={() => handleQuizAnswerChange(questionId, optionText)}
                                    />
                                    <span>{optionText}</span>
                                  </label>
                                );
                              })}
                            </div>
                          ) : (
                            <textarea
                              className="cp-quiz-textarea"
                              value={selected}
                              placeholder="Your answer"
                              onChange={(event) => handleQuizAnswerChange(questionId, event.target.value)}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="cp-placeholder">
                    <FaBookOpen className="cp-placeholder-icon" />
                    <p>{t('apprenant.quizNoQuestions')}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="cp-placeholder">
                <FaPlayCircle className="cp-placeholder-icon" />
                <p>{t('apprenant.selectLessonFromSidebar')}</p>
              </div>
            )}
          </div>

          {/* Lesson info + controls */}
          <div className="cp-controls">
            <div className="cp-controls-nav">
              <button
                className="cp-nav-btn"
                disabled={!prevLessonInfo}
                onClick={() => prevLessonInfo && handleLessonSelect(prevLessonInfo.sectionIndex, prevLessonInfo.lessonIndex)}
              >
                <FaChevronRight style={{ transform: 'rotate(180deg)' }} /> {t('apprenant.previous')}
              </button>
              {currentLesson?.type === 'quiz' ? (
              <button
                className={`cp-complete-btn${quizResult?.passed || isLessonCompleted ? ' done' : ''}`}
                onClick={handleSubmitQuiz}
                disabled={submittingQuiz || saving || !enrollment || quizResult?.passed || isLessonCompleted || !currentLesson}
              >
                {submittingQuiz ? <span className="cp-spinner-sm" /> : quizResult?.passed || isLessonCompleted ? <><FaCheck /> {t('apprenant.passed')}</> : t('apprenant.submitQuiz')}
              </button>
            ) : (
              <button
                className={`cp-complete-btn${isLessonCompleted ? ' done' : ''}`}
                onClick={handleCompleteLesson}
                disabled={saving || !enrollment || isLessonCompleted || !currentLesson}
              >
                {saving ? <span className="cp-spinner-sm" /> : isLessonCompleted ? <><FaCheck /> {t('apprenant.completed')}</> : t('apprenant.markComplete')}
              </button>
            )}
              <button
                className="cp-nav-btn cp-nav-next"
                disabled={!nextLessonInfo}
                onClick={() => nextLessonInfo && handleLessonSelect(nextLessonInfo.sectionIndex, nextLessonInfo.lessonIndex)}
              >
                Next <FaChevronRight />
              </button>
            </div>

            <div className="cp-lesson-info">
              <div className="cp-lesson-breadcrumb">{sections[activeSection]?.title}</div>
              <h2 className="cp-lesson-heading">{currentLesson?.title || t('apprenant.selectALesson')}</h2>
              {currentLesson && (
                <p className="cp-lesson-sub">
                  <span className={`cp-type-badge cp-type-${currentLesson.type}`}>
                    {currentLesson.type}
                  </span>
                  {currentLesson.duration ? `${currentLesson.duration} min` : ''}
                </p>
              )}
              {currentLesson?.description && (
                <p className="cp-lesson-desc">{currentLesson.description}</p>
              )}
            </div>

            <div className="cp-progress-strip">
              <div className="cp-progress-bar">
                <div className="cp-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span>{progress}% {t('apprenant.complete')} · {completedCount} {t('apprenant.of')} {totalLessons} {t('apprenant.lessons')}</span>
            </div>
          </div>
        </main>

        {/* ── SIDEBAR ── */}
        {sidebarOpen && (
          <aside className="cp-sidebar">
            <div className="cp-sidebar-head">
              <h3>{t('apprenant.courseContent')}</h3>
              <span>{completedCount}/{totalLessons} {t('apprenant.completed')}</span>
            </div>
            <div className="cp-sidebar-prog">
              <div className="cp-sidebar-prog-fill" style={{ width: `${progress}%` }} />
            </div>

            <div className="cp-sections">
              {sections.map((section, sectionIndex) => {
                // ✅ FIX: utilise localCompletedIds pour le compteur de section
                const sectionDone = (section.lessons || []).filter((l) =>
                  localCompletedIds.includes((l._id || l.id)?.toString())
                ).length;
                const total = section.lessons?.length || 0;
                const isOpen = openSections[sectionIndex];
                return (
                  <div key={section._id || sectionIndex} className="cp-sec">
                    <button className="cp-sec-header" onClick={() => toggleSection(sectionIndex)}>
                      <div className="cp-sec-texts">
                        <span className="cp-sec-title">{section.title}</span>
                        <span className="cp-sec-meta">{sectionDone}/{total} · {section.lessons?.reduce((a, l) => a + (l.duration || 0), 0)} min</span>
                      </div>
                      {isOpen ? <FaChevronUp className="cp-sec-chevron" /> : <FaChevronDown className="cp-sec-chevron" />}
                    </button>

                    {isOpen && (
                      <div className="cp-sec-lessons">
                        {(section.lessons || []).map((lesson, lessonIndex) => {
                          const lessonId = (lesson._id || lesson.id)?.toString();
                          const flatIndex = lessonList.findIndex(
                            (item) => (item.lesson._id || item.lesson.id)?.toString() === lessonId
                          );
                          const locked = isLessonLocked(flatIndex);
                          // ✅ FIX: utilise localCompletedIds
                          const done = localCompletedIds.includes(lessonId);
                          const isActive = activeSection === sectionIndex && activeLesson === lessonIndex;
                          return (
                            <button
                              key={lessonId || lessonIndex}
                              className={`cp-lesson-row${isActive ? ' active' : ''}${locked ? ' locked' : ''}${done ? ' done' : ''}`}
                              onClick={() => handleLessonSelect(sectionIndex, lessonIndex)}
                            >
                              <span className="cp-row-icon">
                                {locked ? <FaLock /> : done ? <FaCheck /> : <FaPlayCircle />}
                              </span>
                              <span className="cp-row-info">
                                <span className="cp-row-name">{lesson.title}</span>
                                <span className="cp-row-meta">{lesson.type} · {lesson.duration || 0} min</span>
                              </span>
                              {isActive && <span className="cp-row-active-dot" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Next course teaser */}
              {nextCourseInfo && progress === 100 && (
                <div style={{
                  padding: '1rem', borderTop: '1px solid #e5e7eb',
                  background: '#f0fdf4'
                }}>
                  <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    ✓ {t('apprenant.courseCompleteNextUp')}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', color: '#111827', marginBottom: '0.75rem' }}>
                    {nextCourseInfo.title}
                  </p>
                  <button
                    onClick={handleGoNextCourse}
                    style={{
                      width: '100%', padding: '0.55rem', background: '#392C7D',
                      color: '#fff', border: 'none', borderRadius: '8px',
                      fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer'
                    }}
                  >
                    {t('apprenant.startNextCourse')} →
                  </button>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
  


};

export default CoursePlayer;