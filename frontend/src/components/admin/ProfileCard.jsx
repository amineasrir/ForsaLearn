import React from 'react';

const ProfileCard = ({
  name = 'Administrator',
  role = 'Administrateur',
  image = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
}) => {
  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-avatar-wrapper">
          <img
            src={image}
            alt={name}
            className="profile-avatar"
          />
          <span className="profile-status"></span>
        </div>
        <div className="profile-info">
          <h2 className="profile-name">{name}</h2>
          <p className="profile-role">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
