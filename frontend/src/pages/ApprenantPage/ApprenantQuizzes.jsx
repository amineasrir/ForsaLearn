import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';

const sampleQuizzes = [
  {
    id: 1,
    title: 'Information About UI/UX Design Degree',
    questions: 5,
    completed: false,
  },
  {
    id: 2,
    title: 'Learn JavaScript and Express to become a Expert',
    questions: 10,
    completed: false,
  },
  {
    id: 3,
    title: 'Introduction to Python Programming',
    questions: 8,
    completed: false,
  },
  {
    id: 4,
    title: 'Build Responsive Websites with HTML5 and CSS3',
    questions: 5,
    completed: false,
  },
  {
    id: 5,
    title: 'Information About Photoshop Design Degree',
    questions: 10,
    completed: false,
  },
];

const ApprenantQuizzes = () => {
  return (
    <div className="apprenant-dashboard">
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
          <h1>My Quiz Attempts</h1>
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>My Quiz Attempts</span>
          </nav>
        </div>
      </header>

      <CardP />

      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          <section className="quizzes-list-section">
            <h2>My Quiz Attempts</h2>
            <div className="quizzes-list">
              {sampleQuizzes.map(q => (
                <div key={q.id} className="quiz-item-card">
                  <div className="quiz-info">
                    <h3>{q.title}</h3>
                    <p>Number of Questions : {q.questions < 10 ? `0${q.questions}` : q.questions}</p>
                  </div>
                  <div className="quiz-action">
                    <Link to={`/quiz/${q.id}`} className="quiz-start-btn">
                      <FaArrowRight />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApprenantQuizzes;
