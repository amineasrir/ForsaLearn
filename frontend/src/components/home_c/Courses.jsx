import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import cours from '../../assets/image/cours/cours.jpg'
import cours1 from '../../assets/image/cours/cours1.jpg'
import cours2 from '../../assets/image/cours/cours2.jpg'
import cours3 from '../../assets/image/cours/cours3.jpg'
const courses = [
  {
    category: 'Web Design',
    title: "Build Responsive Websites with HTML",
    price: 650,
    oldPrice: 900,
    duration: "8 hrs",
    students: 256,
    image: { src: cours },
  },
  {
    category: 'Pyhton Development',
    title: "The Complete Web Developer Python Course",
    price: 300,
    oldPrice: 400,
    duration: "6 hrs",
    students: 356,
    image: { src: cours1 },
  },
  {
    category: 'Business Management',
    title: "The Complete Business Management Course",
    price: 200,
    oldPrice: 900,
    duration: "6 hrs",
    students: 224,
    image: { src: cours2 }
  },
  {
    category: 'Creative Arts & media',
    title: "Build Creative Arts & Media Course Completed",
    price: 700,
    oldPrice: 900,
    duration: "6 hrs",
    students: 250,
    image: { src: cours3 },
  }
];

const Courses = () => {
  return (
    <section className="courses">
      <h1>Popular Courses</h1>

      <div className="course-grid">
        {courses.map((course, index) => (
          <div className="course-card" key={index}>
            <div className="card-media">
              <img src={course.image.src} alt={course.title} />
              <span className="fav-badge"><FontAwesomeIcon icon={faHeart} /></span>
            </div>
            <div className="course-info">
              <a href="#" className="course-category">{course.category}</a>
              <h3>{course.title}</h3>
              <div className="course-students">
                <FontAwesomeIcon icon={faUsers} /> <span className="students-count">{course.students} Students</span>
              </div>
              <hr />
              <div className="course-footer">
                <p className="course-price"><span className="price-amount">${course.price}</span> <span className="old-price">${course.oldPrice}</span></p>
                <div className="course-meta">
                  <span>
                    <FontAwesomeIcon icon={faClock} /> {course.duration}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="view-all-btn">View all Courses</button>
    </section>
  );
};

export default Courses;
