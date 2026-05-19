import React, { useEffect, useMemo, useState } from "react";
import "../../styles/formateur.css";
import SidebarF from "../../components/formateur/sidebarF";
import logo_rem from "../../assets/image/home_page/logo_rem.png";
import { FaDownload, FaEye } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import i18nInstance from "../../i18n";
import {
  getFormateurCourse,
  getFormateurCourses,
} from "../../services/formateurService";

const getStudentName = (student) => {
  if (!student) {
    return "";
  }

  if (student.fullName) {
    return student.fullName;
  }

  return [student.firstName, student.lastName].filter(Boolean).join(" ").trim();
};

const getQuestionCorrectAnswer = (question) => {
  if (!question) {
    return "";
  }

  const correctOption = (question.options || []).find((option) => option.isCorrect);
  if (correctOption?.text) {
    return correctOption.text;
  }

  if (question.correctAnswer) {
    return question.correctAnswer;
  }

  if (Array.isArray(question.acceptableAnswers) && question.acceptableAnswers.length > 0) {
    return question.acceptableAnswers.join(", ");
  }

  return "";
};

const countQuizAttempts = (course, quizId) => {
  if (!course || !quizId) {
    return 0;
  }

  return (course.enrolledStudents || []).reduce((sum, enrollment) => {
    const attemptsCount = (enrollment.quizAttempts || []).filter(
      (attempt) => String(attempt.lessonId) === String(quizId)
    ).length;

    return sum + attemptsCount;
  }, 0);
};

