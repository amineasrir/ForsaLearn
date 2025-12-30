import React from "react";
import logo from "../../assets/image/home_page/logo_footer.png";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col logo-col">
          <img src={logo} alt="ForsaLearn" className="footer-logo" />
        </div>

        <div className="footer-col">
          <h4>For Instructor</h4>
          <ul>
            <li>Profile</li>
            <li>Login</li>
            <li>Register</li>
            <li>Instructor</li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>For Student</h4>
          <ul>
            <li>Profile</li>
            <li>Login</li>
            <li>Register</li>
            <li>Student</li>
            <li>Dashboard</li>
          </ul>
        </div>

        <div className="footer-col footer-contact">
          <h4>Get in touch</h4>
          <p>Phone Number<br /><span>+212601234566</span></p>
          <p>Mail Address<br /><span>forsa.learn@gmail.com</span></p>
          <p>Address<br /><span>Atlas MARRAKECH, MAROC</span></p>
        </div>
      </div>

      <div className="footer-bottom">
        <small>© {year} <span>ForsaLearn</span>. All rights reserved.</small>

        <div className="footer-links">
          <a href="#">Terms &amp; Policy</a>
          <a href="#">Privacy Policy</a>
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
