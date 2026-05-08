import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
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
  const { t } = useTranslation();
  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.myQuizAttempts')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.myQuizAttempts') }]}
      rightContent={rightContent}
    >
      <CardP />

          <section className="quizzes-list-section">
            <h2>{t('apprenant.myQuizAttempts')}</h2>
            <div className="quizzes-list">
              {sampleQuizzes.map(q => (
                <div key={q.id} className="quiz-item-card">
                  <div className="quiz-info">
                    <h3>{q.title}</h3>
                    <p>{t('apprenant.numberOfQuestions', { count: q.questions < 10 ? `0${q.questions}` : q.questions })}</p>
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
      </ApprenantLayout>
  );
};

export default ApprenantQuizzes;
