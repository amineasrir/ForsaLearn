import React from 'react';
import { useTranslation } from 'react-i18next';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { useWishlist } from '../../context/WishlistContext';
import { getMediaUrl } from '../../utils/mediaUrl';
import { FaHeart, FaPlayCircle, FaStar } from 'react-icons/fa';
import './wishlist.css';

const ApprenantWishlist = () => {
  const { t } = useTranslation();
  const { items, toggleItem } = useWishlist();

  return (
    <ApprenantLayout>

          <div className="wishlist-grid">
            {items.length === 0 ? (
              <div className="wishlist-empty-message">
                <p>{t('apprenant.wishlistEmpty')}</p>
              </div>
            ) : (
              items.map(course => (
                <div key={course.id} className="course-card">
                  <div className="card-media">
                    <img src={getMediaUrl(course.thumbnail) || require('../../assets/image/cours/cours.jpg')} alt={course.title} />
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
                      <FaStar /> <span>{course.rating} ({course.reviews} {t('apprenant.reviews')})</span>
                    </div>
                    <p className="price">{course.price}$</p>
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
