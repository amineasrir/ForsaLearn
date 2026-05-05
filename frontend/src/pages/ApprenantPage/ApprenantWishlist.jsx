import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import './dashboard.css';
import { useWishlist } from '../../context/WishlistContext';
import { FaHeart, FaPlayCircle, FaStar } from 'react-icons/fa';

const ApprenantWishlist = () => {
  const { items, toggleItem } = useWishlist();

  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="Wishlist"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'Wishlist' }]}
        rightContent={rightContent}
      />

      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
      <CardP  />

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
