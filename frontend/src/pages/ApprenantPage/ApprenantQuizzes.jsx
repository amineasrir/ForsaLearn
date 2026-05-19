import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { getMyQuizAttempts } from '../../services/apprenentService';
import './apprenant.css';

const ApprenantQuizzes = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizAttempts = async () => {
      setLoading(true);
      try {
        const response = await getMyQuizAttempts();
        setQuizzes(response.data?.data || []);
      } catch (error) {
        console.error('Error loading quiz attempts:', error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuizAttempts();
  }, []);

  const rightContent = (
    <>
      <div className="notification-icon"></div>
    </>
  );

  return (
    <ApprenantLayout>

      <section className="quizzes-list-section">
        <h2>{t('apprenant.myQuizAttempts')}</h2>
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>{t('apprenant.loadingOrders')}</p>
          </div>
        ) : quizzes.length === 0 ? (
          <div className="empty-state">
            <h3>{t('apprenant.noQuizAttempts')}</h3>
            <p>{t('apprenant.quizHistoryPlaceholder')}</p>
          </div>
        ) : (
          <div className="quizzes-list">
            {quizzes.map((quiz) => (
              <div key={quiz.id} className="quiz-item-card">
                <div className="quiz-info">
                  <h3>{quiz.lessonTitle}</h3>
                  <p>{t('apprenant.numberOfQuestions', { count: quiz.questionCount < 10 ? `0${quiz.questionCount}` : quiz.questionCount })}</p>
                  <p className="quiz-course-title">{quiz.courseTitle}</p>
                  <p className="quiz-course-title">
                    Score: {quiz.score}/{quiz.totalPoints} - {quiz.percentageScore}%
                  </p>
                  <p className={`quiz-course-title ${quiz.passed ? 'passed' : 'failed'}`}>
                    {quiz.passed ? 'Passed' : 'Failed'} - Attempt #{quiz.attemptNumber}
                  </p>
                </div>
                <div className="quiz-action">
                  <Link to={`/apprenant/course/${quiz.courseId}/learn`} className="quiz-start-btn">
                    <FaArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </ApprenantLayout>
  );
};

export default ApprenantQuizzes;
