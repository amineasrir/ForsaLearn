import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChalkboardTeacher, faCertificate, faCompass } from "@fortawesome/free-solid-svg-icons";

import image3 from '../../assets/image/home_page/image3.png';

const Mentor = () => {
  return (
    <section className="mentor-section">
      <div className="mentor-hero">
        <div className="container mentor-hero-inner">
          <h2 className="mentor-title">Master the skills to drive your career</h2>
          <p className="mentor-sub">The right course, guided by an expert mentor, can provide invaluable insights, practical skills</p>

          <div className="mentor-features">
            <div className="mentor-feature">
              <div className="mf-icon"><FontAwesomeIcon icon={faChalkboardTeacher} /></div>
              <h4>Stay motivated with instructors</h4>
              <p>Stay motivated with engaging instructors on our platform, guiding you through every course.</p>
            </div>

            <div className="mentor-feature " >
              <div className="mf-icon" ><FontAwesomeIcon icon={faCertificate}  style={{color:"FF4667"}}/></div>
              <h4>Get certified on courses</h4>
              <p>Get certified, master modern tech skills, and level up your career whether you're starting.</p>
            </div>

            <div className="mentor-feature">
              <div className="mf-icon"><FontAwesomeIcon icon={faCompass}  /></div>
              <h4>Build skills on your way</h4>
              <p>Build skills your way with hands-on labs and immersive courses, tailored to fit.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mentor-join">
        <div className="container mentor-join-inner">
          <div className="mentor-image">
            <img src={image3} alt="Mentor" />
          </div>

          <div className="mentor-content">
            <h3>Want to share your knowledge? Join us a Mentor</h3>
            <p className="mentor-lead">High-definition video is video of higher resolution and quality than standard-definition. While there is no standardized meaning for high-definition, generally any video.</p>

            <ul className="mentor-checks">
              <li><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> Access Your Class anywhere</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> Flexible Course Plan</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> Quality Assurance</li>
              <li><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> The Most World Class Instructors</li>
            </ul>

            <button className="btn-primary">Read More</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentor;
