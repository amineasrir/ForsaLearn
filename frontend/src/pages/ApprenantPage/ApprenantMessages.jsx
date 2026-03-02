import React from 'react';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';
import { FaEnvelope } from 'react-icons/fa';

const sampleConversations = [
  { id:1, name: 'Course Support', lastMessage: 'Your certificate has been generated.', time:'10:24 AM' },
  { id:2, name: 'Instructor Jane', lastMessage: 'Please review the requirements.', time:'Yesterday' },
  { id:3, name: 'Admin Team', lastMessage: 'Welcome to our platform!', time:'2 days ago' },
];

const ApprenantMessages = () => {
  return (
    <div className="apprenant-dashboard">
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <div className="logo" />
          </div>
          <div className="header-right">
            <button className="lang-btn">ENG</button>
            <div className="notification-icon"></div>
            <div className="cart-icon"></div>
          </div>
        </div>
        <div className="header-center">
          <h1>Messages</h1>
        </div>
      </header>
      <CardP />
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="messages-list">
            {sampleConversations.map(conv=> (
              <div key={conv.id} className="message-item">
                <div className="message-icon"><FaEnvelope /></div>
                <div className="message-info">
                  <h4>{conv.name}</h4>
                  <p>{conv.lastMessage}</p>
                </div>
                <div className="message-time">{conv.time}</div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantMessages;
