import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import { useWishlist } from '../../context/WishlistContext';
import { FaHeart, FaPlayCircle, FaStar } from 'react-icons/fa';

const ApprenantWishlist = () => {
  const { items, toggleItem } = useWishlist();

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
              <h1>wishlist</h1>
              <nav className="breadcrumb">
                <Link to="/">Home</Link>
                <span>/</span>
                <span>Wishlist</span>
              </nav>
            </div>
          </header>
      <CardP />

      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="wishlist-grid">
            {items.length === 0 ? (
              <p>Your wishlist is empty.</p>
            ) : (
              items.map(course => (
                <div key={course.id} className="course-card">
                  <div className="card-media">
                    <img src={course.image} alt={course.title} />
                    <span
                      className={`fav-badge active`}
                      onClick={() => toggleItem(course)}
                    >
                      <FaHeart />
                    </span>
                    <span className="play-overlay"><FaPlayCircle /></span>
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
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantWishlist;
