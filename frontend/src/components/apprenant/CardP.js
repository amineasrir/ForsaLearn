import React from 'react';
import ava from '../../assets/image/student/ava.jpg';
import "../../pages/ApprenantPage/dashboard.css";

const CardP = ({ user }) => {
  const name = user?.fullName || 'Student';
  const avatar = user?.profilePicture || ava;
  const roleLabel = user?.role === 'visiteur' ? 'Student' : (user?.role || 'Student');

  return (
    <div>
      <div className="apprenant-profil-section" style={{marginTop:"20px"}}>
        <div className="apprenant-profil-content">
          <img src={avatar} alt={name} className="apprenant-profil-avatar" />
          <div className="apprenant-profil-info">
            <h1>{name}</h1>
            <span className="apprenant-student-badge">{roleLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardP;
