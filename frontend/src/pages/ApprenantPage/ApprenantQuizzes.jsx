import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { getEnrolledCourses } from '../../services/apprenentService';
import './dashboard.css';

const getQuestionCountFromLesson = (lesson) => {
  if (!lesson) return 1;
  const match = lesson.content?.match(/(\d+)\s*questions?/i);
  if (match) return Number(match[1]);
  if (lesson.duration && lesson.duration > 0) return lesson.duration;
  return lesson.resources?.length || 1;
};

const ApprenantQuizzes = () => {
  const { t } = useTranslation();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizLessons = async () => {
      setLoading(true);
      try {
        const response = await getEnrolledCourses();
        const courses = response.data?.data || [];

        const quizLessons = courses.flatMap((course) => (
          course.sections?.flatMap((section) => (
            section.lessons?.filter((lesson) => lesson.type === 'quiz').map((lesson) => ({
              id: lesson._id || `${course._id}-${section.order}-${lesson.order}`,
              title: lesson.title || `${course.title} Quiz`,
              courseTitle: course.title,
              questions: getQuestionCountFromLesson(lesson),
              completed: course.completedLessons?.some((completed) => completed.toString() === lesson._id?.toString()) || false,
            }))
          )) || []
        ));

        setQuizzes(quizLessons);
      } catch (error) {
        console.error('Error loading quiz attempts:', error);
        setQuizzes([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuizLessons();
  }, []);

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
            {quizzes.map((q) => (
              <div key={q.id} className="quiz-item-card">
                <div className="quiz-info">
                  <h3>{q.title}</h3>
                  <p>{t('apprenant.numberOfQuestions', { count: q.questions < 10 ? `0${q.questions}` : q.questions })}</p>
                  <p className="quiz-course-title">{q.courseTitle}</p>
                </div>
                <div className="quiz-action">
                  <Link to="#" className="quiz-start-btn">
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
