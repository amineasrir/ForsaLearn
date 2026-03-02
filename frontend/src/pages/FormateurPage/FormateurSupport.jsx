import React, { useState, useEffect, useRef } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import axios from 'axios';

const FormateurSupport = () => {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const messagesEndRef = useRef(null);

  const API_URL = 'http://localhost:5000/api/messages';

  // Auto scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch admin user ID on component mount
  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const response = await axios.get(`${API_URL}/admins`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data?.data && response.data.data.length > 0) {
          // Use the first admin
          const firstAdmin = response.data.data[0];
          window.adminId = firstAdmin._id;
          console.log('Admin ID fetched successfully:', firstAdmin._id);
        }
      } catch (error) {
        console.error('Error fetching admin ID:', error);
        alert('Warning: Could not connect to admin system. Support may have limited functionality.');
      }
    };

    fetchAdminId();
  }, []);

  // Fetch all support conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/conversations`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });

        // Filter only support conversations
        const supportConversations = response.data.data.filter(
          conv => conv.type === 'support'
        );
        setConversations(supportConversations);

        if (supportConversations.length > 0 && !activeConversationId) {
          setActiveConversationId(supportConversations[0]._id);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConversationId) return;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/conversations/${activeConversationId}/messages`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        setMessages(response.data.data || []);

        // Mark all messages as read
        await axios.patch(
          `${API_URL}/conversations/${activeConversationId}/read-all`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  // Send a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId) return;

    try {
      setSendingMessage(true);
      const response = await axios.post(
        `${API_URL}/conversations/${activeConversationId}/messages`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setMessages([...messages, response.data.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Create a new support ticket
  const handleCreateTicket = async () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      alert('Please fill in both subject and description');
      return;
    }

    if (!window.adminId) {
      alert('Unable to connect to admin. Please try again later.');
      return;
    }

    try {
      setSendingMessage(true);
      const response = await axios.post(
        `${API_URL}/conversations`,
        {
          type: 'support',
          participantIds: [window.adminId],
          name: ticketSubject
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const newConversation = response.data.data;
      setConversations([...conversations, newConversation]);
      setActiveConversationId(newConversation._id);

      // Send the description as first message
      await axios.post(
        `${API_URL}/conversations/${newConversation._id}/messages`,
        { content: ticketDescription },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      setTicketSubject('');
      setTicketDescription('');
      setShowNewTicketForm(false);
    } catch (error) {
      console.error('Error creating support ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle key press in message input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const activeConv = conversations.find(c => c._id === activeConversationId);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

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
          <div className="navbar-dashboard-center">
            <h1>Support</h1>
            <a href="/">Home</a>
            <span style={{ color: '#6b7280' }}>/ Support</span>
          </div>
          <div className="navbar-dashboard-right" />
        </div>
      </nav>

      <div className="dashboard-container">
        <SidebarF />

        <div className="main-content">
          <ProfilSection />

          <div className="support-container">
            <div className="support-wrapper">
              {/* Conversations List */}
              <div className="support-conversations-list">
                <div className="conversations-header">
                  <h2>Support Tickets</h2>
                  <button
                    className="btn-new-ticket"
                    onClick={() => setShowNewTicketForm(!showNewTicketForm)}
                  >
                    + New Ticket
                  </button>
                </div>

                {showNewTicketForm && (
                  <div className="new-ticket-form">
                    <h3>Create Support Ticket</h3>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={ticketSubject}
                      onChange={(e) => setTicketSubject(e.target.value)}
                      className="ticket-input"
                    />
                    <textarea
                      placeholder="Describe your issue..."
                      value={ticketDescription}
                      onChange={(e) => setTicketDescription(e.target.value)}
                      className="ticket-textarea"
                      rows="4"
                    />
                    <div className="form-buttons">
                      <button
                        onClick={handleCreateTicket}
                        disabled={sendingMessage}
                        className="btn-submit"
                      >
                        {sendingMessage ? 'Creating...' : 'Create Ticket'}
                      </button>
                      <button
                        onClick={() => {
                          setShowNewTicketForm(false);
                          setTicketSubject('');
                          setTicketDescription('');
                        }}
                        className="btn-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                <div className="conversations-scroll">
                  {conversations.length === 0 ? (
                    <p className="no-conversations">No support tickets yet</p>
                  ) : (
                    conversations.map(conv => (
                      <div
                        key={conv._id}
                        className={`conversation-item ${
                          activeConversationId === conv._id ? 'active' : ''
                        }`}
                        onClick={() => setActiveConversationId(conv._id)}
                      >
                        <div className="conversation-info">
                          <h4>{conv.name || 'Support Ticket'}</h4>
                          <p className="conversation-date">
                            {new Date(conv.lastMessageAt).toLocaleDateString()}
                          </p>
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="unread-badge">{conv.unreadCount}</span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Messages Area */}
              <div className="support-messages-area">
                {activeConv ? (
                  <>
                    <div className="messages-header">
                      <h3>{activeConv.name || 'Support Conversation'}</h3>
                      <p className="participants-info">
                        Communicating with Admin
                      </p>
                    </div>

                    <div className="messages-container">
                      {messages.length === 0 ? (
                        <p className="no-messages">
                          No messages yet. Start the conversation!
                        </p>
                      ) : (
                        messages.map((msg, index) => {
                          const isOwnMessage = msg.sender._id === currentUser._id;
                          return (
                            <div
                              key={msg._id || index}
                              className={`message ${isOwnMessage ? 'sent' : 'received'}`}
                            >
                              <div className="message-content">
                                <p>{msg.content}</p>
                                <span className="message-time">
                                  {new Date(msg.createdAt).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
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
                        onKeyPress={handleKeyPress}
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
                    <p>Select a support ticket or create a new one to get started</p>
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
