import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCertificate,
  faChartBar,
  faChalkboardTeacher,
  faCloud,
} from "@fortawesome/free-solid-svg-icons";

import image2_fe from '../../assets/image/home_page/image2_fe.png';
import image3_ho from '../../assets/image/home_page/image3_ho.png';

function SkillsSection() {
  return (
    <section className="skills-section">
      <div className="container">
        {/* LEFT - Images Stack */}
        <div className="skills-images">
          <div className="bg-rect" aria-hidden="true"></div>

          {/* Back rounded image */}
          <img
            src={image3_ho}
            alt="Learning experience"
            className="stack-img top"
          />

          {/* Overlapping Image */}
          <img
            src={image2_fe}
            
            className="graduate-img"
          />
        </div>

        {/* RIGHT - Content */}
        <div className="skills-content">
          {/* Text Content */}
          <h1 className="skills-title">
            Master the skills to drive your career
          </h1>

          <p className="skills-lead">
            Get certified, master modern tech skills, and level up your career whether you are starting out or a seasoned pro.  95% of eLearning learners report our hands-on content directly helped their careers.
          </p>

          {/* Features Grid */}
          <div className="skills-cards">
            {/* Feature 1: Certification */}
            <div className="card_feature2">
              <div className="feature-icon2">
                <FontAwesomeIcon icon={faCertificate} size="lg" style={{ color: '#6366f1' }} />
              </div>
              <div>
                <h3 className="feature-title2">
                  Get certified with 100+ certification courses
                </h3>
              </div>
            </div>

            {/* Feature 2: Skills Building */}
            <div className="card_feature2">
              <div className="feature-icon2">
                <FontAwesomeIcon icon={faChartBar} size="lg" style={{ color: '#f59e0b' }} />
              </div>
              <div>
                <h3 className="feature-title2">
                  Build skills your way, from labs to courses
                </h3>
              </div>
            </div>

            {/* Feature 3: Instructors */}
            <div className="card_feature2">
              <div className="feature-icon2">
                <FontAwesomeIcon icon={faChalkboardTeacher} size="lg" style={{ color: '#06b6d4' }} />
              </div>
              <div>
                <h3 className="feature-title2">
                  Stay motivated with engaging instructors
                </h3>
              </div>
            </div>

            {/* Feature 4: Cloud Technology */}
            <div className="card_feature2">
              <div className="feature-icon2">
                <FontAwesomeIcon icon={faCloud} size="lg" style={{ color: '#10b981' }} />
              </div>
              <div>
                <h3 className="feature-title2">
                  Keep up with the latest in cloud technology
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="divider"></div>
    </section>
  );
}

export default SkillsSection;