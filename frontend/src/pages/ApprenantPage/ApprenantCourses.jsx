import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeart, FaPlayCircle, FaStar, FaThLarge, FaBars } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { useWishlist } from '../../context/WishlistContext';
import { getApprenantProfile, getPublishedCourses } from '../../services/apprenentService';
import './dashboard.css';

const ApprenantCourses = () => {
  const { t } = useTranslation();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const { items, toggleItem } = useWishlist();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesResponse, userResponse] = await Promise.all([
          getPublishedCourses({ search: searchTerm || undefined }),
          getApprenantProfile()
        ]);

        setCourses(coursesResponse.data?.data || []);
        setUser(userResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      }
    };

    loadData();
  }, [searchTerm]);

  const isInWishlist = courseId => items.some(c => c.id === courseId || c._id === courseId);

  const mappedCourses = useMemo(() => courses.map((course) => ({
    ...course,
    id: course._id,
    instructor: course.formateur?.fullName || 'Instructor',
    priceLabel: course.priceType === 'free' ? 'Free' : `$${Number(course.price || 0).toFixed(2)}`
  })), [courses]);

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.courses')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.courses') }]}
      rightContent={rightContent}
      className="course-dashboard-container"
    >
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}
          <div className="course-grid-page">
            <aside className="course-filters">
              <h3>{t('apprenant.filters')}</h3>
              <div className="filter-section">
                <h4>{t('apprenant.publishedCourses')}</h4>
                <p>{t('apprenant.coursesAvailable', { count: mappedCourses.length })}</p>
                <button className="clear-filters">{t('apprenant.clear')}</button>
              </div>
            </aside>

            <section className="course-grid-section">
              <div className="course-grid-header">
                <span>{t('apprenant.showingResults', { count: mappedCourses.length })}</span>
                <div className="view-toggle">
                  <button className="grid-view active"><FaThLarge /></button>
                  <button className="list-view"><FaBars /></button>
                </div>
                <select className="sort-select">
                  <option>{t('apprenant.newlyPublished')}</option>
                </select>
                <input
                  type="search"
                  placeholder={t('apprenant.search')}
                  className="course-search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="course-cards">
                {mappedCourses.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="card-media">
                      <img src={course.thumbnail || require('../../assets/image/cours/cours.jpg')} alt={course.title} />
                      <span className="play-overlay"><FaPlayCircle /></span>
                      <span
                        className={`fav-badge ${isInWishlist(course.id) ? 'active' : ''}`}
                        onClick={() => toggleItem(course)}
                      >
                        <FaHeart />
                      </span>
                    </div>
                    <div className="course-details">
                      <h4>{course.title}</h4>
                      <p className="instructor">{course.instructor || t('instructor')}</p>
                      <p className="category">{course.category}</p>
                      <div className="course-rating">
                        <FaStar /> <span>{Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0} Reviews)</span>
                      </div>
                      <p className="price">{course.priceLabel}</p>
                      <button className="view-course-btn">{t('apprenant.viewCourse')}</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
      </ApprenantLayout>
  );
};

export default ApprenantCourses;