const FormateurQuizResult = () => {
  const { t, i18n } = useTranslation();
  const [courses, setCourses] = useState([]);

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === 'en') ? 'fr' : 'en';
    const instance = (i18n && typeof i18n.changeLanguage === 'function') ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === 'function') {
      instance.changeLanguage(lang);
    }
  };

  const getFlagClass = (lang) => {
    switch (lang) {
      case 'en':
        return 'fi fi-gb';
      case 'fr':
        return 'fi fi-fr';
      default:
        return 'fi fi-gl';
    }
  };

  const currentLang = (i18n && i18n.language) ? i18n.language : 'en';
  const [course, setCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [courseLoading, setCourseLoading] = useState(false);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchStudent, setSearchStudent] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadCourses = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getFormateurCourses();
        const nextCourses = response.data?.data || [];

        if (!isMounted) {
          return;
        }

        setCourses(nextCourses);
        setSelectedCourse((current) => current || nextCourses[0]?._id || "");
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("formateur.quizResults.errorFetchingQuizzes")
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isMounted = false;
    };
  }, [t]);

  useEffect(() => {
    if (!selectedCourse) {
      setCourse(null);
      setSelectedQuiz("");
      return;
    }

    let isMounted = true;

    const loadCourseDetails = async () => {
      try {
        setCourseLoading(true);
        setError("");
        setSelectedResult(null);
        const response = await getFormateurCourse(selectedCourse);
        const nextCourse = response.data?.data || null;

        if (!isMounted) {
          return;
        }

        setCourse(nextCourse);

        const nextQuizzes = (nextCourse?.sections || []).flatMap((section) =>
          (section.lessons || [])
            .filter((lesson) => lesson.type === "quiz")
            .map((lesson) => ({
              ...lesson,
              sectionTitle: section.title,
            }))
        );

        setSelectedQuiz((current) => {
          const stillExists = nextQuizzes.some(
            (quiz) => String(quiz._id) === String(current)
          );
          return stillExists ? current : nextQuizzes[0]?._id || "";
        });
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.response?.data?.message ||
              t("formateur.quizResults.errorFetchingQuizzes")
          );
          setCourse(null);
          setSelectedQuiz("");
        }
      } finally {
        if (isMounted) {
          setCourseLoading(false);
        }
      }
    };

    loadCourseDetails();

    return () => {
      isMounted = false;
    };
  }, [selectedCourse, t]);

  const quizzes = useMemo(
    () =>
      (course?.sections || []).flatMap((section) =>
        (section.lessons || [])
          .filter((lesson) => lesson.type === "quiz")
          .map((lesson) => ({
            ...lesson,
            sectionTitle: section.title,
          }))
      ),
    [course]
  );

  const currentQuiz = useMemo(
    () => quizzes.find((quiz) => String(quiz._id) === String(selectedQuiz)) || null,
    [quizzes, selectedQuiz]
  );

  const studentResults = useMemo(() => {
    if (!course || !selectedQuiz) {
      return [];
    }

    return (course.enrolledStudents || [])
      .flatMap((enrollment) =>
        (enrollment.quizAttempts || [])
          .filter((attempt) => String(attempt.lessonId) === String(selectedQuiz))
          .map((attempt) => ({
            ...attempt,
            student: enrollment.student,
            progress: enrollment.progress,
          }))
      )
      .sort(
        (first, second) =>
          new Date(second.completedAt || 0) - new Date(first.completedAt || 0)
      );
  }, [course, selectedQuiz]);

  const stats = useMemo(() => {
    const totalAttempts = studentResults.length;
    const completedAttempts = studentResults.filter((result) => result.completedAt).length;
    const passedAttempts = studentResults.filter((result) => result.passed).length;
    const averageScore = totalAttempts
      ? Math.round(
          studentResults.reduce(
            (sum, result) => sum + Number(result.percentageScore || 0),
            0
          ) / totalAttempts
        )
      : 0;

    return {
      totalAttempts,
      completedAttempts,
      averageScore,
      passRate: totalAttempts ? Math.round((passedAttempts / totalAttempts) * 100) : 0,
    };
  }, [studentResults]);

  const filteredResults = useMemo(() => {
    const searchValue = searchStudent.trim().toLowerCase();

    return studentResults.filter((result) => {
      if (filterStatus === "passed" && !result.passed) {
        return false;
      }

      if (filterStatus === "failed" && result.passed) {
        return false;
      }

      if (!searchValue) {
        return true;
      }

      const studentName = getStudentName(result.student).toLowerCase();
      const studentEmail = String(result.student?.email || "").toLowerCase();

      return (
        studentName.includes(searchValue) || studentEmail.includes(searchValue)
      );
    });
  }, [filterStatus, searchStudent, studentResults]);

  const getScoreColor = (percentage, passingScore = 50) => {
    if (percentage >= passingScore) return "#16a34a";
    if (percentage >= passingScore - 10) return "#f59e0b";
    return "#ef4444";
  };

  const downloadResultsCSV = () => {
    if (!currentQuiz) {
      return;
    }

    const headers = [
      t("formateur.quizResults.studentNameHeader"),
      t("formateur.quizResults.emailHeader"),
      t("formateur.quizResults.scoreHeader"),
      t("formateur.quizResults.percentageHeader"),
      t("formateur.quizResults.statusHeader"),
      t("formateur.quizResults.attemptsHeader"),
      t("formateur.quizResults.completedAtHeader"),
    ];

    const rows = filteredResults.map((result) => [
      getStudentName(result.student) || t("formateur.quizResults.unknown"),
      result.student?.email || t("formateur.na"),
      `${result.score || 0}/${result.totalPoints || 0}`,
      `${result.percentageScore || 0}%`,
      result.passed ? t("formateur.quizResults.status.passed") : t("formateur.quizResults.status.failed"),
      result.attemptNumber || 1,
      result.completedAt ? new Date(result.completedAt).toLocaleString() : t("formateur.quizResults.status.inProgress"),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      `data:text/csv;charset=utf-8,${encodeURIComponent(csvContent)}`
    );
    element.setAttribute(
      "download",
      `quiz_results_${currentQuiz.title || "quiz"}.csv`
    );
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (loading) {
    return (
      <div className="formateur-page">
        <div className="loading-container">
          <p>{t("formateur.quizResults.loadingQuizResults")}</p>
        </div>
      </div>
    );
  }

  const passingScore = currentQuiz?.quiz?.passingScore || 50;

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(currentLang)} style={{ fontSize: '20px' }}></span>
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="quiz-results-container">
            <div className="course-selector-section">
              <h2>{t("formateur.quizResults.selectQuizTitle")}</h2>
              <div className="course-selector-buttons">
                {courses.length === 0 ? (
                  <p className="no-quizzes">{t("formateur.quizResults.noQuizzes")}</p>
                ) : (
                  courses.map((item) => (
                    <button
                      key={item._id}
                      className={`course-btn ${
                        String(selectedCourse) === String(item._id) ? "active" : ""
                      }`}
                      onClick={() => setSelectedCourse(item._id)}
                    >
                      {item.title}
                    </button>
                  ))
                )}
              </div>
            </div>

            {courseLoading ? (
              <div className="results-table-section">
                <p>{t("formateur.quizResults.loadingQuizResults")}</p>
              </div>
            ) : (
              <>
                {quizzes.length > 0 && (
                  <div className="quiz-selection-section">
                    <h2>{course?.title}</h2>
                    <div className="quiz-selection-tabs">
                      {quizzes.map((quiz) => {
                        const attemptCount = countQuizAttempts(course, quiz._id);

                        return (
                          <button
                            key={quiz._id}
                            className={`quiz-tab ${
                              String(selectedQuiz) === String(quiz._id) ? "active" : ""
                            }`}
                            onClick={() => {
                              setSelectedQuiz(quiz._id);
                              setSelectedResult(null);
                            }}
                          >
                            <span className="tab-title">{quiz.title}</span>
                            <span className="tab-count">{attemptCount}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {!currentQuiz ? (
                  <div className="results-table-section">
                    <p className="no-results">{t("formateur.quizResults.noQuizzes")}</p>
                  </div>
                ) : (
                  <>
                    <div className="quiz-results-header">
                      <div className="quiz-info">
                        <h3>{currentQuiz.title}</h3>
                        <p className="quiz-description">
                          {currentQuiz.description || currentQuiz.quiz?.instructions || ""}
                        </p>
                        <p className="quiz-description">
                          {currentQuiz.sectionTitle} · {currentQuiz.quiz?.questions?.length || 0}{" "}
                          {t("formateur.quizResults.questionLabel")}
                        </p>
                      </div>

                      <div className="results-stats-summary">
                        <div className="stat">
                          <label>{t("formateur.quizResults.totalAttempts")}</label>
                          <p>{stats.totalAttempts}</p>
                        </div>
                        <div className="stat">
                          <label>{t("formateur.quizResults.completed")}</label>
                          <p>{stats.completedAttempts}</p>
                        </div>
                        <div className="stat">
                          <label>{t("formateur.quizResults.averageScore")}</label>
                          <p>{stats.averageScore}%</p>
                        </div>
                        <div className="stat">
                          <label>{t("formateur.quizResults.passRate")}</label>
                          <p>{stats.passRate}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="results-filters-section">
                      <div className="filter-group">
                        <input
                          type="text"
                          placeholder={t("formateur.quizResults.searchStudentPlaceholder")}
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
                          <option value="all">{t("formateur.quizResults.allResults")}</option>
                          <option value="passed">{t("formateur.quizResults.passedOnly")}</option>
                          <option value="failed">{t("formateur.quizResults.failedOnly")}</option>
                        </select>
                      </div>

                      <button onClick={downloadResultsCSV} className="btn-download-results">
                        <FaDownload /> {t("formateur.quizResults.downloadCSV")}
                      </button>
                    </div>

                    <div className="results-table-section">
                      <h3>
                        {t("formateur.quizResults.studentResults", {
                          count: filteredResults.length,
                        })}
                      </h3>

                      {filteredResults.length === 0 ? (
                        <p className="no-results">{t("formateur.quizResults.noResults")}</p>
                      ) : (
                        <div className="results-table-wrapper">
                          <table className="results-table">
                            <thead>
                              <tr>
                                <th>{t("formateur.quizResults.studentNameHeader")}</th>
                                <th>{t("formateur.quizResults.emailHeader")}</th>
                                <th>{t("formateur.quizResults.scoreHeader")}</th>
                                <th>{t("formateur.quizResults.percentageHeader")}</th>
                                <th>{t("formateur.quizResults.statusHeader")}</th>
                                <th>{t("formateur.quizResults.attemptsHeader")}</th>
                                <th>{t("formateur.quizResults.completedAtHeader")}</th>
                                <th>{t("formateur.quizResults.actionHeader")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredResults.map((result, index) => {
                                const scoreColor = getScoreColor(
                                  result.percentageScore,
                                  passingScore
                                );
                                const resultStatus = result.passed
                                  ? t("formateur.quizResults.status.passed")
                                  : t("formateur.quizResults.status.failed");

                                return (
                                  <tr key={`${result.lessonId}-${result.attemptNumber}-${index}`} className="result-row">
                                    <td className="student-name" style={{ fontSize: "0.95rem" }}>
                                      {getStudentName(result.student) ||
                                        t("formateur.quizResults.unknown")}
                                    </td>
                                    <td className="student-email">
                                      {result.student?.email || t("formateur.na")}
                                    </td>
                                    <td className="score">
                                      {result.score || 0}/{result.totalPoints || 0}
                                    </td>
                                    <td className="percentage">
                                      <span
                                        className="percentage-badge"
                                        style={{ backgroundColor: scoreColor }}
                                      >
                                        {result.percentageScore || 0}%
                                      </span>
                                    </td>
                                    <td className="status-cell">
                                      <span
                                        className={`status-label ${
                                          result.passed ? "passed" : "failed"
                                        }`}
                                      >
                                        {resultStatus}
                                      </span>
                                    </td>
                                    <td className="attempts">#{result.attemptNumber || 1}</td>
                                    <td className="completed-date">
                                      {result.completedAt
                                        ? new Date(result.completedAt).toLocaleDateString()
                                        : t("formateur.quizResults.status.inProgress")}
                                    </td>
                                    <td className="action-cell">
                                      <button
                                        onClick={() => setSelectedResult(result)}
                                        className="btn-view-details"
                                        title={t("formateur.quizResults.viewDetailedAnswers")}
                                      >
                                        <FaEye /> {t("formateur.quizResults.details")}
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
              </>
            )}
          </div>
        </div>
      </div>

      {selectedResult && currentQuiz && (
        <div className="result-modal-overlay">
          <div className="result-modal-content">
            <div className="modal-header">
              <h3>{t("formateur.quizResults.studentAnswerReview")}</h3>
              <button
                onClick={() => setSelectedResult(null)}
                className="btn-close-modal"
              >
                x
              </button>
            </div>

            <div className="student-info-section">
              <div className="student-info">
                <h4>
                  {getStudentName(selectedResult.student) ||
                    t("formateur.quizResults.unknown")}
                </h4>
                <p>{selectedResult.student?.email || t("formateur.na")}</p>
              </div>

              <div className="result-summary">
                <div className="summary-item">
                  <label>{t("formateur.quizResults.scoreLabel")}</label>
                  <p>
                    <strong>
                      {selectedResult.score || 0}/{selectedResult.totalPoints || 0}
                    </strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t("formateur.quizResults.percentageLabel")}</label>
                  <p>
                    <strong>{selectedResult.percentageScore || 0}%</strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t("formateur.quizResults.statusLabel")}</label>
                  <p>
                    <strong>
                      {selectedResult.passed
                        ? t("formateur.quizResults.status.passed")
                        : t("formateur.quizResults.status.failed")}
                    </strong>
                  </p>
                </div>
                <div className="summary-item">
                  <label>{t("formateur.quizResults.completedLabel")}</label>
                  <p>
                    <strong>
                      {selectedResult.completedAt
                        ? new Date(selectedResult.completedAt).toLocaleString()
                        : t("formateur.quizResults.status.inProgress")}
                    </strong>
                  </p>
                </div>
              </div>
            </div>

            <div className="answers-review-section">
              <h4>{t("formateur.quizResults.answerReview")}</h4>
              {selectedResult.answers && selectedResult.answers.length > 0 ? (
                <div className="answers-list">
                  {selectedResult.answers.map((answer, index) => {
                    const question = (currentQuiz.quiz?.questions || []).find(
                      (item) => String(item._id) === String(answer.questionId)
                    );
                    const correctAnswer = getQuestionCorrectAnswer(question);

                    return (
                      <div
                        key={`${answer.questionId}-${index}`}
                        className={`answer-item ${
                          answer.isCorrect ? "correct" : "incorrect"
                        }`}
                      >
                        <div className="answer-header">
                          <h5>
                            {index + 1}.{" "}
                            {question?.prompt || t("formateur.quizResults.questionLabel")}
                          </h5>
                          <span
                            className={`answer-status ${
                              answer.isCorrect ? "correct" : "incorrect"
                            }`}
                          >
                            {answer.isCorrect
                              ? t("formateur.quizResults.correct")
                              : t("formateur.quizResults.incorrect")}
                          </span>
                        </div>

                        <div className="answer-content">
                          <div className="student-answer">
                            <label>{t("formateur.quizResults.studentsAnswer")}</label>
                            <p className="answer-text">
                              {answer.selectedAnswer || t("formateur.quizResults.noAnswer")}
                            </p>
                            <span className="points-earned">
                              {t("formateur.quizResults.points")}: {answer.pointsEarned || 0}/
                              {question?.points || 0}
                            </span>
                          </div>

                          {!answer.isCorrect && correctAnswer && (
                            <div className="correct-answer">
                              <label>{t("formateur.quizResults.correctAnswer")}</label>
                              <p className="answer-text">{correctAnswer}</p>
                            </div>
                          )}

                          {question?.explanation && (
                            <div className="answer-explanation">
                              <label>{t("formateur.quizResults.explanation")}</label>
                              <p>{question.explanation}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="no-answers">{t("formateur.quizResults.noAnswersRecorded")}</p>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => setSelectedResult(null)}
                className="btn-close-review"
              >
                {t("formateur.quizResults.closeReview")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormateurQuizResult;
