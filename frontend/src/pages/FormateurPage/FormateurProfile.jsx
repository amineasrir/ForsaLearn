import React, { useState, useEffect } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import i18nInstance from '../../i18n';
import { useTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';
import { FaEdit } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';

const FormateurProfile = () => {
  const { i18n } = useTranslation();
  const [activeMenu, setActiveMenu] = useState('profile');
  const navigate = useNavigate();
  const location = useLocation();

  const changeLanguage = () => {
    const lang = (i18n && i18n.language === "en") ? "fr" : "en";
    const instance = (i18n && typeof i18n.changeLanguage === "function") ? i18n : i18nInstance;
    if (instance && typeof instance.changeLanguage === "function") {
      instance.changeLanguage(lang);
    }
  };

  const getFlagClass = (lang) => {
    switch (lang) {
      case "en":
        return "fi fi-gb";
      case "fr":
        return "fi fi-fr";
      default:
        return "fi fi-gl";
    }
  };

  const currentLang = (i18n && i18n.language) ? i18n.language : "en";

  // sync menu state based on path
  useEffect(() => {
    if (location.pathname.includes('/profile')) {
      setActiveMenu('profile');
    } else if (location.pathname.includes('/dashboard')) {
      setActiveMenu('dashboard');
    } else if (location.pathname.includes('/courses')) {
      setActiveMenu('mycourses');
    } else if (location.pathname.includes('/students')) {
      setActiveMenu('students');
    }
  }, [location.pathname]);

  // profile information stored in state so we can edit
  const [formateur, setFormateur] = useState({
    name: 'Khadija Essir',
    avatar: 'https://via.placeholder.com/60',
    phone: '+123 456 789',
    email: 'khadija@example.com',
    bio: 'Web developer with a vast array of knowledge in many different front-end and back-end languages.',
    education: [
      { title: 'BCA - Bachelor of Computer Applications', period: '2015 - 2018' },
      { title: 'MCA - Master of Computer Application', period: '2018 - 2020' },
    ],
    experience: [
      { title: 'Web Design & Development Team Leader', company: 'Comany XYZ', period: '2019 - 2021' },
      { title: 'Project Manager', company: 'Industry Tech', period: '2021 - Present' },
    ],
  });

  // editing state flags
  const [editing, setEditing] = useState({
    basic: false,
    education: false,
    experience: false,
  });

  // temporary fields used when editing
  const [tempBasic, setTempBasic] = useState({
    name: formateur.name,
    phone: formateur.phone,
    email: formateur.email,
    bio: formateur.bio,
  });
  const [tempEducation, setTempEducation] = useState(formateur.education);
  const [tempExperience, setTempExperience] = useState(formateur.experience);


  return (
    <div className="formateur-page">
      {/* Navbar */}
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          
          <div className="navbar-dashboard-center">
            <h1>Profile</h1>
            <a href="/">Home</a>
            <span style={{color:"#6b7280"}}>/Profile</span>
          </div>
          
          <div className="navbar-dashboard-right">
            <button className="lang-btn-dashboard" onClick={changeLanguage}>
              <span className={getFlagClass(currentLang)} style={{ fontSize: '20px' }}></span>
              <span>{currentLang.toUpperCase()}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="formateur-container">
        {/* Sidebar */}
        <SidebarF />

        {/* Main Content */}
        <main className="formateur-main">
          {/* Profile header section (reused from dashboard) */}
          <ProfilSection formateur={formateur}/>

          {/* Basic information */}
          <div className="profile-details">
            <h2>
              Basic Information
              <FaEdit className="section-edit-icon" onClick={() => setEditing(prev => ({...prev, basic: true}))} />
            </h2>
            {editing.basic ? (
              <div className="edit-form">
                <label>
                  Name: <input type="text" value={tempBasic.name} onChange={e => setTempBasic({...tempBasic, name: e.target.value})} />
                </label>
                <label>
                  Phone: <input type="text" value={tempBasic.phone} onChange={e => setTempBasic({...tempBasic, phone: e.target.value})} />
                </label>
                <label>
                  Email: <input type="email" value={tempBasic.email} onChange={e => setTempBasic({...tempBasic, email: e.target.value})} />
                </label>
                <label>
                  Bio: <textarea value={tempBasic.bio} onChange={e => setTempBasic({...tempBasic, bio: e.target.value})} />
                </label>
                <div className="form-actions">
                  <button onClick={() => {
                    setFormateur(f => ({...f, ...tempBasic}));
                    setEditing(prev => ({...prev, basic: false}));
                  }}>Save</button>
                  <button onClick={() => {
                    setTempBasic({
                      name: formateur.name,
                      phone: formateur.phone,
                      email: formateur.email,
                      bio: formateur.bio,
                    });
                    setEditing(prev => ({...prev, basic: false}));
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <p><strong>Full Name:</strong> {formateur.name}</p>
                <p><strong>Phone Number:</strong> {formateur.phone}</p>
                <p><strong>Email:</strong> {formateur.email}</p>
                <p><strong>Bio:</strong> {formateur.bio}</p>
              </>
            )}
          </div>

          {/* Education */}
          <div className="profile-details">
            <h2>
              Education
              <FaEdit className="section-edit-icon" onClick={() => setEditing(prev => ({...prev, education: true}))} />
            </h2>
            {editing.education ? (
              <div className="edit-form">
                {tempEducation.map((edu, idx) => (
                  <div key={idx} className="list-item-edit">
                    <input
                      type="text"
                      value={edu.title}
                      onChange={e => {
                        const newEdu = [...tempEducation];
                        newEdu[idx].title = e.target.value;
                        setTempEducation(newEdu);
                      }}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={edu.period}
                      onChange={e => {
                        const newEdu = [...tempEducation];
                        newEdu[idx].period = e.target.value;
                        setTempEducation(newEdu);
                      }}
                      placeholder="Period"
                    />
                  </div>
                ))}
                <div className="form-actions">
                  <button onClick={() => {
                    setFormateur(f => ({...f, education: tempEducation}));
                    setEditing(prev => ({...prev, education: false}));
                  }}>Save</button>
                  <button onClick={() => {
                    setTempEducation(formateur.education);
                    setEditing(prev => ({...prev, education: false}));
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              formateur.education.map((edu, idx) => (
                <p key={idx}>&#8226; {edu.title} ({edu.period})</p>
              ))
            )}
          </div>

          {/* Experience */}
          <div className="profile-details">
            <h2>
              Experience
              <FaEdit className="section-edit-icon" onClick={() => setEditing(prev => ({...prev, experience: true}))} />
            </h2>
            {editing.experience ? (
              <div className="edit-form">
                {tempExperience.map((exp, idx) => (
                  <div key={idx} className="list-item-edit">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={e => {
                        const newExp = [...tempExperience];
                        newExp[idx].title = e.target.value;
                        setTempExperience(newExp);
                      }}
                      placeholder="Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={e => {
                        const newExp = [...tempExperience];
                        newExp[idx].company = e.target.value;
                        setTempExperience(newExp);
                      }}
                      placeholder="Company"
                    />
                    <input
                      type="text"
                      value={exp.period}
                      onChange={e => {
                        const newExp = [...tempExperience];
                        newExp[idx].period = e.target.value;
                        setTempExperience(newExp);
                      }}
                      placeholder="Period"
                    />
                  </div>
                ))}
                <div className="form-actions">
                  <button onClick={() => {
                    setFormateur(f => ({...f, experience: tempExperience}));
                    setEditing(prev => ({...prev, experience: false}));
                  }}>Save</button>
                  <button onClick={() => {
                    setTempExperience(formateur.experience);
                    setEditing(prev => ({...prev, experience: false}));
                  }}>Cancel</button>
                </div>
              </div>
            ) : (
              formateur.experience.map((exp, idx) => (
                <p key={idx}>&#8226; {exp.title} - {exp.company} ({exp.period})</p>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurProfile;
