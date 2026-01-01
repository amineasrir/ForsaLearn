import React from "react";
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
            {t("homePage.skills.title")}
          </h1>

          <p className="skills-lead">
            {t("homePage.skills.lead")}
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
                  {t("homePage.skills.feature1")}
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
                  {t("homePage.skills.feature2")}
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
                  {t("homePage.skills.feature3")}
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
                  {t("homePage.skills.feature4")}
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