import React from "react";
import logo from "../../assets/image/home_page/logo_footer.png";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  const { t } = require('react-i18next').useTranslation ? require('react-i18next').useTranslation() : { t: (k) => k };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col logo-col">
          <img src={logo} alt="ForsaLearn" className="footer-logo" />
        </div>

        <div className="footer-col">
          <h4>{t('homePage.footer.for_instructor')}</h4>
          <ul>
            <li>{t('homePage.footer.profile')}</li>
            <li>{t('homePage.footer.login')}</li>
            <li>{t('homePage.footer.register')}</li>
            <li>{t('homePage.footer.instructor')}</li>
            <li>{t('homePage.footer.dashboard')}</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>{t('homePage.footer.for_student')}</h4>
          <ul>
            <li>{t('homePage.footer.profile')}</li>
            <li>{t('homePage.footer.login')}</li>
            <li>{t('homePage.footer.register')}</li>
            <li>{t('homePage.footer.instructor')}</li>
            <li>{t('homePage.footer.dashboard')}</li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h4>{t('homePage.footer.get_in_touch')}</h4>
          <p>{t('homePage.footer.phone_number')}<br /><span>+212601234566</span></p>
          <p>{t('homePage.footer.mail_address')}<br /><span>forsa.learn@gmail.com</span></p>
          <p>{t('homePage.footer.address')}<br /><span>Atlas MARRAKECH, MAROC</span></p>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {year} <span>ForsaLearn</span>. {t('homePage.footer.rights')}</small>

        <div className="footer-links">
          <a href="#">{t('homePage.footer.terms')}</a>
          <a href="#">{t('homePage.footer.privacy')}</a>
        </div>

        <div className="footer-social">
          <a href="#" aria-label="facebook"><FaFacebookF /></a>
          <a href="#" aria-label="instagram"><FaInstagram /></a>
          <a href="#" aria-label="linkedin"><FaLinkedinIn /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
