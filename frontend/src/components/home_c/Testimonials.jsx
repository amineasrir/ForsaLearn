import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image11 from "../../assets/image/home_page/image11.png";
import image12 from "../../assets/image/home_page/image12.png";

import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Sample testimonials data
  

  const handlePromo1 = () => {
    navigate("/formateur/signup");
  };

  const handlePromo2 = () => {
    navigate("/signup");
  };


  return (
    <section className="testimonials-section" id="testimonials">
      

      <div className="promo-row">
        <div className="promo-card purple">
          <div className="promo-content">
            <h3>{t('homePage.testimonials.promo1_title')}</h3>
            <p>{t('homePage.testimonials.promo1_text')}</p>
            <button className="promo-btn" onClick={handlePromo1}>{t('homePage.testimonials.promo1_btn')}</button>
          </div>
          <div className="promo-figure" aria-hidden="true">
            <img src={image11} alt="instructor" className="promo-img" />
          </div>
        </div>

        <div className="promo-card dark">
          <div className="promo-content">
            <h3>{t('homePage.testimonials.promo2_title')}</h3>
            <p>{t('homePage.testimonials.promo2_text')}</p>
            <button className="promo-btn outline" onClick={handlePromo2}>{t('homePage.testimonials.promo2_btn')}</button>
          </div>
          <div className="promo-figure" aria-hidden="true">
            <img src={image12} alt="student" className="promo-img" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
