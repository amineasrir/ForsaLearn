import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './apprenant.css';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { FaBook, FaCheckCircle, FaStar, FaFileAlt } from 'react-icons/fa';
import CardP from '../../components/apprenant/CardP';
import {
  getApprenantProfile,
  getEnrolledCourses,
  getMyPayments,
  getMyQuizAttempts
} from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';

const ApprenantDashboard = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, coursesResponse, paymentsResponse, quizzesResponse] = await Promise.all([
          getApprenantProfile(),
          getEnrolledCourses(),
          getMyPayments(),
          getMyQuizAttempts()
        ]);

        setUser(userResponse.data?.user || null);
        setCourses(coursesResponse.data?.data || []);
        setPayments(paymentsResponse.data?.data || []);
        setQuizzes(quizzesResponse.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      }
    };

    loadDashboard();
  }, []);

  const enrolledCourses = useMemo(() => courses.slice(0, 3), [courses]);
  const completedCount = useMemo(
    () => courses.filter((course) => Number(course.myProgress || 0) >= 100).length,
    [courses]
  );
  const activeCount = useMemo(
    () => courses.filter((course) => Number(course.myProgress || 0) > 0 && Number(course.myProgress || 0) < 100).length,
    [courses]
  );
  const latestQuizzes = useMemo(() => quizzes.slice(0, 5).map((quiz) => ({
    id: quiz.id || quiz._id,
    title: quiz.lessonTitle || quiz.title || 'Quiz',
    status: quiz.passed ? 'passed' : 'failed',
    correctAnswers: quiz.score || 0,
    date: quiz.createdAt ? new Date(quiz.createdAt).toLocaleDateString() : new Date().toLocaleDateString()
  })), [quizzes]);
  const recentInvoices = payments.slice(0, 5).map((payment, index) => ({
    id: payment._id || `#INV${index + 1}`,
    title: payment.course?.title || 'Course Payment',
    amount: `$${Number(payment.amount?.final || 0).toFixed(2)}`,
    status: payment.status || 'paid'
  }));

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout>
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}

          <div className="apprenant-quiz-section">
            <div className="apprenant-quiz-content">
              <h3>{t('apprenant.learningProgress')}</h3>
              <p>{t('apprenant.enrolledIn', { count: courses.length })}</p>
            </div>
            <button className="apprenant-continue-button" to="/apprenant/enrolled">{t('apprenant.keepLearning')}</button>
          </div>

          <div className="apprenant-stats-cards">
            <div className="apprenant-stat-card">
              <div className="stat-icon enrolled">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>{t('apprenant.enrolledCourses')}</p>
                <h3>{courses.length}</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon active">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>{t('apprenant.activeCourses')}</p>
                <h3>{activeCount}</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon completed">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <p>{t('apprenant.completedCourses')}</p>
                <h3>{completedCount}</h3>
              </div>
            </div>
          </div>

          <section className="enrolled-courses">
            <h2>{t('apprenant.recentlyEnrolledCourses')}</h2>
            <div className="courses-container">
              {enrolledCourses.map(course => (
                <div key={course._id} className="course-card">
                  <img src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours1.jpg')} alt={course.title} className="course-image" />
                  <div className="course-info">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="instructor">{course.formateur?.fullName || t('instructor')}</p>
                    <div className="course-footer">
                      <div className="rating">
                        <FaStar className="star" />
                        <span>{Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} {t('apprenant.reviews')})</span>
                      </div>
                    </div>
                    <div className="course-action">
                      <span className="price">{course.priceType === 'free' ? t('apprenant.priceFree') : `$${Number(course.price || 0).toFixed(2)}`}</span>
                      <button className="view-course-btn">
                        {Number(course.myProgress || 0) >= 100 && course.certificateIssued
                          ? t('apprenant.certificateEarned')
                          : t('apprenant.progress', { value: course.myProgress || 0 })}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="two-column-section">
            <section className="invoices-section">
              <h2>{t('apprenant.recentPayments')}</h2>
              <div className="invoices-list">
                {recentInvoices.length === 0 ? (
                  <div className="invoice-item">
                    <div className="invoice-info">
                      <p className="invoice-title">{t('apprenant.noPaymentsYet')}</p>
                    </div>
                  </div>
                ) : recentInvoices.map(invoice => (
                  <div key={invoice.id} className="invoice-item">
                    <div className="invoice-info">
                      <p className="invoice-title">{invoice.title}</p>
                      <p className="invoice-id">{invoice.id}</p>
                    </div>
                    <div className="invoice-amount">
                      <span>{invoice.amount}</span>
                      <span className={`status ${invoice.status}`} style={{ marginRight: "6px" }}>{invoice.status}</span>
                    </div>
                    <FaFileAlt className="invoice-icon" />
                  </div>
                ))}
              </div>
            </section>

            <section className="quizzes-section">
              <h2>{t('apprenant.latestQuizzes')}</h2>
              <div className="quizzes-list">
                {latestQuizzes.length === 0 ? (
                  <div className="quiz-item">
                    <div className="quiz-info">
                      <h4>{t('apprenant.noQuizAttempts')}</h4>
                      <p className="quiz-date">{t('apprenant.quizHistoryPlaceholder')}</p>
                    </div>
                  </div>
                ) : latestQuizzes.map(quiz => (
                  <div key={quiz.id} className="quiz-item">
                    <div className="quiz-status">
                      <span className={`badge ${quiz.status}`}>
                        {quiz.status === 'passed' ? '✓' : '✕'}
                      </span>
                    </div>
                    <div className="quiz-info">
                      <h4>{quiz.title}</h4>
                      <p className="quiz-score">{t('apprenant.numberOfQuestions', { count: quiz.correctAnswers })}</p>
                      <p className="quiz-date">{t('apprenant.date')} : {quiz.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </ApprenantLayout>
  );
};

export default ApprenantDashboard;
