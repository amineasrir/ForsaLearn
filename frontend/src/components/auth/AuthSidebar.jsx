import React from 'react';

const AuthSidebar = ({ image }) => {
  return (
    <div className="auth-left">
      
      <img src={image} alt="Authentication illustration" className="auth-image" />
      <div className="auth-welcome">
        <h1>Welcome to</h1>
        <h1>Forsa<span>Learn</span> Courses.</h1>
        <p>Platform designed to help organizations, educators, and learners manage, deliver, and track learning and training activities.</p>
      </div>
    </div>
  );
};

export default AuthSidebar;
