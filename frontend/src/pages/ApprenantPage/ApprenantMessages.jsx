import React, { useState } from 'react';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import '../../styles/formateur.css';
import './dashboard.css';
import { Link } from 'react-router-dom';

const initialConversations = [
  { id: 1, participant: 'Course Support', messages: [
      { from: 'student', text: 'Hello, I need help with my course.' },
      { from: 'support', text: 'Sure, how can I assist you?' },
    ]
  },
  { id: 2, participant: 'Instructor Jane', messages: [
      { from: 'student', text: 'I have a question about the assignment.' },
    ]
  }
];

const ApprenantMessages = () => {
  const [conversations, setConversations] = useState(initialConversations);
  const [activeConvId, setActiveConvId] = useState(conversations[0]?.id);
  const [newMessage, setNewMessage] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return { ...c, messages: [...c.messages, { from: 'student', text: newMessage }] };
      }
      return c;
    }));
    setNewMessage('');
  };

  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard message-page">
      <DashboardNavbar
        title="Messages"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'Messages' }]}
        rightContent={rightContent}
      />
      <CardP />
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
          <div className="message-wrapper">
            {/* conversation list */}
            <div className="conv-list">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conv-item ${conv.id === activeConvId ? 'active' : ''}`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <span className="conv-student-name">{conv.participant}</span>
                </div>
              ))}
            </div>

            {/* chat window */}
            <div className="chat-window">
              <div className="chat-body">
                {activeConv?.messages.map((m, idx) => (
                  <div key={idx} className={`chat-message ${m.from === 'student' ? 'sent' : 'received'}`}>
                    <div className="chat-bubble">
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>
              <div className="chat-input">
                <input
                  type="text"
                  placeholder="Write a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyPress={e => { if (e.key === 'Enter') sendMessage(); }}
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantMessages;
