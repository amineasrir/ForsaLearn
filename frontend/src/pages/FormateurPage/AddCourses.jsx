import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { useTranslation } from 'react-i18next';
import i18nInstance from '../../i18n';
import SidebarF from '../../components/formateur/sidebarF';
import { getFormateurCourse, createFormateurCourse, updateFormateurCourse, uploadCourseVideo, uploadCourseThumbnail } from '../../services/formateurService';
import { getMediaUrl } from '../../utils/mediaUrl';

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

const lessonTypes = [
  { value: 'video', label: 'Video' },
  { value: 'article', label: 'Article' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'assignment', label: 'Assignment' },
  { value: 'file', label: 'File' }
];

const initialData = {
  title: '',
  description: '',
  category: '',
  level: 'Beginner',
  language: 'English',
  priceType: 'paid',
  price: '0',
  thumbnail: null,
  requirements: [''],
  learningOutcomes: [''],
  targetAudience: [''],
  sections: []
};

const AddCourses = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditMode = Boolean(courseId);
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('');
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

  const handleArrayChange = (field, index, value) => {
    setFormData((prev) => {
      const array = [...prev[field]];
      array[index] = value;
      return { ...prev, [field]: array };
    });
  };

  const addArrayItem = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
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
    setFormData((prev) => ({ ...prev, thumbnail: file || null }));
  };

  const fetchCourse = async (id) => {
    try {
      setLoading(true);
      const response = await getFormateurCourse(id);
      const course = response.data?.data;
      if (course) {
        setFormData({
          title: course.title || '',
          description: course.description || '',
          category: course.category || '',
          level: course.level || 'Beginner',
          language: course.language || 'English',
          priceType: course.priceType || 'paid',
          price: course.price != null ? String(course.price) : '0',
          thumbnail: null,
          requirements: course.requirements?.length > 0 ? course.requirements : [''],
          learningOutcomes: course.learningOutcomes?.length > 0 ? course.learningOutcomes : [''],
          targetAudience: course.targetAudience?.length > 0 ? course.targetAudience : [''],
          sections: course.sections?.map((section) => ({
            title: section.title || '',
            description: section.description || '',
            order: section.order || 0,
            lessons: section.lessons?.map((lesson) => ({
              title: lesson.title || '',
              description: lesson.description || '',
              type: lesson.type || 'video',
              content: lesson.content || '',
              videoFile: null,
              duration: lesson.duration || 0,
              isFree: lesson.isFree || false,
              order: lesson.order || 0,
              resources: lesson.resources || [],
              quiz: lesson.quiz || undefined
            })) || []
          })) || []
        });
        setExistingThumbnailUrl(course.thumbnail || '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load course for editing.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isEditMode) {
      fetchCourse(courseId);
    }
  }, [courseId, isEditMode]);

  const handleLessonFileChange = (sectionIndex, lessonIndex, file) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson, videoFile: file || null };
      return { ...prev, sections };
    });
  };

  // Section management
  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          title: '',
          description: '',
          order: prev.sections.length + 1,
          lessons: []
        }
      ]
    }));
  };

  const removeSection = (sectionIndex) => {
    setFormData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== sectionIndex).map((section, i) => ({
        ...section,
        order: i + 1
      }))
    }));
  };

  const updateSection = (sectionIndex, field, value) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      sections[sectionIndex] = { ...sections[sectionIndex], [field]: value };
      return { ...prev, sections };
    });
  };

  // Lesson management
  const addLesson = (sectionIndex) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      section.lessons = [
        ...section.lessons,
        {
          title: '',
          description: '',
          type: 'video',
          content: '',
          videoFile: null,
          duration: 0,
          isFree: false,
          order: section.lessons.length + 1,
          resources: []
        }
      ];
      return { ...prev, sections };
    });
  };

  const removeLesson = (sectionIndex, lessonIndex) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const section = sections[sectionIndex];
      section.lessons = section.lessons.filter((_, i) => i !== lessonIndex).map((lesson, i) => ({
        ...lesson,
        order: i + 1
      }));
      return { ...prev, sections };
    });
  };

  const updateLesson = (sectionIndex, lessonIndex, field, value) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      let updatedLesson = { ...lesson, [field]: value };

      if (field === 'type') {
        if (value !== 'video') {
          updatedLesson.videoFile = null;
        }
        if (value === 'quiz') {
          updatedLesson.quiz = updatedLesson.quiz || {
            instructions: '',
            passingScore: 50,
            allowRetry: true,
            maxAttempts: 0,
            questions: []
          };
        } else {
          // remove quiz data when switching away from quiz
          if (updatedLesson.quiz) {
            delete updatedLesson.quiz;
          }
        }
      }

      sections[sectionIndex].lessons[lessonIndex] = updatedLesson;
      return { ...prev, sections };
    });
  };

  // Quiz helpers for the add-course form
  const addQuizQuestion = (sectionIndex, lessonIndex) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      lesson.quiz = lesson.quiz || { instructions: '', passingScore: 50, allowRetry: true, maxAttempts: 0, questions: [] };
      lesson.quiz.questions = [
        ...lesson.quiz.questions,
        {
          prompt: '',
          type: 'multiple-choice',
          points: 1,
          correctAnswer: '',
          explanation: '',
          options: [
            { text: '', isCorrect: true },
            { text: '', isCorrect: false }
          ]
        }
      ];
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson };
      return { ...prev, sections };
    });
  };

  const removeQuizQuestion = (sectionIndex, lessonIndex, questionIndex) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      if (!lesson.quiz || !Array.isArray(lesson.quiz.questions)) return prev;
      lesson.quiz.questions = lesson.quiz.questions.filter((_, i) => i !== questionIndex).map((q, i) => ({ ...q }));
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson };
      return { ...prev, sections };
    });
  };

  const updateQuizQuestionField = (sectionIndex, lessonIndex, questionIndex, field, value) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      if (!lesson.quiz || !Array.isArray(lesson.quiz.questions)) return prev;
      const questions = [...lesson.quiz.questions];
      questions[questionIndex] = { ...questions[questionIndex], [field]: value };
      lesson.quiz.questions = questions;
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson };
      return { ...prev, sections };
    });
  };

  const addQuizOption = (sectionIndex, lessonIndex, questionIndex) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      if (!lesson.quiz || !Array.isArray(lesson.quiz.questions)) return prev;
      const questions = [...lesson.quiz.questions];
      questions[questionIndex] = { ...questions[questionIndex], options: [...(questions[questionIndex].options || []), { text: '', isCorrect: false }] };
      lesson.quiz.questions = questions;
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson };
      return { ...prev, sections };
    });
  };

  const updateQuizOption = (sectionIndex, lessonIndex, questionIndex, optionIndex, field, value) => {
    setFormData((prev) => {
      const sections = [...prev.sections];
      const lesson = sections[sectionIndex].lessons[lessonIndex];
      if (!lesson.quiz || !Array.isArray(lesson.quiz.questions)) return prev;
      const questions = [...lesson.quiz.questions];
      const opts = [...(questions[questionIndex].options || [])];
      opts[optionIndex] = { ...opts[optionIndex], [field]: value };
      questions[questionIndex] = { ...questions[questionIndex], options: opts };
      lesson.quiz.questions = questions;
      sections[sectionIndex].lessons[lessonIndex] = { ...lesson };
      return { ...prev, sections };
    });
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Step 1 validation
    if (!formData.title.trim() || !formData.description.trim() || !formData.category || !formData.language || !formData.priceType) {
      setError(t('addCourse.pleaseFillRequiredFields') || 'Please fill all required fields');
      setCurrentStep(1);
      return;
    }

    const learningOutcomes = formData.learningOutcomes
      .map((item) => item.trim())
      .filter((item) => item !== '');

    if (learningOutcomes.length === 0) {
      setError(t('addCourse.pleaseAddLearningOutcomes') || 'Please add learning outcomes');
      setCurrentStep(1);
      return;
    }

    if (formData.priceType !== 'free' && formData.price.trim() === '') {
      setError(t('addCourse.pleaseEnterValidPrice') || 'Please enter a valid price');
      setCurrentStep(1);
      return;
    }

    // Step 2 validation - sections
    if (formData.sections.length === 0) {
      setError('Please add at least one section');
      setCurrentStep(2);
      return;
    }

    for (let i = 0; i < formData.sections.length; i++) {
      const section = formData.sections[i];
      if (!section.title.trim()) {
        setError(`Section ${i + 1} must have a title`);
        setCurrentStep(2);
        return;
      }
      if (section.lessons.length === 0) {
        setError(`Section "${section.title}" must have at least one lesson`);
        setCurrentStep(2);
        return;
      }
      for (let j = 0; j < section.lessons.length; j++) {
        const lesson = section.lessons[j];
        if (!lesson.title.trim()) {
          setError(`Lesson ${j + 1} in section "${section.title}" must have a title`);
          setCurrentStep(2);
          return;
        }
        if (lesson.type === 'video' && !lesson.videoFile && !lesson.content.trim()) {
          setError(`Lesson "${lesson.title}" must include a video file or URL`);
          setCurrentStep(2);
          return;
        }
        if (lesson.type !== 'video' && lesson.type !== 'quiz' && !lesson.content.trim()) {
          setError(`Lesson "${lesson.title}" must have content`);
          setCurrentStep(2);
          return;
        }
      }
    }

    try {
      setLoading(true);

      // Process sections and lessons, upload video files when provided
      const processedSections = await Promise.all(
        formData.sections.map(async (section) => {
          const lessons = await Promise.all(
            section.lessons.map(async (lesson) => {
              let content = lesson.content.trim();

              if (lesson.type === 'video' && lesson.videoFile) {
                const uploadResponse = await uploadCourseVideo(lesson.videoFile);
                content = uploadResponse?.data?.data?.url || content;
              }

              return {
                title: lesson.title.trim(),
                description: lesson.description.trim(),
                type: lesson.type,
                content,
                duration: Number(lesson.duration) || 0,
                isFree: lesson.isFree,
                order: lesson.order,
                resources: lesson.resources || [],
                quiz: lesson.type === 'quiz' ? {
                  instructions: (lesson.quiz && lesson.quiz.instructions) || content,
                  passingScore: (lesson.quiz && lesson.quiz.passingScore) || 50,
                  allowRetry: (lesson.quiz && typeof lesson.quiz.allowRetry !== 'undefined') ? lesson.quiz.allowRetry : true,
                  maxAttempts: (lesson.quiz && lesson.quiz.maxAttempts) || 0,
                  questions: (lesson.quiz && Array.isArray(lesson.quiz.questions)) ? lesson.quiz.questions : []
                } : undefined
              };
            })
          );

          return {
            title: section.title.trim(),
            description: section.description.trim(),
            order: section.order,
            lessons
          };
        })
      );

      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        level: formData.level,
        language: formData.language,
        priceType: formData.priceType,
        price: Number(formData.price || 0),
        learningOutcomes,
        requirements: formData.requirements.filter(req => req.trim()),
        targetAudience: formData.targetAudience.filter(aud => aud.trim()),
        sections: processedSections
      };

      // Handle thumbnail upload if provided
      if (formData.thumbnail) {
        const thumbnailResponse = await uploadCourseThumbnail(formData.thumbnail);
        payload.thumbnail = thumbnailResponse.data?.data?.url;
      }

      if (isEditMode) {
        await updateFormateurCourse(courseId, payload);
        setSuccess(t('addCourse.courseUpdatedSuccess') || 'Course updated successfully!');
      } else {
        await createFormateurCourse(payload);
        setSuccess(t('addCourse.courseCreatedSuccess') || 'Course created successfully!');
      }

      if (!isEditMode) {
        setFormData(initialData);
        setCurrentStep(1);
      }
    } catch (err) {
      const responseData = err.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0) {
        setError(responseData.errors.map((errorItem) => errorItem.msg || errorItem.message).join(' '));
      } else {
        setError(responseData?.message || t('addCourse.failedToCreateCourse') || 'Failed to create course');
      }
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

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${currentStep >= 1 ? 'active' : ''}`}>
              <span className="step-number">1</span>
              <span className="step-label">Course Info</span>
            </div>
            <div className={`step ${currentStep >= 2 ? 'active' : ''}`}>
              <span className="step-number">2</span>
              <span className="step-label">Sections & Lessons</span>
            </div>
            <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
              <span className="step-number">3</span>
              <span className="step-label">Review & Publish</span>
            </div>
          </div>

          <div className="course-form-card">
            <form className="settings-form" onSubmit={handleSubmit}>
              {/* Step 1: Course Information */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h2>Step 1: Course Information</h2>

                  <div className="form-group">
                    <label htmlFor="title">Course Title *</label>
                    <input
                      id="title"
                      name="title"
                      type="text"
                      className="form-input"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="Enter course title"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="description">Description *</label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-textarea"
                      rows="5"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe what students will learn"
                      required
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        name="category"
                        className="form-input"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="level">Level</label>
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
                      <label htmlFor="language">Language *</label>
                      <select
                        id="language"
                        name="language"
                        className="form-input"
                        value={formData.language}
                        onChange={handleInputChange}
                        required
                      >
                        {languages.map((language) => (
                          <option key={language} value={language}>{language}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="priceType">Price Type *</label>
                      <select
                        id="priceType"
                        name="priceType"
                        className="form-input"
                        value={formData.priceType}
                        onChange={handlePriceTypeChange}
                        required
                      >
                        {priceTypes.map((option) => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="price">Price</label>
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
                        placeholder={formData.priceType === 'free' ? 'Free Course' : 'Enter Price'}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="thumbnail">Course Thumbnail</label>
                    <input
                      id="thumbnail"
                      name="thumbnail"
                      type="file"
                      accept="image/*"
                      className="form-input"
                      onChange={handleFileChange}
                    />
                    {(formData.thumbnail || existingThumbnailUrl) && (
                      <div style={{ marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
                        <p style={{ color: '#374151', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          🖼️ Thumbnail Selected: {formData.thumbnail ? formData.thumbnail.name : 'Current image'}
                        </p>
                        <p style={{ color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          {formData.thumbnail
                            ? `Size: ${(formData.thumbnail.size / 1024 / 1024).toFixed(2)} MB | Type: ${formData.thumbnail.type || 'Unknown'}`
                            : 'Current thumbnail from course'}
                        </p>
                        <img
                          src={formData.thumbnail ? URL.createObjectURL(formData.thumbnail) : getMediaUrl(existingThumbnailUrl)}
                          alt="Thumbnail preview"
                          style={{ maxWidth: '200px', maxHeight: '150px', border: '1px solid #d1d5db', borderRadius: '4px', display: 'block' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Learning Outcomes *</label>
                    {formData.learningOutcomes.map((outcome, index) => (
                      <div key={`outcome-${index}`} className="learning-outcome-row">
                        <input
                          type="text"
                          className="form-input"
                          value={outcome}
                          onChange={(event) => handleArrayChange('learningOutcomes', index, event.target.value)}
                          placeholder="What will students learn?"
                        />
                        {formData.learningOutcomes.length > 1 && (
                          <button
                            type="button"
                            className="btn-text remove-outcome-btn"
                            onClick={() => removeArrayItem('learningOutcomes', index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn-secondary" onClick={() => addArrayItem('learningOutcomes')}>
                      Add Learning Outcome
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Requirements</label>
                    {formData.requirements.map((req, index) => (
                      <div key={`req-${index}`} className="learning-outcome-row">
                        <input
                          type="text"
                          className="form-input"
                          value={req}
                          onChange={(event) => handleArrayChange('requirements', index, event.target.value)}
                          placeholder="Prerequisites for this course"
                        />
                        {formData.requirements.length > 1 && (
                          <button
                            type="button"
                            className="btn-text remove-outcome-btn"
                            onClick={() => removeArrayItem('requirements', index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn-secondary" onClick={() => addArrayItem('requirements')}>
                      Add Requirement
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Target Audience</label>
                    {formData.targetAudience.map((audience, index) => (
                      <div key={`audience-${index}`} className="learning-outcome-row">
                        <input
                          type="text"
                          className="form-input"
                          value={audience}
                          onChange={(event) => handleArrayChange('targetAudience', index, event.target.value)}
                          placeholder="Who is this course for?"
                        />
                        {formData.targetAudience.length > 1 && (
                          <button
                            type="button"
                            className="btn-text remove-outcome-btn"
                            onClick={() => removeArrayItem('targetAudience', index)}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button type="button" className="btn-secondary" onClick={() => addArrayItem('targetAudience')}>
                      Add Target Audience
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Sections and Lessons */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h2>Step 2: Course Structure</h2>
                  <p>Create sections and add lessons to build your course content.</p>

                  {formData.sections.map((section, sectionIndex) => (
                    <div key={`section-${sectionIndex}`} className="section-card">
                      <div className="section-header">
                        <h3>Section {sectionIndex + 1}: {section.title || 'Untitled Section'}</h3>
                        <button
                          type="button"
                          className="btn-text remove-section-btn"
                          onClick={() => removeSection(sectionIndex)}
                        >
                          Remove Section
                        </button>
                      </div>

                      <div className="form-group">
                        <label>Section Title *</label>
                        <input
                          type="text"
                          className="form-input"
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          placeholder="Enter section title"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Section Description</label>
                        <textarea
                          className="form-textarea"
                          rows="2"
                          value={section.description}
                          onChange={(e) => updateSection(sectionIndex, 'description', e.target.value)}
                          placeholder="Describe this section"
                        />
                      </div>

                      <div className="lessons-container">
                        <h4>Lessons</h4>
                        {section.lessons.map((lesson, lessonIndex) => (
                          <div key={`lesson-${lessonIndex}`} className="lesson-card">
                            <div className="lesson-header">
                              <h5>Lesson {lessonIndex + 1}: {lesson.title || 'Untitled Lesson'}</h5>
                              <button
                                type="button"
                                className="btn-text remove-lesson-btn"
                                onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              >
                                Remove
                              </button>
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Lesson Title *</label>
                                <input
                                  type="text"
                                  className="form-input"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                  placeholder="Enter lesson title"
                                  required
                                />
                              </div>

                              <div className="form-group">
                                <label>Type</label>
                                <select
                                  className="form-input"
                                  value={lesson.type}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'type', e.target.value)}
                                >
                                  {lessonTypes.map((type) => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                  ))}
                                </select>
                              </div>

                              <div className="form-group">
                                <label>Duration (minutes)</label>
                                <input
                                  type="number"
                                  min="0"
                                  className="form-input"
                                  value={lesson.duration}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', e.target.value)}
                                />
                              </div>
                            </div>

                            <div className="form-group">
                              <label>Description</label>
                              <textarea
                                className="form-textarea"
                                rows="2"
                                value={lesson.description}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                                placeholder="Brief description of this lesson"
                              />
                            </div>

                            <div className="form-group">
                              <label>
                                Content *
                                {lesson.type === 'video' && ' (Video Upload)'}
                                {lesson.type === 'article' && ' (Text content)'}
                                {lesson.type === 'quiz' && ' (Quiz questions)'}
                                {lesson.type === 'assignment' && ' (Assignment description)'}
                                {lesson.type === 'file' && ' (File URL)'}
                              </label>

                              {lesson.type === 'article' ? (
                                <textarea
                                  className="form-textarea"
                                  rows="5"
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                                  placeholder="Enter article content"
                                />
                              ) : lesson.type === 'video' ? (
                                <>
                                  <input
                                    type="file"
                                    accept="video/*"
                                    className="form-input"
                                    onChange={(e) => handleLessonFileChange(sectionIndex, lessonIndex, e.target.files && e.target.files[0])}
                                  />
                                  {lesson.videoFile && (
                                    <div style={{ marginTop: '0.5rem', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: '#f9fafb' }}>
                                      <p style={{ color: '#374151', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                                        📹 Video Selected: {lesson.videoFile.name}
                                      </p>
                                      <p style={{ color: '#6b7280', margin: '0', fontSize: '0.85rem' }}>
                                        Size: {(lesson.videoFile.size / 1024 / 1024).toFixed(2)} MB | 
                                        Type: {lesson.videoFile.type || 'Unknown'}
                                      </p>
                                    </div>
                                  )}
                                </>
                              ) : lesson.type === 'quiz' ? (
                                <div className="quiz-editor">
                                  <div className="form-group">
                                    <label>Quiz Instructions</label>
                                    <textarea
                                      className="form-textarea"
                                      rows="3"
                                      value={(lesson.quiz && lesson.quiz.instructions) || ''}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setFormData((prev) => {
                                          const sections = [...prev.sections];
                                          const l = sections[sectionIndex].lessons[lessonIndex];
                                          l.quiz = l.quiz || { instructions: '', passingScore: 50, allowRetry: true, maxAttempts: 0, questions: [] };
                                          l.quiz.instructions = val;
                                          sections[sectionIndex].lessons[lessonIndex] = { ...l };
                                          return { ...prev, sections };
                                        });
                                      }}
                                      placeholder="Optional quiz instructions"
                                    />
                                  </div>

                                  <div className="form-group">
                                    <label>Questions</label>
                                    {(lesson.quiz && lesson.quiz.questions && lesson.quiz.questions.length > 0) ? (
                                      lesson.quiz.questions.map((q, qi) => (
                                        <div key={qi} className="quiz-question-row">
                                          <input
                                            type="text"
                                            className="form-input"
                                            value={q.prompt}
                                            placeholder={`Question ${qi + 1}`}
                                            onChange={(e) => updateQuizQuestionField(sectionIndex, lessonIndex, qi, 'prompt', e.target.value)}
                                          />
                                          <div style={{ marginTop: '0.4rem' }}>
                                            <select
                                              className="form-input"
                                              value={q.type}
                                              onChange={(e) => updateQuizQuestionField(sectionIndex, lessonIndex, qi, 'type', e.target.value)}
                                            >
                                              <option value="multiple-choice">Multiple Choice</option>
                                              <option value="true-false">True / False</option>
                                              <option value="short-answer">Short Answer</option>
                                              <option value="essay">Essay</option>
                                            </select>
                                          </div>

                                          {(q.type === 'multiple-choice' || q.type === 'true-false') && (
                                            <div className="form-group" style={{ marginTop: '0.5rem' }}>
                                              <label>Options</label>
                                              { (q.options || []).map((opt, oi) => (
                                                <div key={oi} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                  <input
                                                    type="text"
                                                    className="form-input"
                                                    value={opt.text}
                                                    placeholder={`Option ${oi + 1}`}
                                                    onChange={(e) => updateQuizOption(sectionIndex, lessonIndex, qi, oi, 'text', e.target.value)}
                                                  />
                                                  <label className="checkbox-label">
                                                    <input
                                                      type="checkbox"
                                                      checked={!!opt.isCorrect}
                                                      onChange={(e) => updateQuizOption(sectionIndex, lessonIndex, qi, oi, 'isCorrect', e.target.checked)}
                                                    />
                                                    Correct
                                                  </label>
                                                </div>
                                              ))}
                                              <button type="button" className="btn-add-option" onClick={() => addQuizOption(sectionIndex, lessonIndex, qi)}>+ Add Option</button>
                                            </div>
                                          )}

                                          <div style={{ marginTop: '0.5rem' }}>
                                            <input
                                              type="text"
                                              className="form-input"
                                              value={q.correctAnswer}
                                              placeholder="Correct Answer"
                                              onChange={(e) => updateQuizQuestionField(sectionIndex, lessonIndex, qi, 'correctAnswer', e.target.value)}
                                            />
                                          </div>

                                          <div style={{ marginTop: '0.5rem' }}>
                                            <textarea
                                              className="form-textarea"
                                              rows="2"
                                              value={q.explanation}
                                              placeholder="Explanation (optional)"
                                              onChange={(e) => updateQuizQuestionField(sectionIndex, lessonIndex, qi, 'explanation', e.target.value)}
                                            />
                                          </div>

                                          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                            <button type="button" className="btn-text remove-lesson-btn" onClick={() => removeQuizQuestion(sectionIndex, lessonIndex, qi)}>Remove Question</button>
                                          </div>
                                        </div>
                                      ))
                                    ) : (
                                      <p className="no-questions">No questions yet.</p>
                                    )}

                                    <button type="button" className="btn-secondary" onClick={() => addQuizQuestion(sectionIndex, lessonIndex)}>Add Question</button>
                                  </div>
                                </div>
                              ) : (
                                <input
                                  type="text"
                                  className="form-input"
                                  value={lesson.content}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'content', e.target.value)}
                                  placeholder={
                                  lesson.type === 'quiz' ? 'Optional quiz instructions' :
                                  lesson.type === 'assignment' ? 'Enter assignment description' :
                                  'Enter file URL'
                                }
                              />
                              )}
                            </div>

                            <div className="form-group">
                              <label className="checkbox-label">
                                <input
                                  type="checkbox"
                                  checked={lesson.isFree}
                                  onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'isFree', e.target.checked)}
                                />
                                Free Preview Lesson
                              </label>
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn-secondary"
                          onClick={() => addLesson(sectionIndex)}
                        >
                          Add Lesson
                        </button>
                      </div>
                    </div>
                  ))}

                  <button type="button" className="btn-primary" onClick={addSection}>
                    Add Section
                  </button>
                </div>
              )}

              {/* Step 3: Review and Publish */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h2>Step 3: Review & Publish</h2>
                  <div className="review-summary">
                    <h3>Course Summary</h3>
                    <div className="summary-item">
                      <strong>Title:</strong> {formData.title}
                    </div>
                    <div className="summary-item">
                      <strong>Description:</strong> {formData.description}
                    </div>
                    <div className="summary-item">
                      <strong>Category:</strong> {formData.category}
                    </div>
                    <div className="summary-item">
                      <strong>Price:</strong> {formData.priceType === 'free' ? 'Free' : `$${formData.price}`}
                    </div>
                    <div className="summary-item">
                      <strong>Sections:</strong> {formData.sections.length}
                    </div>
                    <div className="summary-item">
                      <strong>Total Lessons:</strong> {formData.sections.reduce((total, section) => total + section.lessons.length, 0)}
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="form-navigation">
                {currentStep > 1 && (
                  <button type="button" className="btn-secondary" onClick={prevStep}>
                    Previous
                  </button>
                )}

                {currentStep < 3 ? (
                  <button type="button" className="btn-primary" onClick={nextStep}>
                    Next
                  </button>
                ) : (
                  <button type="submit" className="add-course-btn" disabled={loading}>
                    {loading ? (isEditMode ? 'Updating Course...' : 'Creating Course...') : (isEditMode ? 'Update Course' : 'Create Course')}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddCourses;
