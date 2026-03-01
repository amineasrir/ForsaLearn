import React, { useState, useEffect } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus, FaEye, FaChartBar } from 'react-icons/fa';

const FormateurQuiz = () => {
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNewQuizForm, setShowNewQuizForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizFormData, setQuizFormData] = useState({
    title: '',
    description: '',
    courseId: ''
  });
  const [questionFormData, setQuestionFormData] = useState({
    type: 'multiple-choice',
    title: '',
    points: 1,
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
    correctAnswer: '',
    explanation: ''
  });
  const [quizStats, setQuizStats] = useState(null);

  const API_URL = 'http://localhost:5000/api';

  // Fetch courses on mount
  useEffect(() => {
    fetchCourses();
  }, []);

  // Fetch quizzes when course is selected
  useEffect(() => {
    if (selectedCourse) {
      fetchQuizzes(selectedCourse);
    }
  }, [selectedCourse]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/formateur/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data?.data) {
        setCourses(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedCourse(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuizzes = async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/quiz?courseId=${courseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuizzes(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleCreateQuiz = async () => {
    if (!quizFormData.title || !quizFormData.courseId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/quiz`,
        {
          title: quizFormData.title,
          description: quizFormData.description,
          courseId: quizFormData.courseId
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setQuizzes([...quizzes, response.data.data]);
      setQuizFormData({ title: '', description: '', courseId: selectedCourse });
      setShowNewQuizForm(false);
      alert('Quiz created successfully!');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Error creating quiz');
    }
  };

  const handleUpdateQuiz = async (quizId, updates) => {
    try {
      const response = await axios.patch(
        `${API_URL}/quiz/${quizId}`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setQuizzes(quizzes.map(q => (q._id === quizId ? response.data.data : q)));
      alert('Quiz updated successfully!');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Error updating quiz');
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) return;

    try {
      await axios.delete(`${API_URL}/quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuizzes(quizzes.filter(q => q._id !== quizId));
      alert('Quiz deleted successfully!');
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Error deleting quiz');
    }
  };

  const handleAddQuestion = async (quizId) => {
    if (!questionFormData.title) {
      alert('Please enter a question title');
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/quiz/${quizId}/questions`,
        questionFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setQuizzes(quizzes.map(q => (q._id === quizId ? response.data.data : q)));
      setQuestionFormData({
        type: 'multiple-choice',
        title: '',
        points: 1,
        options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
        correctAnswer: '',
        explanation: ''
      });
      setShowQuestionForm(false);
      alert('Question added successfully!');
    } catch (error) {
      console.error('Error adding question:', error);
      alert('Error adding question');
    }
  };

  const handleDeleteQuestion = async (quizId, questionId) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;

    try {
      const response = await axios.delete(`${API_URL}/quiz/${quizId}/questions/${questionId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuizzes(quizzes.map(q => (q._id === quizId ? response.data.data : q)));
      alert('Question deleted successfully!');
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Error deleting question');
    }
  };

  const fetchQuizStats = async (quizId) => {
    try {
      const response = await axios.get(`${API_URL}/quiz/${quizId}/statistics`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuizStats(response.data.data);
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...questionFormData.options];
    newOptions[index][field] = value;
    setQuestionFormData({ ...questionFormData, options: newOptions });
  };

  const addOption = () => {
    setQuestionFormData({
      ...questionFormData,
      options: [...questionFormData.options, { text: '', isCorrect: false }]
    });
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

          <div className="quiz-management-container">
            {/* Course Selection */}
            <div className="course-selector-section">
              <h2>Select Formation</h2>
              <div className="course-selector-buttons">
                {courses.length === 0 ? (
                  <p className="no-courses">No courses found. Create a course first.</p>
                ) : (
                  courses.map(course => (
                    <button
                      key={course._id}
                      className={`course-btn ${selectedCourse === course._id ? 'active' : ''}`}
                      onClick={() => setSelectedCourse(course._id)}
                    >
                      {course.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedCourse && (
              <>
                {/* Quizzes List Header */}
                <div className="quizzes-header">
                  <h2>Quizzes for Selected Formation</h2>
                  <button
                    className="btn-create-quiz"
                    onClick={() => {
                      setQuizFormData({ ...quizFormData, courseId: selectedCourse });
                      setShowNewQuizForm(true);
                    }}
                  >
                    <FaPlus /> Create New Quiz
                  </button>
                </div>

                {/* New Quiz Form */}
                {showNewQuizForm && (
                  <div className="quiz-form-card">
                    <h3>Create New Quiz</h3>
                    <div className="form-group">
                      <label>Quiz Title *</label>
                      <input
                        type="text"
                        value={quizFormData.title}
                        onChange={(e) =>
                          setQuizFormData({ ...quizFormData, title: e.target.value })
                        }
                        placeholder="Quiz title"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea
                        value={quizFormData.description}
                        onChange={(e) =>
                          setQuizFormData({ ...quizFormData, description: e.target.value })
                        }
                        placeholder="Quiz description"
                        className="form-textarea"
                        rows="3"
                      />
                    </div>
                    <div className="form-buttons">
                      <button
                        onClick={handleCreateQuiz}
                        className="btn-submit-form"
                      >
                        Create Quiz
                      </button>
                      <button
                        onClick={() => setShowNewQuizForm(false)}
                        className="btn-cancel-form"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Quizzes Grid */}
                <div className="quizzes-grid">
                  {quizzes.length === 0 ? (
                    <p className="no-quizzes">
                      No quizzes yet. Create your first quiz for this formation!
                    </p>
                  ) : (
                    quizzes.map(quiz => (
                      <div key={quiz._id} className="quiz-card">
                        <div className="quiz-card-header">
                          <h3>{quiz.title}</h3>
                          <span className={`status-badge ${quiz.status}`}>
                            {quiz.status}
                          </span>
                        </div>

                        {quiz.description && (
                          <p className="quiz-description">{quiz.description}</p>
                        )}

                        <div className="quiz-stats-mini">
                          <span>Questions: {quiz.questions?.length || 0}</span>
                          <span>Points: {quiz.settings?.totalPoints || 0}</span>
                          <span>Pass Score: {quiz.settings?.passingScore || 0}%</span>
                        </div>

                        <div className="quiz-card-questions">
                          <h4>Questions ({quiz.questions?.length || 0})</h4>
                          {quiz.questions && quiz.questions.length > 0 ? (
                            <ul className="questions-list">
                              {quiz.questions.map((q, idx) => (
                                <li key={q._id || idx} className="question-item">
                                  <span>{idx + 1}. {q.title}</span>
                                  <span className="question-type">{q.type}</span>
                                  <button
                                    onClick={() => handleDeleteQuestion(quiz._id, q._id)}
                                    className="btn-delete-question"
                                    title="Delete question"
                                  >
                                    <FaTrash />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="no-questions">No questions added yet</p>
                          )}

                          {selectedQuiz?._id === quiz._id && showQuestionForm ? (
                            <div className="question-form">
                              <h4>Add New Question</h4>
                              <div className="form-group">
                                <label>Question Type</label>
                                <select
                                  value={questionFormData.type}
                                  onChange={(e) =>
                                    setQuestionFormData({
                                      ...questionFormData,
                                      type: e.target.value
                                    })
                                  }
                                  className="form-input"
                                >
                                  <option value="multiple-choice">Multiple Choice</option>
                                  <option value="true-false">True / False</option>
                                  <option value="short-answer">Short Answer</option>
                                  <option value="essay">Essay</option>
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Question Title *</label>
                                <input
                                  type="text"
                                  value={questionFormData.title}
                                  onChange={(e) =>
                                    setQuestionFormData({
                                      ...questionFormData,
                                      title: e.target.value
                                    })
                                  }
                                  placeholder="Enter your question"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label>Points</label>
                                <input
                                  type="number"
                                  value={questionFormData.points}
                                  onChange={(e) =>
                                    setQuestionFormData({
                                      ...questionFormData,
                                      points: parseInt(e.target.value)
                                    })
                                  }
                                  min="1"
                                  className="form-input"
                                />
                              </div>

                              {(questionFormData.type === 'multiple-choice' ||
                                questionFormData.type === 'true-false') && (
                                <div className="form-group">
                                  <label>Options</label>
                                  {questionFormData.options.map((option, idx) => (
                                    <div key={idx} className="option-input-group">
                                      <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) =>
                                          handleOptionChange(idx, 'text', e.target.value)
                                        }
                                        placeholder={`Option ${idx + 1}`}
                                        className="form-input"
                                      />
                                      <label className="checkbox-label">
                                        <input
                                          type="checkbox"
                                          checked={option.isCorrect}
                                          onChange={(e) =>
                                            handleOptionChange(
                                              idx,
                                              'isCorrect',
                                              e.target.checked
                                            )
                                          }
                                        />
                                        Correct
                                      </label>
                                    </div>
                                  ))}
                                  <button
                                    onClick={addOption}
                                    className="btn-add-option"
                                  >
                                    + Add Option
                                  </button>
                                </div>
                              )}

                              <div className="form-group">
                                <label>Explanation</label>
                                <textarea
                                  value={questionFormData.explanation}
                                  onChange={(e) =>
                                    setQuestionFormData({
                                      ...questionFormData,
                                      explanation: e.target.value
                                    })
                                  }
                                  placeholder="Explain the correct answer"
                                  className="form-textarea"
                                  rows="2"
                                />
                              </div>

                              <div className="form-buttons">
                                <button
                                  onClick={() => handleAddQuestion(quiz._id)}
                                  className="btn-submit-form"
                                >
                                  Add Question
                                </button>
                                <button
                                  onClick={() => {
                                    setShowQuestionForm(false);
                                    setSelectedQuiz(null);
                                  }}
                                  className="btn-cancel-form"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedQuiz(quiz);
                                setShowQuestionForm(true);
                              }}
                              className="btn-add-question"
                            >
                              <FaPlus /> Add Question
                            </button>
                          )}
                        </div>

                        <div className="quiz-card-footer">
                          <button
                            onClick={() => fetchQuizStats(quiz._id)}
                            className="btn-action"
                            title="View statistics"
                          >
                            <FaChartBar /> Stats
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateQuiz(quiz._id, {
                                status: quiz.status === 'published' ? 'draft' : 'published'
                              })
                            }
                            className="btn-action"
                          >
                            {quiz.status === 'published' ? 'Unpublish' : 'Publish'}
                          </button>
                          <button
                            onClick={() => handleDeleteQuiz(quiz._id)}
                            className="btn-delete-action"
                            title="Delete quiz"
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Quiz Statistics Modal */}
                {quizStats && (
                  <div className="stats-modal">
                    <div className="stats-modal-content">
                      <h3>Quiz Statistics</h3>
                      <div className="stats-grid">
                        <div className="stat-item">
                          <label>Total Attempts</label>
                          <p>{quizStats.totalAttempts || 0}</p>
                        </div>
                        <div className="stat-item">
                          <label>Completed</label>
                          <p>{quizStats.completedAttempts || 0}</p>
                        </div>
                        <div className="stat-item">
                          <label>Average Score</label>
                          <p>{quizStats.averageScore || 0}%</p>
                        </div>
                        <div className="stat-item">
                          <label>Passed</label>
                          <p>{quizStats.passedAttempts || 0}</p>
                        </div>
                        <div className="stat-item">
                          <label>Pass Rate</label>
                          <p>{quizStats.passRate || 0}%</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setQuizStats(null)}
                        className="btn-close-modal"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurQuiz;
