import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/conversations-admin.css';
import '../../styles/support-admin.css';
import {
  FaCheckCircle,
  FaClock,
  FaHeadset,
  FaPaperPlane,
  FaSearch,
  FaUser
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import {
  getAdminConversationMessages,
  getAdminConversations,
  getAdminProfile,
  markAdminConversationAsRead,
  sendAdminConversationMessage,
  updateAdminSupportTicketStatus
} from '../../services/adminService';

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

const getStatusClass = (status = 'open') => status.toLowerCase().replace(/\s+/g, '-');

const getTicketSubject = (conversation) => {
  return conversation?.supportTicket?.subject || conversation?.name || 'Support Ticket';
};

const getRequester = (conversation) => {
  return (conversation.participants || []).find((participant) => participant.role !== 'admin') || null;
};

const getPreview = (conversation) => {
  const content = conversation.lastMessage?.content;
  if (!content) return 'No messages yet';
  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
};

const SupportTickets = () => {
  const [admin, setAdmin] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError('');

        const [profileResponse, conversationsResponse] = await Promise.all([
          getAdminProfile(),
          getAdminConversations({ type: 'support' })
        ]);

        const loadedConversations = conversationsResponse.data?.data || [];
        setAdmin(profileResponse.data?.user || null);
        setConversations(loadedConversations);
        setActiveConversationId((currentId) => currentId || loadedConversations[0]?._id || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load support tickets.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    if (!activeConversationId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getAdminConversationMessages(activeConversationId);
        setMessages(response.data?.data || []);
        await markAdminConversationAsRead(activeConversationId);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === activeConversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )));
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load ticket messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const requester = getRequester(conversation);
      const status = conversation.supportTicket?.status || 'open';
      const matchesStatus = statusFilter === 'all' || status === statusFilter;

      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      return (
        getTicketSubject(conversation).toLowerCase().includes(normalizedSearch) ||
        (conversation.supportTicket?.ticketId || '').toLowerCase().includes(normalizedSearch) ||
        (requester?.fullName || '').toLowerCase().includes(normalizedSearch) ||
        getPreview(conversation).toLowerCase().includes(normalizedSearch)
      );
    });
  }, [conversations, searchTerm, statusFilter]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) || null,
    [activeConversationId, conversations]
  );

  const stats = useMemo(() => ({
    total: conversations.length,
    open: conversations.filter((item) => (item.supportTicket?.status || 'open') === 'open').length,
    pending: conversations.filter((item) => item.supportTicket?.status === 'pending').length,
    resolved: conversations.filter((item) => item.supportTicket?.status === 'resolved').length
  }), [conversations]);

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageInput.trim() || !activeConversationId || sending) {
      return;
    }

    try {
      setSending(true);
      const response = await sendAdminConversationMessage(activeConversationId, {
        content: messageInput.trim(),
        type: 'text'
      });

      const createdMessage = response.data?.data;
      if (createdMessage) {
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
      }

      setMessageInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (nextStatus) => {
    if (!activeConversation || updatingStatus) return;

    try {
      setUpdatingStatus(true);
      const response = await updateAdminSupportTicketStatus(activeConversation._id, nextStatus);
      const updatedConversation = response.data?.data;

      setConversations((prev) => prev.map((conversation) => (
        conversation._id === updatedConversation._id
          ? { ...conversation, ...updatedConversation }
          : conversation
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update ticket status.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  return (
    <div className="dashboard">
      <Header title="Support Tickets" />

      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main conversations-main">
            <ProfileCard
              name={admin?.fullName || 'Admin'}
              role={admin?.role || 'admin'}
              image={admin?.profilePicture}
            />

            {error && <div className="admin-chat-alert error">{error}</div>}

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple"><FaHeadset /></div>
                  <span className="stat-label">Total Tickets</span>
                </div>
                <p className="stat-value">{stats.total}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink"><FaClock /></div>
                  <span className="stat-label">Open</span>
                </div>
                <p className="stat-value">{stats.open}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan"><FaUser /></div>
                  <span className="stat-label">Pending</span>
                </div>
                <p className="stat-value">{stats.pending}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient"><FaCheckCircle /></div>
                  <span className="stat-label">Resolved</span>
                </div>
                <p className="stat-value">{stats.resolved}</p>
              </div>
            </div>

            <div className="chart-card messages-container support-admin-layout">
              <div className="conversations-sidebar support-ticket-sidebar">
                <div className="conversations-header support-sidebar-header">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search tickets..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="search-input-small"
                    />
                  </div>

                  <select
                    className="support-status-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="all">All statuses</option>
                    <option value="open">Open</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>

                <div className="conversations-list">
                  {loading ? (
                    <div className="empty-conversations">
                      <FaHeadset className="empty-icon" />
                      <p>Loading support tickets...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="empty-conversations">
                      <FaHeadset className="empty-icon" />
                      <p>No support tickets found</p>
                    </div>
                  ) : filteredConversations.map((conversation) => {
                    const requester = getRequester(conversation);
                    const isActive = activeConversationId === conversation._id;

                    return (
                      <div
                        key={conversation._id}
                        className={`conversation-item support-ticket-item ${isActive ? 'active' : ''}`}
                        onClick={() => setActiveConversationId(conversation._id)}
                      >
                        <div className="conversation-content">
                          <div className="conversation-top">
                            <h4 className="conversation-name">{getTicketSubject(conversation)}</h4>
                            <span className="conversation-time">{formatDate(conversation.lastMessageAt || conversation.createdAt)}</span>
                          </div>

                          <div className="support-ticket-meta">
                            <span className="support-ticket-id">{conversation.supportTicket?.ticketId || 'SUPPORT'}</span>
                            <span className={`support-ticket-status ${getStatusClass(conversation.supportTicket?.status)}`}>
                              {conversation.supportTicket?.status || 'open'}
                            </span>
                            <span className={`priority-badge priority-${conversation.supportTicket?.priority || 'medium'}`}>
                              {conversation.supportTicket?.priority || 'medium'}
                            </span>
                          </div>

                          <div className="support-ticket-requester">
                            {requester?.fullName || 'Learner'}
                          </div>

                          <p className="conversation-last-message">{getPreview(conversation)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="chat-area">
                {activeConversation ? (
                  <>
                    <div className="chat-header support-ticket-chat-header">
                      <div className="chat-header-info">
                        <div className="chat-avatar support-avatar-header">
                          <FaHeadset />
                        </div>

                        <div>
                          <h3 className="chat-name">{getTicketSubject(activeConversation)}</h3>
                          <div className="support-ticket-headline">
                            <span>{activeConversation.supportTicket?.ticketId}</span>
                            <span>Requester: {getRequester(activeConversation)?.fullName || 'Unknown user'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="support-ticket-controls">
                        <select
                          className="support-status-select"
                          value={activeConversation.supportTicket?.status || 'open'}
                          onChange={(event) => handleUpdateStatus(event.target.value)}
                          disabled={updatingStatus}
                        >
                          <option value="open">Open</option>
                          <option value="pending">Pending</option>
                          <option value="resolved">Resolved</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="messages-area">
                      {loadingMessages ? (
                        <div className="chat-placeholder-state">Loading messages...</div>
                      ) : messages.length === 0 ? (
                        <div className="chat-placeholder-state">No messages yet.</div>
                      ) : messages.map((message) => {
                        const isOwn = message.sender?._id === admin?._id;

                        return (
                          <div key={message._id} className={`message ${isOwn ? 'own' : ''}`}>
                            {!isOwn && (
                              <img
                                src={message.sender?.profilePicture || 'https://via.placeholder.com/32x32?text=U'}
                                alt={message.sender?.fullName || 'User'}
                                className="message-avatar"
                              />
                            )}
                            <div className="message-content">
                              {!isOwn && <span className="message-sender-name">{message.sender?.fullName || 'User'}</span>}
                              <p className="message-text">{message.content}</p>
                              <div className="message-meta">
                                <span className="message-time">{formatTime(message.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    <form className="message-input-area" onSubmit={handleSendMessage}>
                      <input
                        type="text"
                        placeholder={activeConversation.supportTicket?.status === 'closed' ? 'This ticket is closed.' : 'Reply to this ticket...'}
                        value={messageInput}
                        onChange={(event) => setMessageInput(event.target.value)}
                        className="message-input"
                        disabled={sending || activeConversation.supportTicket?.status === 'closed'}
                      />
                      <button
                        type="submit"
                        className="send-btn"
                        disabled={!messageInput.trim() || sending || activeConversation.supportTicket?.status === 'closed'}
                      >
                        <FaPaperPlane />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="no-conversation-selected">
                    <FaHeadset className="no-conv-icon" />
                    <h3>Select a support ticket</h3>
                    <p>Choose a ticket from the list to manage it.</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SupportTickets;
