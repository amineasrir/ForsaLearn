import React, { useEffect, useRef, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import {
  getFormateurConversationMessages,
  getFormateurConversations,
  getFormateurProfile,
  markFormateurConversationAsRead,
  sendFormateurConversationMessage
} from '../../services/formateurService';

const FormateurSupport = () => {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);
  const initializedConversationRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const [profileResponse, conversationsResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurConversations({ type: 'support' })
        ]);

        const supportConversations = conversationsResponse.data?.data || [];
        setProfile(profileResponse.data?.data || null);
        setConversations(supportConversations);

        if (supportConversations.length > 0 && !initializedConversationRef.current) {
          setActiveConversationId(supportConversations[0]._id);
          initializedConversationRef.current = true;
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await getFormateurConversationMessages(activeConversationId);
        setMessages(response.data?.data || []);
        await markFormateurConversationAsRead(activeConversationId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load support messages.');
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return;

    try {
      setSendingMessage(true);
      const response = await sendFormateurConversationMessage(activeConversationId, { content: newMessage.trim() });
      setMessages((prev) => [...prev, response.data?.data]);
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const activeConv = conversations.find((conversation) => conversation._id === activeConversationId);

  if (loading) {
    return (
      <div className="formateur-page">
        <div className="loading-container">
          <p>Loading support tickets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="formateur-page">
      <nav className="navbar-dashboard">
        <div className="navbar-dashboard-content">
          <div className="navbar-dashboard-left">
            <img src={logo_rem} alt="ForsaLearn" className="navbar-dashboard-logo" />
          </div>

          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="support-container">
            <div className="support-wrapper">
              <div className="support-conversations-list">
                <div className="conversations-header">
                  <h2>Support Tickets</h2>
                </div>

                <div className="new-ticket-form">
                  <h3>Support Access</h3>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                    Existing support tickets are connected to the backend. Creating a new support ticket still needs a dedicated backend endpoint to select the admin recipient.
                  </p>
                </div>

                <div className="conversations-scroll">
                  {conversations.length === 0 ? (
                    <p className="no-conversations">No support tickets yet</p>
                  ) : (
                    conversations.map((conversation) => (
                      <div
                        key={conversation._id}
                        className={`conversation-item ${activeConversationId === conversation._id ? 'active' : ''}`}
                        onClick={() => setActiveConversationId(conversation._id)}
                      >
                        <div className="conversation-info">
                          <h4>{conversation.name || 'Support Ticket'}</h4>
                          <p className="conversation-date">
                            {conversation.lastMessageAt ? new Date(conversation.lastMessageAt).toLocaleDateString() : 'No activity'}
                          </p>
                        </div>
                        {conversation.unreadCount > 0 && (
                          <span className="unread-badge">{conversation.unreadCount}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="support-messages-area">
                {activeConv ? (
                  <>
                    <div className="messages-header">
                      <h3>{activeConv.name || 'Support Conversation'}</h3>
                      <p className="participants-info">Communicating with Admin</p>
                    </div>

                    <div className="messages-container">
                      {messages.length === 0 ? (
                        <p className="no-messages">No messages yet. Start the conversation!</p>
                      ) : (
                        messages.map((message, index) => {
                          const isOwnMessage = message.sender?._id === profile?._id;
                          return (
                            <div key={message._id || index} className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
                              <div className="message-content">
                                <p>{message.content}</p>
                                <span className="message-time">
                                  {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  }) : ''}
                                </span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="message-input-area">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder="Type your message here... (Shift+Enter for new line)"
                        className="message-input"
                        rows="3"
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className="btn-send-message"
                      >
                        {sendingMessage ? 'Sending...' : 'Send'}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-conversation-selected">
                    <p>Select a support ticket to continue.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormateurSupport;
