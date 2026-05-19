import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import { FaHeadset, FaPaperPlane, FaPlus, FaSearch } from 'react-icons/fa';
import {
  createFormateurSupportTicket,
  getFormateurConversationMessages,
  getFormateurConversations,
  getFormateurProfile,
  markFormateurConversationAsRead,
  sendFormateurConversationMessage,
  updateFormateurSupportTicketStatus
} from '../../services/formateurService';

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

const getTicketLabel = (conversation) => {
  return conversation?.supportTicket?.subject || conversation?.name || 'Support Ticket';
};

const getTicketPreview = (conversation) => {
  const content = conversation.lastMessage?.content;
  if (!content) return 'No messages yet';
  return content.length > 45 ? `${content.slice(0, 45)}...` : content;
};

const getStatusClass = (status = 'open') => status.toLowerCase().replace(/\s+/g, '-');

const FormateurSupport = () => {
  const [profile, setProfile] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [error, setError] = useState('');
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: ''
  });
  const messagesEndRef = useRef(null);

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
        setActiveConversationId((currentId) => currentId || supportConversations[0]?._id || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const fetchMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getFormateurConversationMessages(activeConversationId);
        setMessages(response.data?.data || []);
        await markFormateurConversationAsRead(activeConversationId);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === activeConversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load support messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [activeConversationId]);

  const activeConv = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) return conversations;

    return conversations.filter((conversation) =>
      getTicketLabel(conversation).toLowerCase().includes(normalizedSearch) ||
      (conversation.supportTicket?.ticketId || '').toLowerCase().includes(normalizedSearch) ||
      getTicketPreview(conversation).toLowerCase().includes(normalizedSearch)
    );
  }, [conversations, searchTerm]);

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim() || creatingTicket) {
      return;
    }

    try {
      setCreatingTicket(true);
      setError('');

      const response = await createFormateurSupportTicket(ticketForm);
      const createdConversation = response.data?.data;

      if (createdConversation) {
        setConversations((prev) => [createdConversation, ...prev]);
        setActiveConversationId(createdConversation._id);
        setTicketForm({
          subject: '',
          category: 'technical',
          priority: 'medium',
          message: ''
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create support ticket.');
    } finally {
      setCreatingTicket(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeConversationId || sendingMessage || activeConv?.supportTicket?.status === 'closed') return;

    try {
      setSendingMessage(true);
      const response = await sendFormateurConversationMessage(activeConversationId, { content: newMessage.trim() });
      const createdMessage = response.data?.data;
      setMessages((prev) => [...prev, createdMessage]);
      setConversations((prev) => prev.map((conversation) => (
        conversation._id === activeConversationId
          ? {
              ...conversation,
              lastMessage: createdMessage,
              lastMessageAt: createdMessage.createdAt
            }
          : conversation
      )));
      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeConv) return;

    try {
      const response = await updateFormateurSupportTicketStatus(activeConv._id, 'closed');
      const updatedConversation = response.data?.data;
      setConversations((prev) => prev.map((conversation) => (
        conversation._id === activeConv._id
          ? updatedConversation
          : conversation
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close the support ticket.');
    }
  };

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
                <div className="chat-search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <form className="new-ticket-form" onSubmit={handleCreateTicket}>
                  <h3><FaPlus /> Create New Ticket</h3>
                  <input
                    type="text"
                    className="ticket-input"
                    placeholder="Subject"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                  />

                  <div className="ticket-select-row">
                    <select
                      className="ticket-input ticket-select"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, category: e.target.value }))}
                    >
                      <option value="technical">Technical</option>
                      <option value="billing">Billing</option>
                      <option value="certificate">Certificate</option>
                      <option value="other">Other</option>
                    </select>

                    <select
                      className="ticket-input ticket-select"
                      value={ticketForm.priority}
                      onChange={(e) => setTicketForm((prev) => ({ ...prev, priority: e.target.value }))}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <textarea
                    className="ticket-textarea"
                    rows={4}
                    placeholder="Describe your issue"
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, message: e.target.value }))}
                  />

                  <div className="form-buttons">
                    <button type="submit" className="btn-submit" disabled={creatingTicket}>
                      {creatingTicket ? 'Submitting...' : 'Submit Ticket'}
                    </button>
                  </div>
                </form>

                <div className="conversations-scroll">
                  {filteredConversations.length === 0 ? (
                    <p className="no-conversations">No support tickets yet</p>
                  ) : (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation._id}
                        className={`conversation-item ${activeConversationId === conversation._id ? 'active' : ''}`}
                        onClick={() => setActiveConversationId(conversation._id)}
                      >
                        <div className="conversation-info">
                          <h4>{getTicketLabel(conversation)}</h4>
                          <div className="ticket-mini-meta">
                            <span className="ticket-mini-id">{conversation.supportTicket?.ticketId || 'SUPPORT'}</span>
                            <span className={`ticket-mini-status ${getStatusClass(conversation.supportTicket?.status)}`}>
                              {conversation.supportTicket?.status || 'open'}
                            </span>
                          </div>
                          <p className="conversation-date">
                            {conversation.lastMessageAt ? formatDate(conversation.lastMessageAt) : 'No activity'}
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
                    <div className="messages-header support-chat-header">
                      <div>
                        <h3>{getTicketLabel(activeConv)}</h3>
                        <div className="support-ticket-head-meta">
                          <span>{activeConv.supportTicket?.ticketId}</span>
                          <span className={`ticket-mini-status ${getStatusClass(activeConv.supportTicket?.status)}`}>
                            {activeConv.supportTicket?.status || 'open'}
                          </span>
                          <span className={`priority-badge priority-${activeConv.supportTicket?.priority || 'medium'}`}>
                            {activeConv.supportTicket?.priority || 'medium'}
                          </span>
                        </div>
                      </div>

                      {activeConv.supportTicket?.status !== 'closed' && (
                        <button type="button" className="btn-secondary-inline" onClick={handleCloseTicket}>
                          Close Ticket
                        </button>
                      )}
                    </div>

                    <div className="messages-container">
                      {loadingMessages ? (
                        <p className="no-messages">Loading messages...</p>
                      ) : messages.length === 0 ? (
                        <p className="no-messages">No messages yet. Start the conversation!</p>
                      ) : (
                        messages.map((message, index) => {
                          const isOwnMessage = message.sender?._id === profile?._id;
                          return (
                            <div key={message._id || index} className={`message ${isOwnMessage ? 'sent' : 'received'}`}>
                              <div className="message-content">
                                <p>{message.content}</p>
                                <span className="message-time">{formatTime(message.createdAt)}</span>
                              </div>
                            </div>
                          );
                        })
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    <div className="message-input-area ticket-chat-input">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        placeholder={activeConv.supportTicket?.status === 'closed' ? 'This ticket is closed.' : 'Type your message here...'}
                        className="message-input"
                        rows="3"
                        disabled={activeConv.supportTicket?.status === 'closed'}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage || activeConv.supportTicket?.status === 'closed'}
                        className="btn-send-message"
                      >
                        {sendingMessage ? 'Sending...' : <><FaPaperPlane /> Send</>}
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="no-conversation-selected">
                    <FaHeadset />
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
