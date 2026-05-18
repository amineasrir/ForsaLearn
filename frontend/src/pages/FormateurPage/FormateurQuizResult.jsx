import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { FaDownload, FaEye } from 'react-icons/fa';
import {
  getFormateurCourse,
  getFormateurCourses
} from '../../services/formateurService';

const FormateurQuizResult = () => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchStudent, setSearchStudent] = useState('');
  const [error, setError] = useState('');

  const loadCourses = async () => {
    setLoading(true);
    try {
      const response = await getFormateurCourses();
      const nextCourses = response.data?.data || [];
      setCourses(nextCourses);

      if (nextCourses.length > 0) {
        setSelectedCourse(nextCourses[0]._id);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error fetching courses');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseDetails = async (courseId) => {
    if (!courseId) {
      setCourse(null);
      return;
    }

    try {
      const response = await getFormateurCourse(courseId);
      const nextCourse = response.data?.data || null;
      setCourse(nextCourse);

      const firstQuiz = (nextCourse?.sections || []).flatMap((section) =>
        (section.lessons || []).filter((lesson) => lesson.type === 'quiz')
      )[0];

      setSelectedQuiz((current) => current || firstQuiz?._id || '');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Error fetching course details');
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      loadCourseDetails(selectedCourse);
    }
  }, [selectedCourse]);

  const quizzes = useMemo(
    () => (course?.sections || []).flatMap((section) =>
      (section.lessons || [])
        .filter((lesson) => lesson.type === 'quiz')
        .map((lesson) => ({
          ...lesson,
          sectionTitle: section.title
        }))
    ),
    [course]
  );

  const currentQuiz = useMemo(
    () => quizzes.find((quiz) => String(quiz._id) === String(selectedQuiz)) || null,
    [quizzes, selectedQuiz]
  );

  const studentResults = useMemo(() => {
    if (!currentQuiz) {
      return [];
    }

    return (course?.enrolledStudents || []).flatMap((enrollment) =>
      (enrollment.quizAttempts || [])
        .filter((attempt) => String(attempt.lessonId) === String(currentQuiz._id))
        .map((attempt) => ({
          ...attempt,
          student: enrollment.student
        }))
    );
  }, [course, currentQuiz]);

  const stats = useMemo(() => {
    if (!currentQuiz || studentResults.length === 0) {
      return {
        totalAttempts: 0,
        completedAttempts: 0,
        averageScore: 0,
        passRate: 0
      };
    }

    const passedAttempts = studentResults.filter((result) => result.passed).length;
    const averageScore = Math.round(
      studentResults.reduce((sum, result) => sum + Number(result.percentageScore || 0), 0) / studentResults.length
    );

    return {
      totalAttempts: studentResults.length,
      completedAttempts: studentResults.length,
      averageScore,
      passRate: Math.round((passedAttempts / studentResults.length) * 100)
    };
  }, [currentQuiz, studentResults]);

  const filteredResults = useMemo(() => {
    let nextResults = [...studentResults];

    if (filterStatus !== 'all') {
      nextResults = nextResults.filter((result) => filterStatus === 'passed' ? result.passed : !result.passed);
    }

    if (searchStudent.trim()) {
      nextResults = nextResults.filter((result) =>
        String(result.student?.fullName || '').toLowerCase().includes(searchStudent.trim().toLowerCase())
      );
    }

    return nextResults;
  }, [filterStatus, searchStudent, studentResults]);

  const downloadResultsCSV = () => {
    if (!currentQuiz) {
      return;
    }

    const headers = ['Student Name', 'Email', 'Score', 'Percentage', 'Status', 'Attempt', 'Completed At'];
    const rows = filteredResults.map((result) => [
      result.student?.fullName || 'Unknown',
      result.student?.email || 'N/A',
      `${result.score}/${result.totalPoints}`,
      `${result.percentageScore}%`,
      result.passed ? 'Passed' : 'Failed',
      result.attemptNumber,
      result.completedAt ? new Date(result.completedAt).toLocaleString() : 'N/A'
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    element.setAttribute('download', `quiz_results_${currentQuiz.title}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="formateur-page">
        <div className="loading-container">
          <p>Loading quiz results...</p>
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
            <h1>Quiz Results</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Quiz Results</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">
          <ProfilSection />

          {error && <div className="alert alert-error">{error}</div>}

          <div className="quiz-results-container">
            <div className="quiz-selection-section">
              <h2>Select Course</h2>
              <div className="course-selector-buttons">
                {courses.length === 0 ? (
                  <p className="no-quizzes">No courses found</p>
                ) : (
                  courses.map((item) => (
                    <button
                      key={item._id}
                      className={`course-btn ${selectedCourse === item._id ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedCourse(item._id);
                        setSelectedQuiz('');
                      }}
                    >
                      {item.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="quiz-selection-section">
              <h2>Select Quiz to View Results</h2>
              <div className="quiz-selection-tabs">
                {quizzes.length === 0 ? (
                  <p className="no-quizzes">No quizzes found in this course</p>
                ) : (
                  quizzes.map((quiz) => (
                    <button
                      key={quiz._id}
                      className={`quiz-tab ${selectedQuiz === quiz._id ? 'active' : ''}`}
                      onClick={() => setSelectedQuiz(quiz._id)}
                    >
                      <span className="tab-title">{quiz.title}</span>
                      <span className="tab-count">{studentResults.filter((result) => String(result.lessonId) === String(quiz._id)).length}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {currentQuiz && (
              <>
                <div className="quiz-results-header">
                  <div className="quiz-info">
                    <h3>{currentQuiz.title}</h3>
                    <p className="quiz-description">{currentQuiz.description || currentQuiz.sectionTitle}</p>
                  </div>
                  <div className="results-stats-summary">
                    <div className="stat">
                      <label>Total Attempts</label>
                      <p>{stats.totalAttempts}</p>
                    </div>
                    <div className="stat">
                      <label>Completed</label>
                      <p>{stats.completedAttempts}</p>
                    </div>
                    <div className="stat">
                      <label>Avg Score</label>
                      <p>{stats.averageScore}%</p>
                    </div>
                    <div className="stat">
                      <label>Pass Rate</label>
                      <p>{stats.passRate}%</p>
                    </div>
                  </div>
                </div>

                <div className="results-filters-section">
                  <div className="filter-group">
                    <input
                      type="text"
                      placeholder="Search student name..."
                      value={searchStudent}
                      onChange={(event) => setSearchStudent(event.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-group">
                    <select
                      value={filterStatus}
                      onChange={(event) => setFilterStatus(event.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Results</option>
                      <option value="passed">Passed Only</option>
                      <option value="failed">Failed Only</option>
                    </select>
                  </div>

                  <button onClick={downloadResultsCSV} className="btn-download-results">
                    <FaDownload /> Download CSV
                  </button>
                </div>

                <div className="results-table-section">
                  <h3>Student Results ({filteredResults.length})</h3>

                  {filteredResults.length === 0 ? (
                    <p className="no-results">No student results found</p>
                  ) : (
                    <div className="results-table-wrapper">
                      <table className="results-table">
                        <thead>
                          <tr>
                            <th>Student Name</th>
                            <th>Email</th>
                            <th>Score</th>
                            <th>Percentage</th>
                            <th>Status</th>
                            <th>Attempt</th>
                            <th>Completed At</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((result, index) => (
                            <tr key={`${result.student?._id || 'student'}-${index}`} className="result-row">
                              <td className="student-name">{result.student?.fullName || 'Unknown'}</td>
                              <td className="student-email">{result.student?.email || 'N/A'}</td>
                              <td className="score">{result.score}/{result.totalPoints}</td>
                              <td className="percentage">
                                <span className="percentage-badge">
                                  {result.percentageScore}%
                                </span>
                              </td>
                              <td className="status">
                                <span className={`status-label ${result.passed ? 'passed' : 'failed'}`}>
                                  {result.passed ? 'Passed' : 'Failed'}
                                </span>
                              </td>
                              <td className="attempts">#{result.attemptNumber}</td>
                              <td className="completed-date">
                                {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : 'N/A'}
                              </td>
                              <td className="action-cell">
                                <button
                                  onClick={() => setSelectedResult(result)}
                                  className="btn-view-details"
                                >
                                  <FaEye /> Details
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {selectedResult && currentQuiz && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <div className="modal-header">
              <h3>Student Answer Review</h3>
              <button onClick={() => setSelectedResult(null)} className="btn-close-modal">
                x
              </button>
            </div>

            <div className="student-info-section">
              <div className="student-info">
                <h4>{selectedResult.student?.fullName || 'Unknown'}</h4>
                <p>{selectedResult.student?.email || 'N/A'}</p>
              </div>
              <div className="result-summary">
                <div className="summary-item">
                  <label>Score</label>
                  <p><strong>{selectedResult.score}/{selectedResult.totalPoints}</strong></p>
                </div>
                <div className="summary-item">
                  <label>Percentage</label>
                  <p><strong>{selectedResult.percentageScore}%</strong></p>
                </div>
                <div className="summary-item">
                  <label>Status</label>
                  <p><strong>{selectedResult.passed ? 'Passed' : 'Failed'}</strong></p>
                </div>
              </div>
            </div>

            <div className="answers-review-section">
              <h4>Answer Review</h4>
              {selectedResult.answers && selectedResult.answers.length > 0 ? (
                <div className="answers-list">
                  {selectedResult.answers.map((answer, index) => {
                    const question = currentQuiz.quiz?.questions?.find(
                      (item) => String(item._id) === String(answer.questionId)
                    );

                    return (
                      <div
                        key={`${answer.questionId}-${index}`}
                        className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                      >
                        <div className="answer-header">
                          <h5>{index + 1}. {question?.prompt || 'Question'}</h5>
                          <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                            {answer.isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <div className="answer-content">
                          <div className="student-answer">
                            <label>Student Answer:</label>
                            <p className="answer-text">{answer.selectedAnswer || 'No answer'}</p>
                            <span className="points-earned">
                              Points: {answer.pointsEarned || 0}/{question?.points || 0}
                            </span>
                          </div>

                          {question?.correctAnswer && !answer.isCorrect && (
                            <div className="correct-answer">
                              <label>Correct Answer:</label>
                              <p className="answer-text">{question.correctAnswer}</p>
                            </div>
                          )}

                          {question?.explanation && (
                            <div className="answer-explanation">
                              <label>Explanation:</label>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-answers">No answers recorded</p>
              )}
            </div>

            <div className="modal-footer">
              <button onClick={() => setSelectedResult(null)} className="btn-close-review">
                Close Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormateurQuizResult;
