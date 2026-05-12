import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import { useWishlist } from '../../context/WishlistContext';
import { FaHeart, FaPlayCircle, FaStar } from 'react-icons/fa';

const ApprenantWishlist = () => {
  const { t } = useTranslation();
  const { items, toggleItem } = useWishlist();

  const rightContent = (
    <>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <ApprenantLayout>

          <div className="wishlist-grid">
            {items.length === 0 ? (
              <p>{t('apprenant.wishlistEmpty')}</p>
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
                    <p className="instructor">{course.instructor || t('instructor')}</p>
                    <p className="category">{course.category}</p>
                    <div className="course-rating">
                      <FaStar /> <span>{course.rating} ({course.reviews} Reviews)</span>
                    </div>
                    <p className="price">{course.price}</p>
                    <button className="view-course-btn">{t('apprenant.viewCourse')}</button>
                  </div>
                </div>
              ))
            )}
          </div>
      </ApprenantLayout>
  );
};

export default ApprenantWishlist;
