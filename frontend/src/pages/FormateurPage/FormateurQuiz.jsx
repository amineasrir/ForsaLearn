import React, { useCallback, useEffect, useMemo, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { FaChartBar, FaPlus, FaTrash } from 'react-icons/fa';
import {
  getFormateurCourse,
  getFormateurCourses,
  saveFormateurCourseSections
} from '../../services/formateurService';

const emptyQuizForm = {
  title: '',
  description: '',
  duration: 10,
  instructions: '',
  passingScore: 50,
  maxAttempts: 0,
  allowRetry: true
};

const emptyQuestionForm = {
  prompt: '',
  type: 'multiple-choice',
  points: 1,
  correctAnswer: '',
  explanation: '',
  options: [
    { text: '', isCorrect: true },
    { text: '', isCorrect: false }
  ]
};

const FormateurQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showNewQuizForm, setShowNewQuizForm] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState('');
  const [quizFormData, setQuizFormData] = useState(emptyQuizForm);
  const [questionFormData, setQuestionFormData] = useState(emptyQuestionForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const selectedSectionDetails = useMemo(
    () => (course?.sections || []).find((section) => String(section._id) === String(selectedSection)) || null,
    [course, selectedSection]
  );

  const quizLessons = useMemo(
    () => (course?.sections || []).flatMap((section) =>
      (section.lessons || [])
        .filter((lesson) => lesson.type === 'quiz')
        .map((lesson) => ({
          ...lesson,
          sectionId: section._id,
          sectionTitle: section.title
        }))
    ),
    [course]
  );

  const loadCourses = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFormateurCourses();
      const nextCourses = response.data?.data || [];
      setCourses(nextCourses);

      if (nextCourses.length > 0) {
        setSelectedCourse((current) => current || nextCourses[0]._id);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCourseDetails = async (courseId) => {
    if (!courseId) {
      setCourse(null);
      return;
    }

    try {
      const response = await getFormateurCourse(courseId);
      const nextCourse = response.data?.data || null;
      setCourse(nextCourse);

      if (nextCourse?.sections?.length > 0) {
        setSelectedSection((current) => {
          const stillExists = nextCourse.sections.some((section) => section._id === current);
          return stillExists ? current : nextCourse.sections[0]._id;
        });
      } else {
        setSelectedSection('');
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error fetching course details');
    }
  };

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse);
    }
  }, [selectedCourse]);

  const persistSections = async (nextSections, successMessage) => {
    if (!selectedCourse) {
      return;
    }

    try {
      setSaving(true);
      setError('');
      await saveFormateurCourseSections(selectedCourse, nextSections);
      setSuccess(successMessage);
      await loadCourseDetails(selectedCourse);
      setTimeout(() => setSuccess(''), 2500);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Failed to save quiz changes.');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateQuizLesson = async () => {
    if (!selectedSection || !quizFormData.title.trim()) {
      setError('Select a section and enter a quiz title first.');
      return;
    }

    const nextSections = (course?.sections || []).map((section) => {
      if (String(section._id) !== String(selectedSection)) {
        return section;
      }

      const nextLessons = [...(section.lessons || [])];
      nextLessons.push({
        title: quizFormData.title.trim(),
        description: quizFormData.description.trim(),
        type: 'quiz',
        content: quizFormData.description.trim(),
        duration: Number(quizFormData.duration || 0),
        isFree: false,
        order: nextLessons.length + 1,
        resources: [],
        quiz: {
          instructions: quizFormData.instructions.trim(),
          passingScore: Number(quizFormData.passingScore || 50),
          allowRetry: Boolean(quizFormData.allowRetry),
          maxAttempts: Number(quizFormData.maxAttempts || 0),
          questions: []
        }
      });

      return {
        ...section,
        lessons: nextLessons
      };
    });

    await persistSections(nextSections, 'Quiz lesson created successfully.');
    setQuizFormData(emptyQuizForm);
    setShowNewQuizForm(false);
  };

  const handleDeleteQuizLesson = async (lessonId) => {
    const nextSections = (course?.sections || []).map((section) => ({
      ...section,
      lessons: (section.lessons || [])
        .filter((lesson) => lesson._id !== lessonId)
        .map((lesson, index) => ({ ...lesson, order: index + 1 }))
    }));

    await persistSections(nextSections, 'Quiz lesson deleted successfully.');
    if (activeQuizId === lessonId) {
      setActiveQuizId('');
    }
  };

  const handleAddQuestion = async (lessonId) => {
    if (!questionFormData.prompt.trim()) {
      setError('Enter a question prompt first.');
      return;
    }

    if (
      (questionFormData.type === 'multiple-choice' || questionFormData.type === 'true-false') &&
      questionFormData.options.filter((option) => option.text.trim()).length < 2
    ) {
      setError('Provide at least two options for this question.');
      return;
    }

    const nextSections = (course?.sections || []).map((section) => ({
      ...section,
      lessons: (section.lessons || []).map((lesson) => {
        if (lesson._id !== lessonId) {
          return lesson;
        }

        const nextQuestions = [...(lesson.quiz?.questions || [])];
        nextQuestions.push({
          prompt: questionFormData.prompt.trim(),
          type: questionFormData.type,
          points: Number(questionFormData.points || 1),
          correctAnswer: questionFormData.correctAnswer.trim(),
          explanation: questionFormData.explanation.trim(),
          order: nextQuestions.length + 1,
          options: (questionFormData.type === 'multiple-choice' || questionFormData.type === 'true-false')
            ? questionFormData.options
              .filter((option) => option.text.trim())
              .map((option) => ({
                text: option.text.trim(),
                isCorrect: Boolean(option.isCorrect)
              }))
            : []
        });

        return {
          ...lesson,
          quiz: {
            ...(lesson.quiz || {}),
            questions: nextQuestions
          }
        };
      })
    }));

    await persistSections(nextSections, 'Question added successfully.');
    setQuestionFormData(emptyQuestionForm);
  };

  const handleDeleteQuestion = async (lessonId, questionId) => {
    const nextSections = (course?.sections || []).map((section) => ({
      ...section,
      lessons: (section.lessons || []).map((lesson) => {
        if (lesson._id !== lessonId) {
          return lesson;
        }

        return {
          ...lesson,
          quiz: {
            ...(lesson.quiz || {}),
            questions: (lesson.quiz?.questions || [])
              .filter((question) => question._id !== questionId)
              .map((question, index) => ({
                ...question,
                order: index + 1
              }))
          }
        };
      })
    }));

    await persistSections(nextSections, 'Question deleted successfully.');
  };

  const getQuizStats = (lessonId, passingScore) => {
    const attempts = (course?.enrolledStudents || []).flatMap((enrollment) =>
      (enrollment.quizAttempts || []).filter((attempt) => String(attempt.lessonId) === String(lessonId))
    );

    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passRate: 0
      };
    }

    const passedAttempts = attempts.filter((attempt) => attempt.percentageScore >= passingScore).length;
    const averageScore = Math.round(
      attempts.reduce((sum, attempt) => sum + Number(attempt.percentageScore || 0), 0) / attempts.length
    );

    return {
      totalAttempts: attempts.length,
      averageScore,
      passRate: Math.round((passedAttempts / attempts.length) * 100)
    };
  };

  const updateOption = (index, field, value) => {
    setQuestionFormData((prev) => {
      const nextOptions = [...prev.options];
      nextOptions[index] = {
        ...nextOptions[index],
        [field]: value
      };
      return {
        ...prev,
        options: nextOptions
      };
    });
  };

  const addOption = () => {
    setQuestionFormData((prev) => ({
      ...prev,
      options: [...prev.options, { text: '', isCorrect: false }]
    }));
  };

  if (loading) {
    return (
      <div className="formateur-page">
        <div className="loading-container">
          <p>Loading quiz management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          <div className="navbar-dashboard-center">
            <h1>Quiz Management</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Quiz Management</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">
          <ProfilSection />

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="quiz-management-container">
            <div className="course-selector-section">
              <h2>Select Formation</h2>
              <div className="course-selector-buttons">
                {courses.length === 0 ? (
                  <p className="no-courses">No courses found. Create a course first.</p>
                ) : (
                  courses.map((item) => (
                    <button
                      key={item._id}
                      className={`course-btn ${selectedCourse === item._id ? 'active' : ''}`}
                      onClick={() => setSelectedCourse(item._id)}
                    >
                      {item.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            {course && (
              <>
                <div className="quizzes-header">
                  <div>
                    <h2>Quizzes Inside {course.title}</h2>
                    <p style={{ color: '#6b7280' }}>
                      Manage quiz lessons from the real sections of this course.
                    </p>
                  </div>
                  <button
                    className="btn-create-quiz"
                    onClick={() => setShowNewQuizForm((value) => !value)}
                    disabled={!course.sections?.length}
                  >
                    <FaPlus /> Add Quiz Lesson
                  </button>
                </div>

                {course.sections?.length > 0 && (
                  <div className="form-group">
                    <label>Select Section</label>
                    <select
                      className="form-input"
                      value={selectedSection}
                      onChange={(event) => setSelectedSection(event.target.value)}
                    >
                      {(course.sections || []).map((section) => (
                        <option key={section._id} value={section._id}>
                          {section.title}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {showNewQuizForm && selectedSectionDetails && (
                  <div className="quiz-form-card">
                    <h3>Create Quiz Lesson in {selectedSectionDetails.title}</h3>
                    <div className="form-group">
                      <label>Quiz Title *</label>
                      <input
                        type="text"
                        className="form-input"
                        value={quizFormData.title}
                        onChange={(event) => setQuizFormData((prev) => ({ ...prev, title: event.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        value={quizFormData.description}
                        onChange={(event) => setQuizFormData((prev) => ({ ...prev, description: event.target.value }))}
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Duration (minutes)</label>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          value={quizFormData.duration}
                          onChange={(event) => setQuizFormData((prev) => ({ ...prev, duration: event.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Passing Score (%)</label>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          max="100"
                          value={quizFormData.passingScore}
                          onChange={(event) => setQuizFormData((prev) => ({ ...prev, passingScore: event.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Max Attempts (0 = unlimited)</label>
                        <input
                          type="number"
                          className="form-input"
                          min="0"
                          value={quizFormData.maxAttempts}
                          onChange={(event) => setQuizFormData((prev) => ({ ...prev, maxAttempts: event.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Instructions</label>
                      <textarea
                        className="form-textarea"
                        rows="3"
                        value={quizFormData.instructions}
                        onChange={(event) => setQuizFormData((prev) => ({ ...prev, instructions: event.target.value }))}
                      />
                    </div>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={quizFormData.allowRetry}
                        onChange={(event) => setQuizFormData((prev) => ({ ...prev, allowRetry: event.target.checked }))}
                      />
                      Allow retry
                    </label>
                    <div className="form-buttons">
                      <button onClick={handleCreateQuizLesson} className="btn-submit-form" disabled={saving}>
                        {saving ? 'Saving...' : 'Create Quiz Lesson'}
                      </button>
                      <button
                        onClick={() => setShowNewQuizForm(false)}
                        className="btn-cancel-form"
                        disabled={saving}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="quizzes-grid">
                  {quizLessons.length === 0 ? (
                    <p className="no-quizzes">No quiz lessons yet. Add one to a section and start building questions.</p>
                  ) : (
                    quizLessons.map((quizLesson) => {
                      const stats = getQuizStats(quizLesson._id, quizLesson.quiz?.passingScore || 50);
                      const isActive = activeQuizId === quizLesson._id;

                      return (
                        <div key={quizLesson._id} className="quiz-card">
                          <div className="quiz-card-header">
                            <div>
                              <h3>{quizLesson.title}</h3>
                              <p className="quiz-description">{quizLesson.sectionTitle}</p>
                            </div>
                            <span className="status-badge">{quizLesson.quiz?.questions?.length || 0} Questions</span>
                          </div>

                          {quizLesson.description && (
                            <p className="quiz-description">{quizLesson.description}</p>
                          )}

                          <div className="quiz-stats-mini">
                            <span>Pass Score: {quizLesson.quiz?.passingScore || 50}%</span>
                            <span>Attempts: {stats.totalAttempts}</span>
                            <span>Avg Score: {stats.averageScore}%</span>
                          </div>

                          <div className="quiz-card-questions">
                            <h4>Questions ({quizLesson.quiz?.questions?.length || 0})</h4>
                            {quizLesson.quiz?.questions?.length > 0 ? (
                              <ul className="questions-list">
                                {quizLesson.quiz.questions.map((question, index) => (
                                  <li key={question._id || index} className="question-item">
                                    <span>{index + 1}. {question.prompt}</span>
                                    <span className="question-type">{question.type}</span>
                                    <button
                                      onClick={() => handleDeleteQuestion(quizLesson._id, question._id)}
                                      className="btn-delete-question"
                                      title="Delete question"
                                      disabled={saving}
                                    >
                                      <FaTrash />
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="no-questions">No questions added yet.</p>
                            )}

                            {isActive && (
                              <div className="question-form">
                                <h4>Add New Question</h4>
                                <div className="form-group">
                                  <label>Question Prompt *</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={questionFormData.prompt}
                                    onChange={(event) => setQuestionFormData((prev) => ({ ...prev, prompt: event.target.value }))}
                                  />
                                </div>
                                <div className="form-row">
                                  <div className="form-group">
                                    <label>Question Type</label>
                                    <select
                                      className="form-input"
                                      value={questionFormData.type}
                                      onChange={(event) => setQuestionFormData((prev) => ({ ...prev, type: event.target.value }))}
                                    >
                                      <option value="multiple-choice">Multiple Choice</option>
                                      <option value="true-false">True / False</option>
                                      <option value="short-answer">Short Answer</option>
                                      <option value="essay">Essay</option>
                                    </select>
                                  </div>
                                  <div className="form-group">
                                    <label>Points</label>
                                    <input
                                      type="number"
                                      min="1"
                                      className="form-input"
                                      value={questionFormData.points}
                                      onChange={(event) => setQuestionFormData((prev) => ({ ...prev, points: event.target.value }))}
                                    />
                                  </div>
                                </div>

                                {(questionFormData.type === 'multiple-choice' || questionFormData.type === 'true-false') && (
                                  <div className="form-group">
                                    <label>Options</label>
                                    {questionFormData.options.map((option, index) => (
                                      <div key={index} className="option-input-group">
                                        <input
                                          type="text"
                                          className="form-input"
                                          value={option.text}
                                          placeholder={`Option ${index + 1}`}
                                          onChange={(event) => updateOption(index, 'text', event.target.value)}
                                        />
                                        <label className="checkbox-label">
                                          <input
                                            type="checkbox"
                                            checked={option.isCorrect}
                                            onChange={(event) => updateOption(index, 'isCorrect', event.target.checked)}
                                          />
                                          Correct
                                        </label>
                                      </div>
                                    ))}
                                    <button onClick={addOption} className="btn-add-option">
                                      + Add Option
                                    </button>
                                  </div>
                                )}

                                <div className="form-group">
                                  <label>Correct Answer</label>
                                  <input
                                    type="text"
                                    className="form-input"
                                    value={questionFormData.correctAnswer}
                                    onChange={(event) => setQuestionFormData((prev) => ({ ...prev, correctAnswer: event.target.value }))}
                                  />
                                </div>
                                <div className="form-group">
                                  <label>Explanation</label>
                                  <textarea
                                    className="form-textarea"
                                    rows="2"
                                    value={questionFormData.explanation}
                                    onChange={(event) => setQuestionFormData((prev) => ({ ...prev, explanation: event.target.value }))}
                                  />
                                </div>
                                <div className="form-buttons">
                                  <button
                                    onClick={() => handleAddQuestion(quizLesson._id)}
                                    className="btn-submit-form"
                                    disabled={saving}
                                  >
                                    {saving ? 'Saving...' : 'Add Question'}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setActiveQuizId('');
                                      setQuestionFormData(emptyQuestionForm);
                                    }}
                                    className="btn-cancel-form"
                                    disabled={saving}
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            )}

                            {!isActive && (
                              <button
                                onClick={() => {
                                  setActiveQuizId(quizLesson._id);
                                  setQuestionFormData(emptyQuestionForm);
                                }}
                                className="btn-add-question"
                              >
                                <FaPlus /> Add Question
                              </button>
                            )}
                          </div>

                          <div className="quiz-card-footer">
                            <button className="btn-action" type="button">
                              <FaChartBar /> Pass Rate {stats.passRate}%
                            </button>
                            <button
                              onClick={() => handleDeleteQuizLesson(quizLesson._id)}
                              className="btn-delete-action"
                              disabled={saving}
                            >
                              <FaTrash /> Delete Quiz
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurQuiz;
