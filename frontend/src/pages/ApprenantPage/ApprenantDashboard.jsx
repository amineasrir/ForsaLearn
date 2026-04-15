import React, { useEffect, useMemo, useState } from 'react';
import './dashboard.css';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import { FaBook, FaCheckCircle, FaStar, FaFileAlt } from 'react-icons/fa';
import CardP from '../../components/apprenant/CardP';
import Sidebar from '../../components/apprenant/Sidebar';
import {
  getApprenantProfile,
  getEnrolledCourses,
  getMyPayments
} from '../../services/apprenentService';

const ApprenantDashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [userResponse, coursesResponse, paymentsResponse] = await Promise.all([
          getApprenantProfile(),
          getEnrolledCourses(),
          getMyPayments()
        ]);

        setUser(userResponse.data?.user || null);
        setCourses(coursesResponse.data?.data || []);
        setPayments(paymentsResponse.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard.');
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
  const latestQuizzes = [];
  const recentInvoices = payments.slice(0, 5).map((payment, index) => ({
    id: payment._id || `#INV${index + 1}`,
    title: payment.course?.title || 'Course Payment',
    amount: `$${Number(payment.amount?.final || 0).toFixed(2)}`,
    status: payment.status || 'paid'
  }));

  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="Dashboard"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'Dashboard' }]}
        rightContent={rightContent}
      />
      <CardP user={user} />
      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          {error && <div className="error-message">{error}</div>}

          <div className="apprenant-quiz-section">
            <div className="apprenant-quiz-content">
              <h3>Learning Progress</h3>
              <p>You are enrolled in {courses.length} course(s)</p>
            </div>
            <button className="apprenant-continue-button">Keep Learning</button>
          </div>

          <div className="apprenant-stats-cards">
            <div className="apprenant-stat-card">
              <div className="stat-icon enrolled">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>Enrolled Courses</p>
                <h3>{courses.length}</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon active">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>Active Courses</p>
                <h3>{activeCount}</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon completed">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <p>Completed Courses</p>
                <h3>{completedCount}</h3>
              </div>
            </div>
          </div>

          <section className="enrolled-courses">
            <h2>Recently Enrolled Courses</h2>
            <div className="courses-container">
              {enrolledCourses.map(course => (
                <div key={course._id} className="course-card">
                  <img src={course.thumbnail || require('../../assets/image/cours/cours1.jpg')} alt={course.title} className="course-image" />
                  <div className="course-info">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="instructor">{course.formateur?.fullName || 'Instructor'}</p>
                    <div className="course-footer">
                      <div className="rating">
                        <FaStar className="star" />
                        <span>{Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} Reviews)</span>
                      </div>
                    </div>
                    <div className="course-action">
                      <span className="price">{course.priceType === 'free' ? 'Free' : `$${Number(course.price || 0).toFixed(2)}`}</span>
                      <button className="view-course-btn">Progress {course.myProgress || 0}%</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="two-column-section">
            <section className="invoices-section">
              <h2>Recent Payments</h2>
              <div className="invoices-list">
                {recentInvoices.length === 0 ? (
                  <div className="invoice-item">
                    <div className="invoice-info">
                      <p className="invoice-title">No payments yet</p>
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
              <h2>Latest Quizzes</h2>
              <div className="quizzes-list">
                {latestQuizzes.length === 0 ? (
                  <div className="quiz-item">
                    <div className="quiz-info">
                      <h4>No quiz attempts yet</h4>
                      <p className="quiz-date">Your quiz history will appear here.</p>
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
                      <p className="quiz-score">Correct Answer : {quiz.correctAnswers}</p>
                      <p className="quiz-date">Date : {quiz.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantDashboard;
