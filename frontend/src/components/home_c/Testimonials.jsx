import React from 'react';
import image11 from "../../assets/image/home_page/image11.png";
import image12 from "../../assets/image/home_page/image12.png";

const Testimonials = () => {
  return (
    <section className="testimonials-section">
      <div className="testimonials-top">
        <div className="testimonials-header">
          <p className="eyebrow">Check out these real reviews</p>
          <h2 className="testimonials-title">Users-love-us Don't take it from us.</h2>
        </div>

        <div className="testimonials-wrap">
          <div className="testimonial-card">
            <span className="quote quote-left">“</span>
            <span className="quote quote-right">”</span>

            <p className="testimonial-text">
              I really appreciated my mentor's insight, but sometimes I felt overwhelmed by the amount of
              information they provided. It would have been helpful to focus on one or two areas at a time
              rather than trying to cover everything.
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
            <h3>Become An Instructor</h3>
            <p>Top instructors from around the world teach millions of students on Mentoring.</p>
            <button className="promo-btn">Register as Instructor</button>
          </div>
          <div className="promo-figure" aria-hidden="true">
            <img src={image11} alt="instructor" className="promo-img" />
          </div>
        </div>

        <div className="promo-card dark">
          <div className="promo-content">
            <h3>Transform Access</h3>
            <p>Create an account to receive our newsletter course promotions.</p>
            <button className="promo-btn outline">Register as student</button>
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
