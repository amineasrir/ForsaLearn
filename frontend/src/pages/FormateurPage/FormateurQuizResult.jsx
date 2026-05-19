import React, { useState, useEffect } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import API from '../../api/axios';
import { FaEye, FaDownload, FaFilter, FaChartBar } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const FormateurQuizResult = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all'); // all, passed, failed
  const [searchStudent, setSearchStudent] = useState('');
  const [stats, setStats] = useState(null);
  const { t } = useTranslation();

  // Fetch quizzes on mount
  useEffect(() => {
    fetchQuizzes();
  }, []);

  // Fetch student results when quiz is selected
  useEffect(() => {
    if (selectedQuiz) {
      fetchStudentResults(selectedQuiz);
      fetchQuizStats(selectedQuiz);
    }
  }, [selectedQuiz]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await API.get('/quiz');

      if (response.data?.data) {
        setQuizzes(response.data.data);
        if (response.data.data.length > 0) {
          setSelectedQuiz(response.data.data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      alert(t('formateur.quizResults.errorFetchingQuizzes'));
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentResults = async (quizId) => {
    try {
      const response = await API.get(`/quiz/${quizId}`);

      if (response.data?.data?.attempts) {
        setStudentResults(response.data.data.attempts);
      }
    } catch (error) {
      console.error('Error fetching student results:', error);
    }
  };

  const fetchQuizStats = async (quizId) => {
    try {
      const response = await API.get(`/quiz/${quizId}/statistics`);

      if (response.data?.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching quiz stats:', error);
    }
  };

  // Filter results based on status and search
  const getFilteredResults = () => {
    let filtered = studentResults;

    // Filter by status (passed/failed)
    if (filterStatus !== 'all') {
      const passingScore = selectedQuiz ? quizzes.find(q => q._id === selectedQuiz)?.settings?.passingScore || 50 : 50;
      filtered = filtered.filter(result => {
        if (filterStatus === 'passed') {
          return result.percentageScore >= passingScore;
        } else if (filterStatus === 'failed') {
          return result.percentageScore < passingScore;
        }
        return true;
      });
    }

    // Filter by student name
    if (searchStudent.trim()) {
      filtered = filtered.filter(result => {
        const studentName = result.student?.firstName || '' + ' ' + (result.student?.lastName || '');
        return studentName.toLowerCase().includes(searchStudent.toLowerCase());
      });
    }

    return filtered;
  };

  const filteredResults = getFilteredResults();

  const getScoreColor = (percentage, passingScore = 50) => {
    if (percentage >= passingScore) return '#16a34a'; // green
    if (percentage >= passingScore - 10) return '#f59e0b'; // orange
    return '#ef4444'; // red
  };

  const downloadResultsCSV = () => {
    if (!selectedQuiz) return;

    const quiz = quizzes.find(q => q._id === selectedQuiz);
    const headers = ['Student Name', 'Email', 'Score', 'Percentage', 'Status', 'Attempts', 'Completed At'];
    const rows = filteredResults.map(result => {
      const passingScore = quiz?.settings?.passingScore || 50;
      const status = result.percentageScore >= passingScore ? 'Passed' : 'Failed';
      return [
        `${result.student?.firstName || ''} ${result.student?.lastName || ''}`,
        result.student?.email || 'N/A',
        `${result.score}/${quiz?.settings?.totalPoints || 0}`,
        `${result.percentageScore}%`,
        status,
        result.status,
        new Date(result.completedAt).toLocaleDateString()
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`);
    element.setAttribute('download', `quiz_results_${quiz?.title}.csv`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="formateur-page">
        <div className="loading-container">
          <p>{t('formateur.quizResults.loadingQuizResults')}</p>
        </div>
      </div>
    );
  }

  const currentQuiz = quizzes.find(q => q._id === selectedQuiz);
  const passingScore = currentQuiz?.settings?.passingScore || 50;

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">

          <div className="quiz-results-container">
            {/* Quiz Selection */}
            <div className="quiz-selection-section">
              <h2>{t('formateur.quizResults.selectQuizTitle')}</h2>
              <div className="quiz-selection-tabs">
                {quizzes.length === 0 ? (
                  <p className="no-quizzes">{t('formateur.quizResults.noQuizzes')}</p>
                ) : (
                  quizzes.map(quiz => (
                    <button
                      key={quiz._id}
                      className={`quiz-tab ${selectedQuiz === quiz._id ? 'active' : ''}`}
                      onClick={() => setSelectedQuiz(quiz._id)}
                    >
                      <span className="tab-title">{quiz.title}</span>
                      <span className="tab-count">{quiz.attempts?.length || 0}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            {selectedQuiz && (
              <>
                {/* Quiz Header & Statistics */}
                <div className="quiz-results-header">
                  <div className="quiz-info">
                    <h3>{currentQuiz?.title}</h3>
                    <p className="quiz-description">{currentQuiz?.description}</p>
                  </div>
                  {stats && (
                    <div className="results-stats-summary">
                      <div className="stat">
                        <label>Total Attempts</label>
                        <p>{stats.totalAttempts || 0}</p>
                      </div>
                      <div className="stat">
                        <label>Completed</label>
                        <p>{stats.completedAttempts || 0}</p>
                      </div>
                      <div className="stat">
                        <label>Avg Score</label>
                        <p>{stats.averageScore || 0}%</p>
                      </div>
                      <div className="stat">
                        <label>Pass Rate</label>
                        <p>{stats.passRate || 0}%</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Filters & Search */}
                <div className="results-filters-section">
                  <div className="filter-group">
                    <input
                      type="text"
                      placeholder={t('formateur.quizResults.searchStudentPlaceholder')}
                      value={searchStudent}
                      onChange={(e) => setSearchStudent(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-group">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">{t('formateur.quizResults.allResults')}</option>
                      <option value="passed">{t('formateur.quizResults.passedOnly')}</option>
                      <option value="failed">{t('formateur.quizResults.failedOnly')}</option>
                    </select>
                  </div>

                  <button
                    onClick={downloadResultsCSV}
                    className="btn-download-results"
                  >
                    <FaDownload /> {t('formateur.quizResults.downloadCSV')}
                  </button>
                </div>

                {/* Results Table */}
                <div className="results-table-section">
                  <h3>{t('formateur.quizResults.studentResults', { count: filteredResults.length })}</h3>

                  {filteredResults.length === 0 ? (
                    <p className="no-results">{t('formateur.quizResults.noResults')}</p>
                  ) : (
                    <div className="results-table-wrapper">
                      <table className="results-table">
                        <thead>
                          <tr>
                            <th>{t('formateur.quizResults.studentNameHeader')}</th>
                            <th>{t('formateur.quizResults.emailHeader')}</th>
                            <th>{t('formateur.quizResults.scoreHeader')}</th>
                            <th>{t('formateur.quizResults.percentageHeader')}</th>
                            <th>{t('formateur.quizResults.statusHeader')}</th>
                            <th>{t('formateur.quizResults.attemptsHeader')}</th>
                            <th>{t('formateur.quizResults.completedAtHeader')}</th>
                            <th>{t('formateur.quizResults.actionHeader')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredResults.map((result, idx) => {
                            const resultStatus = result.percentageScore >= passingScore ? t('formateur.quizResults.status.passed') : t('formateur.quizResults.status.failed');
                            const scoreColor = getScoreColor(result.percentageScore, passingScore);
                            return (
                              <tr key={result._id || idx} className="result-row">
                                <td className="student-name">
                                  {result.student?.firstName || t('formateur.quizResults.unknown')}{' '}
                                  {result.student?.lastName || ''}
                                </td>
                                <td className="student-email">{result.student?.email || t('formateur.na')}</td>
                                <td className="score">
                                  {result.score}/{currentQuiz?.settings?.totalPoints || 0}
                                </td>
                                <td className="percentage">
                                  <span
                                    className="percentage-badge"
                                    style={{ backgroundColor: scoreColor }}
                                  >
                                    {result.percentageScore}%
                                  </span>
                                </td>
                                <td className="status">
                                  <span
                                    className={`status-label ${resultStatus.toLowerCase()}`}
                                  >
                                    {resultStatus}
                                  </span>
                                </td>
                                <td className="attempts">{result.status || t('formateur.quizResults.status.submitted')}</td>
                                <td className="completed-date">
                                  {result.completedAt
                                    ? new Date(result.completedAt).toLocaleDateString()
                                    : t('formateur.quizResults.status.inProgress')}
                                </td>
                                <td className="action-cell">
                                  <button
                                    onClick={() => setSelectedResult(result)}
                                    className="btn-view-details"
                                    title={t('formateur.quizResults.viewDetailedAnswers')}
                                  >
                                    <FaEye /> {t('formateur.quizResults.details')}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
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

      {/* Detailed Result Modal */}
      {selectedResult && currentQuiz && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <div className="modal-header">
              <h3>{t('formateur.quizResults.studentAnswerReview')}</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="btn-close-modal"
              >
                ✕
              </button>
            </div>

            <div className="student-info-section">
              <div className="student-info">
                <h4>
                  {selectedResult.student?.firstName || t('formateur.quizResults.unknown')}{' '}
                  {selectedResult.student?.lastName || ''}
                </h4>
                <p>{selectedResult.student?.email || t('formateur.na')}</p>
              </div>
              <div className="result-summary">
                <div className="summary-item">
                  <label>{t('formateur.quizResults.scoreLabel')}</label>
                  <p>
                    <strong>{selectedResult.score}/{currentQuiz?.settings?.totalPoints || 0}</strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t('formateur.quizResults.percentageLabel')}</label>
                  <p>
                    <strong>{selectedResult.percentageScore}%</strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t('formateur.quizResults.statusLabel')}</label>
                  <p>
                    <strong>
                      {selectedResult.percentageScore >= passingScore
                        ? t('formateur.quizResults.status.passed')
                        : t('formateur.quizResults.status.failed')}
                    </strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t('formateur.quizResults.completedLabel')}</label>
                  <p>
                    <strong>
                      {selectedResult.completedAt
                        ? new Date(selectedResult.completedAt).toLocaleString()
                        : t('formateur.quizResults.status.inProgress')}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="answers-review-section">
              <h4>{t('formateur.quizResults.answerReview')}</h4>
              {selectedResult.answers && selectedResult.answers.length > 0 ? (
                <div className="answers-list">
                  {selectedResult.answers.map((answer, idx) => {
                    const question = currentQuiz.questions.find(
                      q => q._id === answer.questionId
                    );
                    return (
                      <div
                        key={idx}
                        className={`answer-item ${
                          answer.isCorrect ? 'correct' : 'incorrect'
                        }`}
                      >
                        <div className="answer-header">
                          <h5>
                            {idx + 1}. {question?.title || t('formateur.quizResults.questionLabel')}
                          </h5>
                          <span
                            className={`answer-status ${
                              answer.isCorrect ? 'correct' : 'incorrect'
                            }`}
                          >
                            {answer.isCorrect ? t('formateur.quizResults.correct') : t('formateur.quizResults.incorrect')}
                          </span>
                        </div>

                        <div className="answer-content">
                          <div className="student-answer">
                            <label>{t('formateur.quizResults.studentsAnswer')}</label>
                            <p className="answer-text">{answer.selectedAnswer || t('formateur.quizResults.noAnswer')}</p>
                            <span className="points-earned">
                              {t('formateur.quizResults.points')}: {answer.pointsEarned || 0}/{question?.points || 0}
                            </span>
                          </div>

                          {!answer.isCorrect && question?.correctAnswer && (
                            <div className="correct-answer">
                              <label>{t('formateur.quizResults.correctAnswer')}</label>
                              <p className="answer-text">{question.correctAnswer}</p>
                            </div>
                          )}

                          {question?.explanation && (
                            <div className="answer-explanation">
                              <label>{t('formateur.quizResults.explanation')}</label>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-answers">{t('formateur.quizResults.noAnswersRecorded')}</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setSelectedResult(null)}
                className="btn-close-review"
              >
                {t('formateur.quizResults.closeReview')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormateurQuizResult;
