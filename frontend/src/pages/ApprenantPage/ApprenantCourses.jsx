import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaPlayCircle, FaStar, FaThLarge, FaBars } from 'react-icons/fa';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import { useWishlist } from '../../context/WishlistContext';
import './dashboard.css';

// sample courses mimicking screenshot (use only existing images)
const img1 = require('../../assets/image/cours/cours.jpg');
const img2 = require('../../assets/image/cours/cours1.jpg');
const img3 = require('../../assets/image/cours/cours2.jpg');
const img4 = require('../../assets/image/cours/cours3.jpg');

const sampleCourses = [
  {
    id: 1,
    title: 'Information About UI/UX Design Degree',
    instructor: 'David Benitez',
    category: 'Design',
    price: '$120',
    rating: 4.9,
    reviews: 200,
    favorite: true,
    image: img2,
  },
  {
    id: 2,
    title: 'Wordpress for Beginners - Master Wordpress Quickly',
    instructor: 'Ana Reyes',
    category: 'Wordpress',
    price: '$140',
    rating: 4.4,
    reviews: 160,
    favorite: false,
    image: img3,
  },
  {
    id: 3,
    title: 'Sketch from A to Z (2024): Become an app designer',
    instructor: 'Andrew Pirtie',
    category: 'Design',
    price: '$160',
    image: img4,
  },
  {
    id: 4,
    title: 'Build Responsive Real World Websites with Crash Course',
    instructor: 'Christy Garner',
    category: 'Programming',
    price: '$200',
    image: img1,
  },
  {
    id: 5,
    title: 'Learn JavaScript and Express to become a Expert',
    instructor: 'Justin Gregory',
    category: 'Programming',
    price: '$130',
    image: img2,
  },
  {
    id: 6,
    title: 'Introduction to Python Programming',
    instructor: 'Carolyn Hines',
    category: 'Programming',
    price: '$150',
    image: img3,
  },
  {
    id: 7,
    title: 'Information About Photoshop Design Degree',
    instructor: 'Nancy Duarte',
    category: 'Design',
    price: '$110',
    image: img4,
  },
  {
    id: 8,
    title: 'C# Developers Double Your Coding with Visual Studio',
    instructor: 'James Kagan',
    category: 'Programming',
    price: '$180',
    image: img1,
  },
  {
    id: 9,
    title: 'Build Responsive Websites with HTML5 and CSS3',
    instructor: 'Rafael Miller',
    category: 'Programming',
    price: '$170',
    image: img2,
  },
];

const ApprenantCourses = () => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const { items, toggleItem } = useWishlist();

  const isInWishlist = courseId => items.some(c => c.id === courseId);

  const toggleSidebar = () => setSidebarVisible(v => !v);

  return (
    <div className="apprenant-dashboard">
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo" />
          </div>
          <div className="header-right">
            <button className="lang-btn">ENG</button>
            <div className="notification-icon"></div>
            <div className="cart-icon"></div>
          </div>
        </div>
        <div className="header-center">
          <h1>Course Grid</h1>
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>Course Grid</span>
          </nav>
        </div>
      </header>

      <CardP />

      <div className="dashboard-container course-dashboard-container">
        {sidebarVisible && <Sidebar />}
        <main className="main-content">
          <div className={`course-grid-page${sidebarVisible ? '' : ' no-sidebar'}`}>
            {sidebarVisible && (
              <aside className="course-filters">
              <h3>Filters</h3>
              <div className="filter-section">
                <h4>Categories</h4>
                <label><input type="checkbox" /> Backend (3)</label><br />
                <label><input type="checkbox" /> CSS (2)</label><br />
                <label><input type="checkbox" /> Frontend (2)</label><br />
                <label><input type="checkbox" /> General (2)</label><br />
                <label><input type="checkbox" /> IT & Software (2)</label><br />
                <label><input type="checkbox" /> Photography (2)</label><br />
                <label><input type="checkbox" /> Programming Language (3)</label><br />
                <label><input type="checkbox" /> Technology (2)</label><br />
                <button className="clear-filters">Clear</button>
              </div>
              <div className="filter-section">
                <h4>Price</h4>
                <label><input type="checkbox" /> All (10)</label><br />
                <label><input type="checkbox" /> Free (5)</label><br />
                <label><input type="checkbox" /> Paid (3)</label><br />
              </div>
              <div className="filter-section">
                <h4>Range</h4>
                <input type="range" min="0" max="1000" />
              </div>
              <div className="filter-section">
                <h4>Level</h4>
                <label><input type="checkbox" /> Beginner (10)</label><br />
                <label><input type="checkbox" /> Intermediate (5)</label><br />
                <label><input type="checkbox" /> Advanced (21)</label><br />
                <label><input type="checkbox" /> Expert (3)</label><br />
              </div>
              <div className="filter-section">
                <h4>Reviews</h4>
                {/* star icons omitted for brevity */}
                <label><input type="radio" name="review" /> ★★★★★</label><br />
                <label><input type="radio" name="review" /> ★★★★☆</label><br />
                <label><input type="radio" name="review" /> ★★★☆☆</label><br />
              </div>
            </aside>
            )}

            <section className="course-grid-section">
              <div className="course-grid-header">
                <span>Showing 1-9 of 50 results</span>
                <div className="view-toggle">
                  <button className="grid-view active"><FaThLarge /></button>
                  <button className="list-view"><FaBars /></button>
                </div>
                <select className="sort-select">
                  <option>Newly published</option>
                </select>
                <input type="search" placeholder="Search" className="course-search" />
              </div>

              <div className="course-cards">
                {sampleCourses.map(course => (
                  <div key={course.id} className="course-card">
                    <div className="card-media">
                      <img src={course.image} alt={course.title} />
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
                      <p className="instructor">{course.instructor}</p>
                      <p className="category">{course.category}</p>
                      <div className="course-rating">
                        <FaStar /> <span>{course.rating} ({course.reviews} Reviews)</span>
                      </div>
                      <p className="price">{course.price}</p>
                      <button className="view-course-btn">View Course</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantCourses;
