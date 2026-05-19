import React from 'react';
import { getUserAvatar } from '../../utils/userAvatar';

const ProfileCard = ({
  name = 'Administrator',
  role = 'Administrateur',
  image
}) => {
  return (
    <div className="profile-card">
      <div className="profile-content">
        <div className="profile-avatar-wrapper">
          <img
            src={getUserAvatar(image)}
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
