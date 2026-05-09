import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { useTranslation } from 'react-i18next';
import i18nInstance from '../../i18n';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import { createFormateurCourse, uploadCourseVideo } from '../../services/formateurService';

const categories = [
  'Web Development',
  'Mobile Development',
  'Data Science',
  'Machine Learning',
  'Design',
  'Marketing',
  'Business',
  'Photography',
  'Music',
  'Language Learning',
  'Other'
];

const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];
const languages = ['Arabic', 'English', 'French'];
const priceTypes = [
  { value: 'free', label: 'Free' },
  { value: 'paid', label: 'Paid' },
  { value: 'semi-free', label: 'Semi-free' }
];

const initialData = {
  title: '',
  description: '',
  category: '',
  level: 'Beginner',
  language: 'English',
  priceType: 'paid',
  price: '0',
  videoFile: null,
  learningOutcomes: ['']
};

const AddCourses = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    questions: [
      {
        title: '',
        type: 'multiple-choice',
        points: 1,
        options: [
          { text: '', isCorrect: false },
          { text: '', isCorrect: false }
        ],
        explanation: ''
      }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'price' && formData.priceType === 'free') {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOutcomeChange = (index, value) => {
    setFormData((prev) => {
      const learningOutcomes = [...prev.learningOutcomes];
      learningOutcomes[index] = value;
      return { ...prev, learningOutcomes };
    });
  };

  const addOutcome = () => {
    setFormData((prev) => ({ ...prev, learningOutcomes: [...prev.learningOutcomes, ''] }));
  };

  const removeOutcome = (index) => {
    setFormData((prev) => ({ ...prev, learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index) }));
  };

  const handlePriceTypeChange = (event) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      priceType: value,
      price: value === 'free' ? '0' : prev.price === '0' ? '' : prev.price
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    setFormData((prev) => ({ ...prev, videoFile: file || null }));
  };

  const handleQuizInputChange = (field, value) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    setQuizData((prev) => {
      const questions = [...prev.questions];
      questions[index] = { ...questions[index], [field]: value };
      return { ...prev, questions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setQuizData((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[questionIndex].options];
      options[optionIndex] = { ...options[optionIndex], text: value };
      questions[questionIndex] = { ...questions[questionIndex], options };
      return { ...prev, questions };
    });
  };

  const setCorrectOption = (questionIndex, optionIndex) => {
    setQuizData((prev) => {
      const questions = [...prev.questions];
      const options = questions[questionIndex].options.map((option, idx) => ({
        ...option,
        isCorrect: idx === optionIndex
      }));
      questions[questionIndex] = { ...questions[questionIndex], options };
      return { ...prev, questions };
    });
  };

  const addOption = (questionIndex) => {
    setQuizData((prev) => {
      const questions = [...prev.questions];
      const options = [...questions[questionIndex].options, { text: '', isCorrect: false }];
      questions[questionIndex] = { ...questions[questionIndex], options };
      return { ...prev, questions };
    });
  };

  const removeOption = (questionIndex, optionIndex) => {
    setQuizData((prev) => {
      const questions = [...prev.questions];
      const options = questions[questionIndex].options.filter((_, idx) => idx !== optionIndex);
      questions[questionIndex] = { ...questions[questionIndex], options };
      return { ...prev, questions };
    });
  };

  const addQuestion = () => {
    setQuizData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          title: '',
          type: 'multiple-choice',
          points: 1,
          options: [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false }
          ],
          explanation: ''
        }
      ]
    }));
  };

  const removeQuestion = (index) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const learningOutcomes = formData.learningOutcomes
      .map((item) => item.trim())
      .filter((item) => item !== '');

    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.language || !formData.priceType) {
      setError(t('addCourse.pleaseFillRequiredFields'));
      return;
    }

    if (!formData.videoFile) {
      setError(t('addCourse.pleaseUploadVideo'));
      return;
    }

    if (formData.priceType !== 'free' && formData.price.trim() === '') {
      setError(t('addCourse.pleaseEnterValidPrice'));
      return;
    }


    try {
      setLoading(true);
      const uploadResponse = await uploadCourseVideo(formData.videoFile);
      const videoUrl = uploadResponse.data?.data?.url;
      if (!videoUrl) {
        throw new Error('Video upload failed.');
      }

      const quizPayload = quizData.title.trim() || quizData.questions.some((question) => question.title.trim())
        ? {
            title: quizData.title.trim(),
            description: quizData.description.trim(),
            questions: quizData.questions.map((question) => ({
              title: question.title.trim(),
              type: question.type,
              points: Number(question.points) || 1,
              options: question.options.map((option) => ({
                text: option.text.trim(),
                isCorrect: option.isCorrect
              })),
              explanation: question.explanation.trim()
            }))
          }
        : undefined;

      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        level: formData.level,
        language: formData.language,
        priceType: formData.priceType,
        price: Number(formData.price || 0),
        videoUrl,
      };

      if (quizPayload) {
        payload.quiz = quizPayload;
      }

      await createFormateurCourse(payload);
      setSuccess(t('addCourse.courseCreatedSuccess'));
      setFormData(initialData);
      setQuizData({
        title: '',
        description: '',
        questions: [
          {
            title: '',
            type: 'multiple-choice',
            points: 1,
            options: [
              { text: '', isCorrect: false },
              { text: '', isCorrect: false }
            ],
            explanation: ''
          }
        ]
      });
    } catch (err) {
      setError(err.response?.data?.message || t('addCourse.failedToCreateCourse'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          <div className="navbar-dashboard-center">
            <h1>{t('addCourse.title')}</h1>
            <a href="/">{t('dashboard.home')}</a>
            <span style={{ color: '#6b7280' }}>/ {t('addCourse.title')}</span>
          </div>
          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(i18n?.language || 'en')} style={{ fontSize: '20px' }}></span>
              <span>{(i18n?.language || 'en').toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        <SidebarF />

        <main className="formateur-main">
          <ProfilSection
            formateur={{ avatar: 'https://via.placeholder.com/60', name: 'Instructor' }}
            actionLabel={t('addCourse.backToCourses')}
            onAction={() => navigate('/formateur/courses')}
          />

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <div className="course-form-card">
            <h2>{t('addCourse.addCourseTitle')}</h2>
            <form className="settings-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">{t('addCourse.courseTitle')}</label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t('addCourse.enterCourseTitle')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">{t('addCourse.description')}</label>
                <textarea
                  id="description"
                  name="description"
                  className="form-textarea"
                  rows="5"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t('addCourse.describeAchievements')}
                />
              </div>

              <div className="form-group">
                <label htmlFor="videoFile">{t('addCourse.courseVideo')}</label>
                <input
                  id="videoFile"
                  name="videoFile"
                  type="file"
                  accept="video/*"
                  className="form-input"
                  onChange={handleFileChange}
                />
                {formData.videoFile && (
                  <p style={{ marginTop: '0.5rem', color: '#374151' }}>
                    {t('addCourse.selectedFile')} {formData.videoFile.name}
                  </p>
                )}
              </div>

              <div className="quiz-section">
                <h3>{t('addCourse.quizSection')}</h3>
                <div className="form-group">
                  <label htmlFor="quizTitle">{t('addCourse.quizTitle')}</label>
                  <input
                    id="quizTitle"
                    name="quizTitle"
                    type="text"
                    className="form-input"
                    value={quizData.title}
                    onChange={(event) => handleQuizInputChange('title', event.target.value)}
                    placeholder={t('addCourse.optionalQuizTitle')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quizDescription">{t('addCourse.quizDescription')}</label>
                  <textarea
                    id="quizDescription"
                    name="quizDescription"
                    className="form-textarea"
                    rows="3"
                    value={quizData.description}
                    onChange={(event) => handleQuizInputChange('description', event.target.value)}
                    placeholder={t('addCourse.optionalQuizDescription')}
                  />
                </div>

                {quizData.questions.map((question, index) => (
                  <div className="quiz-question-card" key={`question-${index}`}>
                    <div className="quiz-question-header">
                      <h4>{t('addCourse.question')} {index + 1}</h4>
                      <button type="button" className="btn-secondary" onClick={() => removeQuestion(index)}>
                        {t('addCourse.remove')}
                      </button>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`questionTitle-${index}`}>{t('addCourse.questionText')}</label>
                      <input
                        id={`questionTitle-${index}`}
                        type="text"
                        className="form-input"
                        value={question.title}
                        onChange={(event) => handleQuestionChange(index, 'title', event.target.value)}
                        placeholder={t('addCourse.enterQuestionText')}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor={`questionType-${index}`}>{t('addCourse.questionType')}</label>
                      <select
                        id={`questionType-${index}`}
                        className="form-input"
                        value={question.type}
                        onChange={(event) => handleQuestionChange(index, 'type', event.target.value)}
                      >
                        <option value="multiple-choice">{t('addCourse.multipleChoice')}</option>
                        <option value="true-false">{t('addCourse.trueFalse')}</option>
                        <option value="short-answer">{t('addCourse.shortAnswer')}</option>
                        <option value="essay">{t('addCourse.essay')}</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor={`questionPoints-${index}`}>{t('addCourse.points')}</label>
                      <input
                        id={`questionPoints-${index}`}
                        type="number"
                        min="1"
                        className="form-input"
                        value={question.points}
                        onChange={(event) => handleQuestionChange(index, 'points', event.target.value)}
                      />
                    </div>

                    {question.type !== 'essay' && (
                      <div className="quiz-options-group">
                        <label>{t('addCourse.options')}</label>
                        {question.options.map((option, optionIndex) => (
                          <div className="quiz-option-row" key={`option-${optionIndex}`}>
                            <input
                              type="text"
                              className="form-input"
                              value={option.text}
                              onChange={(event) => handleOptionChange(index, optionIndex, event.target.value)}
                              placeholder={`${t('addCourse.options')} ${optionIndex + 1}`}
                            />
                            <label className="quiz-option-correct">
                              <input
                                type="radio"
                                name={`correctOption-${index}`}
                                checked={option.isCorrect}
                                onChange={() => setCorrectOption(index, optionIndex)}
                              />
                              {t('addCourse.correct')}
                            </label>
                            {question.options.length > 2 && (
                              <button
                                type="button"
                                className="btn-text"
                                onClick={() => removeOption(index, optionIndex)}
                              >
                                {t('addCourse.remove')}
                              </button>
                            )}
                          </div>
                        ))}
                        <button type="button" className="btn-secondary" onClick={() => addOption(index)}>
                          {t('addCourse.addOption')}
                        </button>
                      </div>
                    )}

                    <div className="form-group">
                      <label htmlFor={`questionExplanation-${index}`}>{t('addCourse.explanation')}</label>
                      <textarea
                        id={`questionExplanation-${index}`}
                        className="form-textarea"
                        rows="2"
                        value={question.explanation}
                        onChange={(event) => handleQuestionChange(index, 'explanation', event.target.value)}
                        placeholder={t('addCourse.optionalExplanation')}
                      />
                    </div>
                  </div>
                ))}

                <button type="button" className="btn-primary" onClick={addQuestion}>
                  {t('addCourse.addQuestion')}
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="category">{t('addCourse.category')}</label>
                <select
                  id="category"
                  name="category"
                  className="form-input"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="">{t('addCourse.selectCategory')}</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">{t('addCourse.level')}</label>
                <select
                  id="level"
                  name="level"
                  className="form-input"
                  value={formData.level}
                  onChange={handleInputChange}
                >
                  {levels.map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="language">{t('addCourse.language')}</label>
                <select
                  id="language"
                  name="language"
                  className="form-input"
                  value={formData.language}
                  onChange={handleInputChange}
                >
                  {languages.map((language) => (
                    <option key={language} value={language}>{language}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="priceType">{t('addCourse.priceType')}</label>
                <select
                  id="priceType"
                  name="priceType"
                  className="form-input"
                  value={formData.priceType}
                  onChange={handlePriceTypeChange}
                >
                  {priceTypes.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">{t('addCourse.price')}</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.price}
                  onChange={handleInputChange}
                  disabled={formData.priceType === 'free'}
                  placeholder={formData.priceType === 'free' ? t('addCourse.freeCourse') : t('addCourse.enterPrice')}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="add-course-btn" disabled={loading}>
                  {loading ? t('addCourse.saving') : t('addCourse.createCourse')}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourses;
