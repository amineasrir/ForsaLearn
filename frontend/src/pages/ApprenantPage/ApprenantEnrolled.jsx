import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import { FaStar } from 'react-icons/fa';
import './dashboard.css';

const sampleCourses = [
  {
    id: 1,
    title: 'Information About UI/UX Design Degree',
    instructor: 'David Benitez',
    category: 'Design',
    rating: 4.9,
    reviews: 200,
    price: '$120',
    image: require('../../assets/image/cours/cours1.jpg'),
  },
  {
    id: 2,
    title: 'Wordpress for Beginners - Master Wordpress Quickly',
    instructor: 'Ana Reyes',
    category: 'Wordpress',
    rating: 4.4,
    reviews: 160,
    price: '$140',
    image: require('../../assets/image/cours/cours2.jpg'),
  },
  {
    id: 3,
    title: 'Sketch from A to Z (2024): Become an app designer',
    instructor: 'Andrew Pirtie',
    category: 'Design',
    rating: 4.6,
    reviews: 170,
    price: '$160',
    image: require('../../assets/image/cours/cours3.jpg'),
  },
  {
    id: 3,
    title: 'Sketch from A to Z (2024): Become an app designer',
    instructor: 'Andrew Pirtie',
    category: 'Design',
    rating: 4.6,
    reviews: 170,
    price: '$160',
    image: require('../../assets/image/cours/cours3.jpg'),
  },
  {
    id: 3,
    title: 'Sketch from A to Z (2024): Become an app designer',
    instructor: 'Andrew Pirtie',
    category: 'Design',
    rating: 4.6,
    reviews: 170,
    price: '$160',
    image: require('../../assets/image/cours/cours3.jpg'),
  },
  {
    id: 3,
    title: 'Sketch from A to Z (2024): Become an app designer',
    instructor: 'Andrew Pirtie',
    category: 'Design',
    rating: 4.6,
    reviews: 170,
    price: '$160',
    image: require('../../assets/image/cours/cours3.jpg'),
  },
];

const ApprenantEnrolled = () => {
  const [tab, setTab] = useState('enrolled');
  const counts = { enrolled: 9, active: 6, completed: 3 };

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
        title="Enrolled Courses"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'Enrolled Courses' }]}
        rightContent={rightContent}
      />

      {/* profile banner */}
      <CardP />

      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          <section className="enrolled-courses">
            <div className="courses-header-row">
            <h2>Enrolled Courses</h2>
            <div className="courses-tabs">
              <button
                className={tab === 'enrolled' ? 'active' : ''}
                onClick={() => setTab('enrolled')}
              >
                Enrolled ({counts.enrolled})
              </button>
              <button
                className={tab === 'active' ? 'active' : ''}
                onClick={() => setTab('active')}
              >
                Active ({counts.active})
              </button>
              <button
                className={tab === 'completed' ? 'active' : ''}
                onClick={() => setTab('completed')}
              >
                Completed ({counts.completed})
              </button>
            </div>
          </div>

            <div className="courses-container">
              {sampleCourses.map(course => (
                <div key={course.id} className="course-card">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="course-image"
                  />
                  <div className="course-info">
                    <p className="course-category">{course.category}</p>
                    <h3>{course.title}</h3>
                    <p className="instructor">{course.instructor}</p>
                    <div className="course-footer">
                      <div className="rating">
                        <FaStar className="star" />
                        <span>
                          {course.rating} ({course.reviews} Reviews)
                        </span>
                      </div>
                    </div>
                    <div className="course-action">
                      <span className="price">{course.price}</span>
                      <button className="view-course-btn">View Course →</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApprenantEnrolled;
