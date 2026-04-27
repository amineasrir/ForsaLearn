import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/formateur.css';

const ProfilSection = ({
  formateur = { avatar: 'https://via.placeholder.com/60', name: 'Instructor Name' },
  actionLabel = 'Add New Course',
  onAction
}) => {
  const navigate = useNavigate();

  const handleAction = () => {
    if (onAction) {
      onAction();
      return;
    }

    navigate('/formateur/courses');
  };

  return (
    <div>
      <div className="profile-section" style={{marginTop:"20px"}}>
            <div className="profile-content">
              <img src={formateur.avatar} alt="Profile" className="profile-avatar" />
              <div className="profile-info">
                <h1>{formateur.name}</h1>
                <span className="instructor-badge">Instructor</span>
              </div>
            </div>
            <div className="profile-actions">
              <button className="add-course-btn" onClick={handleAction}>{actionLabel}</button>
            </div>
          </div>
    </div>
  )
}

export default ProfilSection
