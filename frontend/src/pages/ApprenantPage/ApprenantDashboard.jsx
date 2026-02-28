import React, { useState } from 'react';
import './dashboard.css';
import { FaBook, FaCheckCircle, FaStar, FaFileAlt } from 'react-icons/fa';
import cours1 from '../../assets/image/cours/cours1.jpg'
import cours2 from '../../assets/image/cours/cours2.jpg'
import cours3 from '../../assets/image/cours/cours3.jpg'
import CardP from '../../components/apprenant/CardP';
import Sidebar from '../../components/apprenant/Sidebar';
const ApprenantDashboard = () => {
 

  const enrolledCourses = [
    {
      id: 1,
      title: 'Information About UI/UX Design Degree',
      instructor: 'David Benitez',
      category: 'Design',
      rating: 4.9,
      reviews: 200,
      price: '$120',
      image: cours1
    },
    {
      id: 2,
      title: 'Wordpress for Beginners - Master Wordpress Quickly',
      instructor: 'Ana Reyes',
      category: 'Wordpress',
      rating: 4.4,
      reviews: 160,
      price: '$140',
      image: cours2
    },
    {
      id: 3,
      title: 'Sketch from A to Z (2024): Become an app designer',
      instructor: 'Andrew Pirtie',
      category: 'Design',
      rating: 4.6,
      reviews: 170,
      price: '$160',
      image: cours3
    },
  ];

  const recentInvoices = [
    { id: '#INV001', title: 'Build Responsive Real World Websites..', amount: '$200', status: 'paid' },
    { id: '#INV002', title: 'Wordpress for Beginners', amount: '$310', status: 'paid' },
    { id: '#INV003', title: 'Information About UI/UI Design Degree', amount: '$270', status: 'paid' },
    { id: '#INV004', title: 'Sketch from A to Z (2024)', amount: '$180', status: 'paid' },
    { id: '#INV005', title: 'Become an app designer', amount: '$220', status: 'paid' },
  ];

  const latestQuizzes = [
    { id: 1, title: 'Sketch from A to Z (2024)', correctAnswers: '15/22', date: '15 Jan 2025', status: 'passed' },
    { id: 2, title: 'Build Responsive Real World', correctAnswers: '18/22', date: '04 Jan 2025', status: 'passed' },
    { id: 4, title: 'Build Responsive Real World', correctAnswers: '15/20', date: '10 Dec 2024', status: 'passed' },
    { id: 5, title: 'Become an app designer', correctAnswers: '12/20', date: '27 Nov 2024', status: 'failed' },
  ];

  return (
    <div className="apprenant-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo" />
          </div>
          <div className="header-right">
            <button className="lang-btn">ENG</button>
            <div className="notification-icon"></div>
            <div className="cart-icon"></div>
          </div>
        </div>

        <div className="header-center">
          <h1>Dashboard</h1>
          <nav className="breadcrumb">
            <a href="/">Home</a>
            <span>/</span>
            <span>Dashboard</span>
          </nav>
        </div>
      </header>
 <CardP/>
      <div className="dashboard-container">
        {/* Sidebar */}
          <Sidebar/>
        
        {/* Main Content */}
        <main className="main-content">
          {/* Profile Section */}
        

          {/* Quiz Section */}
          <div className="apprenant-quiz-section">
            <div className="apprenant-quiz-content">
              <h3>Quiz : Build Responsive Real World</h3>
              <p>Answered : 15/22</p>
            </div>
            <button className="apprenant-continue-button">Continue Quiz</button>
          </div>

          {/* Stats Cards */}
          <div className="apprenant-stats-cards">
            <div className="apprenant-stat-card">
              <div className="stat-icon enrolled">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>Enrolled Courses</p>
                <h3>12</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon active">
                <FaBook />
              </div>
              <div className="stat-content">
                <p>Active Courses</p>
                <h3>03</h3>
              </div>
            </div>
            <div className="apprenant-stat-card">
              <div className="stat-icon completed">
                <FaCheckCircle />
              </div>
              <div className="stat-content">
                <p>Completed Courses</p>
                <h3>10</h3>
              </div>
            </div>
          </div>

          {/* Recently Enrolled Courses */}
          <section className="enrolled-courses">
            <h2>Recently Enrolled Courses</h2>
            <div className="courses-container">
              {enrolledCourses.map(course => (
                <div key={course.id} className="course-card">
                  <img src={course.image} alt={course.title} className="course-image" />
                  <div className="course-info">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="instructor">{course.instructor}</p>
                    <div className="course-footer">
                      <div className="rating">
                        <FaStar className="star" />
                        <span>{course.rating} ({course.reviews} Reviews)</span>
                      </div>
                    </div>
                    <div className="course-action">
                      <span className="price">{course.price}</span>
                      <button className="view-course-btn">View Course →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Two Column Section */}
          <div className="two-column-section">
            {/* Recent Invoices */}
            <section className="invoices-section">
              <h2>Recent Invoices</h2>
              <div className="invoices-list">
                {recentInvoices.map(invoice => (
                  <div key={invoice.id} className="invoice-item">
                    <div className="invoice-info">

                      <p className="invoice-title">{invoice.title}</p>
                      <p className="invoice-id">{invoice.id}</p>
                    </div>
                    <div className="invoice-amount">
                      <span>{invoice.amount}</span>
                      <span className={`status ${invoice.status}`} style={{ marginRight: "6px" }}>✓ Paid</span>
                    </div>
                    <FaFileAlt className="invoice-icon" />
                  </div>
                ))}
              </div>
            </section>

            {/* Latest Quizzes */}
            <section className="quizzes-section">
              <h2>Latest Quizzes</h2>
              <div className="quizzes-list">
                {latestQuizzes.map(quiz => (
                  <div key={quiz.id} className="quiz-item">
                    <div className="quiz-status">
                      <span className={`badge ${quiz.status}`}>
                        {quiz.status === 'passed' ? '✓' : '✗'}
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
