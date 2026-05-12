import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaPlayCircle, FaStar, FaThLarge, FaBars, FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import { useWishlist } from '../../context/WishlistContext';
import { getApprenantProfile, getPublishedCourses } from '../../services/apprenentService';
import { getMediaUrl } from '../../utils/mediaUrl';
import './dashboard.css';

const CATEGORIES = [
  { id: 'backend',     label: 'Backend',              count: 3 },
  { id: 'css',         label: 'CSS',                  count: 2 },
  { id: 'frontend',   label: 'Frontend',              count: 2 },
  { id: 'general',    label: 'General',               count: 2 },
  { id: 'it',         label: 'IT & Software',         count: 2 },
  { id: 'photography',label: 'Photography',           count: 2 },
  { id: 'programming',label: 'Programming Language',  count: 3 },
  { id: 'technology', label: 'Technology',            count: 2 },
];

const SORT_OPTIONS = [
  { value: 'newest',  label: 'Newly Published' },
  { value: 'rating',  label: 'Highest Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
];

const ApprenantCourses = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('list');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showAllCats, setShowAllCats] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { items, toggleItem } = useWishlist();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [coursesRes, userRes] = await Promise.all([
          getPublishedCourses({ search: searchTerm || undefined }),
          getApprenantProfile()
        ]);
        setCourses(coursesRes.data?.data || []);
        setUser(userRes.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      }
    };
    loadData();
  }, [searchTerm]);

  const isInWishlist = id => items.some(c => c.id === id || c._id === id);

  const visibleCats = showAllCats ? CATEGORIES : CATEGORIES.slice(0, 6);

  const toggleCat = id => {
    setSelectedCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const mappedCourses = useMemo(() => {
    let list = courses.map(c => ({
      ...c,
      id: c._id,
      instructor: c.formateur?.fullName || 'Instructor',
      priceLabel: c.priceType === 'free' ? 'Free' : `$${Number(c.price || 0).toFixed(2)}`,
      rating: Number(c.averageRating || 0),
      reviews: c.totalReviews || 0,
    }));

    if (selectedCategories.length > 0) {
      list = list.filter(c =>
        selectedCategories.some(cat => c.category?.toLowerCase().includes(cat))
      );
    }

    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'price-asc') list = [...list].sort((a, b) => (a.price || 0) - (b.price || 0));
    else if (sortBy === 'price-desc') list = [...list].sort((a, b) => (b.price || 0) - (a.price || 0));

    return list;
  }, [courses, selectedCategories, sortBy]);

  return (
    <ApprenantLayout
      title={t('apprenant.courses')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.courses') }]}
      rightContent={<><div className="notification-icon" /><div className="cart-icon" /></>}
    >
      <CardP user={user} />

      {error && <div className="error-message">{error}</div>}

      {/* Mobile filter toggle */}
      <div className="cg-mobile-bar">
        <button className="cg-filter-toggle" onClick={() => setSidebarOpen(true)}>
          <FaFilter /> Filters
        </button>
        <span className="cg-result-count">
          Showing 1–{mappedCourses.length} of {mappedCourses.length} results
        </span>
      </div>

      <div className="cg-layout">

        {/* ---- Sidebar overlay (mobile) ---- */}
        {sidebarOpen && (
          <div className="cg-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ---- Filters sidebar ---- */}
        <aside className={`cg-sidebar ${sidebarOpen ? 'open' : ''}`}>
          <div className="cg-sidebar-head">
            <span className="cg-sidebar-title"><FaFilter /> Filters</span>
            <button className="cg-sidebar-close" onClick={() => setSidebarOpen(false)}>
              <FaTimes />
            </button>
          </div>

          {selectedCategories.length > 0 && (
            <button className="cg-clear-btn" onClick={() => setSelectedCategories([])}>
              Clear
            </button>
          )}

          <div className="cg-filter-block">
            <h4 className="cg-filter-title">
              Categories
              <button className="cg-filter-toggle-arrow" onClick={() => {}}>▲</button>
            </h4>
            <div className="cg-cat-list">
              {visibleCats.map(cat => (
                <label key={cat.id} className="cg-cat-label">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => toggleCat(cat.id)}
                    className="cg-checkbox"
                  />
                  <span>{cat.label} ({cat.count})</span>
                </label>
              ))}
            </div>
            <button className="cg-seemore" onClick={() => setShowAllCats(v => !v)}>
              {showAllCats ? 'See Less' : 'See More'}
            </button>
          </div>
        </aside>

        {/* ---- Course grid section ---- */}
        <section className="cg-main">

          {/* Top bar */}
          <div className="cg-topbar">
            <div className="cg-topbar-left">
              <span className="cg-count">
                Showing 1–{mappedCourses.length} of {mappedCourses.length} results
              </span>
            </div>
            <div className="cg-topbar-right">
              <div className="cg-view-btns">
                <button
                  className={`cg-view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View"
                >
                  <FaThLarge />
                </button>
                <button
                  className={`cg-view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View"
                >
                  <FaBars />
                </button>
              </div>
              <select
                className="cg-sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="cg-search-wrap">
                <FaSearch className="cg-search-icon" />
                <input
                  type="search"
                  placeholder="Search"
                  className="cg-search"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Cards */}
          <div className={`cg-cards ${viewMode}`}>
            {mappedCourses.length === 0 ? (
              <div className="cg-empty">No courses found.</div>
            ) : mappedCourses.map(course => (
              <div
                key={course.id}
                className={`cg-card ${viewMode}`}
                onClick={() => navigate(`/apprenant/course/${course.id}`)}
              >
                {/* Thumbnail */}
                <div className="cg-card-thumb">
                  <img
                    src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours.jpg')}
                    alt={course.title}
                  />
                  <span className="cg-play"><FaPlayCircle /></span>
                  <button
                    className={`cg-fav ${isInWishlist(course.id) ? 'active' : ''}`}
                    onClick={e => { e.stopPropagation(); toggleItem(course); }}
                    aria-label="Toggle wishlist"
                  >
                    <FaHeart />
                  </button>
                </div>

                {/* Body */}
                <div className="cg-card-body">
                  {/* Instructor row */}
                  <div className="cg-card-instructor-row">
                    <img
                      src={getMediaUrl(course.formateur?.profileImage) || require('../../assets/image/student/ava.jpg')}
                      alt={course.instructor}
                      className="cg-card-avatar"
                    />
                    <span className="cg-card-instructor-name">{course.instructor}</span>
                    <span className="cg-card-cat-tag">{course.category}</span>
                  </div>

                  <h4 className="cg-card-title">{course.title}</h4>

                  {/* Rating */}
                  <div className="cg-card-rating">
                    <FaStar className="cg-star" />
                    <span>{course.rating.toFixed(1)} ({course.reviews} Reviews)</span>
                    {course.level && <span className="cg-dot">•</span>}
                    {course.level && <span>{course.level}</span>}
                  </div>

                  {/* Footer: price + CTA */}
                  <div className="cg-card-footer">
                    <span className="cg-price">{course.priceLabel}</span>
                    <button
                      className="cg-cta"
                      onClick={e => { e.stopPropagation(); navigate(`/apprenant/course/${course.id}`); }}
                    >
                      Get Course &rsaquo;
                    </button>
                  </div>
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