import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faChalkboardTeacher, faCertificate, faCompass } from "@fortawesome/free-solid-svg-icons";

import image3 from '../../assets/image/home_page/image3.png';

import { useTranslation } from 'react-i18next';

const Mentor = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleReadMore = () => {
    navigate("/courses");
  };

  return (
    <section className="mentor-section">
      <div className="mentor-hero">
        <div className="container mentor-hero-inner">
          <h2 className="mentor-title">{t('homePage.mentor.title')}</h2>
          <p className="mentor-sub">{t('homePage.mentor.sub')}</p>

          <div className="mentor-features">
            <div className="mentor-feature">
              <div className="mf-icon"><FontAwesomeIcon icon={faChalkboardTeacher} /></div>
              <h4>{t('homePage.mentor.feature1_title')}</h4>
              <p>{t('homePage.mentor.feature1_text')}</p>
            </div>

            <div className="mentor-feature " >
              <div className="mf-icon" ><FontAwesomeIcon icon={faCertificate}  style={{color:"FF4667"}}/></div>
              <h4>{t('homePage.mentor.feature2_title')}</h4>
              <p>{t('homePage.mentor.feature2_text')}</p>
            </div>

            <div className="mentor-feature">
              <div className="mf-icon"><FontAwesomeIcon icon={faCompass}  /></div>
              <h4>{t('homePage.mentor.feature3_title')}</h4>
              <p>{t('homePage.mentor.feature3_text')}</p>
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
            <h3>{t('homePage.mentor.join_title')}</h3>
            <p className="mentor-lead">{t('homePage.mentor.join_lead')}</p>

            <ul className="mentor-checks">
              {t('homePage.mentor.checks', { returnObjects: true }).map((c, i) => (
                <li key={i}><FontAwesomeIcon icon={faCheckCircle} className="check-icon" /> {c}</li>
              ))}
            </ul>

            <button className="btn-primary" onClick={handleReadMore}>{t('homePage.mentor.read_more')}</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Mentor;
