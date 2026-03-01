import React, { useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';

const FormateurMessage = () => {
  // sample conversations
  const initialConversations = [
    { id: 1, student: 'Amina Zahra', messages: [
        { from: 'student', text: 'Bonjour, j’ai une question sur le cours UI/UX.' },
        { from: 'formateur', text: 'Oui Amina, comment puis-je vous aider ?' },
      ]
    },
    { id: 2, student: 'Youssef Karim', messages: [
        { from: 'student', text: 'Le paiement n’est pas passé.' },
      ]
    }
  ];

  const [conversations, setConversations] = useState(initialConversations);
  const [activeConvId, setActiveConvId] = useState(conversations[0].id);
  const [newMessage, setNewMessage] = useState('');

  const activeConv = conversations.find(c => c.id === activeConvId);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setConversations(prev => prev.map(c => {
      if (c.id === activeConvId) {
        return {...c, messages: [...c.messages, { from: 'formateur', text: newMessage }]};
      }
      return c;
    }));
    setNewMessage('');
  };

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>
          <div className="navbar-dashboard-center">
            <h1>Messages</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Messages</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="formateur-container message-page">
        <SidebarF />
        <main className="formateur-main message-main">
          <ProfilSection formateur={{ name: 'Elnhouat chaima', avatar: 'https://via.placeholder.com/80' }} />

          <div className="message-wrapper">
            {/* conversation list */}
            <div className="conv-list">
              {conversations.map(conv => (
                <div
                  key={conv.id}
                  className={`conv-item ${conv.id === activeConvId ? 'active' : ''}`}
                  onClick={() => setActiveConvId(conv.id)}
                >
                  <span className="conv-student-name">{conv.student}</span>
                </div>
              ))}
            </div>

            {/* chat window */}
            <div className="chat-window">
              <div className="chat-body">
                {activeConv.messages.map((m, idx) => (
                  <div key={idx} className={`chat-message ${m.from === 'formateur' ? 'sent' : 'received'}`}>
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

export default FormateurMessage;
