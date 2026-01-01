import React from 'react';
import image11 from "../../assets/image/home_page/image11.png";
import image12 from "../../assets/image/home_page/image12.png";

import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section className="testimonials-section">
      <div className="testimonials-top">
        <div className="testimonials-header">
          <p className="eyebrow">{t('homePage.testimonials.eyebrow')}</p>
          <h2 className="testimonials-title">{t('homePage.testimonials.title')}</h2>
        </div>

        <div className="testimonials-wrap">
          <div className="testimonial-card">
            <span className="quote quote-left">“</span>
            <span className="quote quote-right">”</span>

            <p className="testimonial-text">
              {t('homePage.testimonials.testimonial_text')}
            </p>

            <button className="nav-arrow left" aria-label="previous">‹</button>
            <button className="nav-arrow right" aria-label="next">›</button>

            <div className="testimonial-below">
              <div className="avatar">JS</div>
              <div className="author">
                <div className="name">John Smith</div>
                <div className="role">Founder of Awesometown Technology</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="promo-row">
        <div className="promo-card purple">
          <div className="promo-content">
            <h3>{t('homePage.testimonials.promo1_title')}</h3>
            <p>{t('homePage.testimonials.promo1_text')}</p>
            <button className="promo-btn">{t('homePage.testimonials.promo1_btn')}</button>
          </div>
          <div className="promo-figure" aria-hidden="true">
            <img src={image11} alt="instructor" className="promo-img" />
          </div>
        </div>

        <div className="promo-card dark">
          <div className="promo-content">
            <h3>{t('homePage.testimonials.promo2_title')}</h3>
            <p>{t('homePage.testimonials.promo2_text')}</p>
            <button className="promo-btn outline">{t('homePage.testimonials.promo2_btn')}</button>
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
