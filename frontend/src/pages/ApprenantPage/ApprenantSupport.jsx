import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaHeadset, FaPaperPlane, FaPlus, FaSearch, FaBell } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import '../../styles/formateur.css';
import './apprenant.css';
import {
  createSupportTicket,
  getApprenantProfile,
  getConversationMessages,
  getConversations,
  markConversationAsRead,
  sendConversationMessage,
  updateSupportTicketStatus
} from '../../services/apprenentService';

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

const ApprenantSupport = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
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
    const loadSupportConversations = async () => {
      try {
        setLoadingConversations(true);
        setError('');

        const [profileResponse, conversationsResponse] = await Promise.all([
          getApprenantProfile(),
          getConversations({ type: 'support' })
        ]);

        setUser(profileResponse.data?.user || null);
        const supportConversations = conversationsResponse.data?.data || [];
        setConversations(supportConversations);
        setActiveConvId((currentId) => currentId || supportConversations[0]?._id || null);
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      } finally {
        setLoadingConversations(false);
      }
    };

    loadSupportConversations();
  }, [t]);

  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getConversationMessages(activeConvId);
        setMessages(response.data?.data || []);
        await markConversationAsRead(activeConvId);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === activeConvId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )));
      } catch (err) {
        setError(err.response?.data?.message || t('errorOccurred'));
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConvId, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConvId) || null,
    [activeConvId, conversations]
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

  const totalUnread = useMemo(() => conversations.reduce(
    (count, conversation) => count + (conversation.unreadCount || 0),
    0
  ), [conversations]);

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    if (!ticketForm.subject.trim() || !ticketForm.message.trim() || creatingTicket) {
      return;
    }

    try {
      setCreatingTicket(true);
      setError('');

      const response = await createSupportTicket(ticketForm);
      const createdConversation = response.data?.data;

      if (createdConversation) {
        setConversations((prev) => [createdConversation, ...prev]);
        setActiveConvId(createdConversation._id);
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
    if (!newMessage.trim() || !activeConvId || sendingMessage || activeConversation?.supportTicket?.status === 'closed') {
      return;
    }

    try {
      setSendingMessage(true);
      const response = await sendConversationMessage(activeConvId, {
        content: newMessage.trim(),
        type: 'text'
      });

      const createdMessage = response.data?.data;
      if (createdMessage) {
        setMessages((prev) => [...prev, createdMessage]);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === activeConvId
            ? {
                ...conversation,
                lastMessage: createdMessage,
                lastMessageAt: createdMessage.createdAt
              }
            : conversation
        )));
      }

      setNewMessage('');
    } catch (err) {
      setError(err.response?.data?.message || t('errorOccurred'));
    } finally {
      setSendingMessage(false);
    }
  };

  const handleCloseTicket = async () => {
    if (!activeConversation) return;

    try {
      const response = await updateSupportTicketStatus(activeConversation._id, 'closed');
      const updatedConversation = response.data?.data;
      setConversations((prev) => prev.map((conversation) => (
        conversation._id === activeConversation._id
          ? updatedConversation
          : conversation
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to close the support ticket.');
    }
  };

  return (
    <ApprenantLayout>
      <div className="support-page">
        <div className="support-container">
          {error && <div className="error-message">{error}</div>}

          <div className="support-page-header">
            <div>
              <h2>{t('apprenant.supportCenter')}</h2>
              <p className="support-page-subtitle">{t('apprenant.supportSubtitle')}</p>
            </div>
            {totalUnread > 0 && (
              <div className="support-notification-pill">
                <FaBell /> {totalUnread} {t('apprenant.unread')}
              </div>
            )}
          </div>

          <div className="message-wrapper support-grid">
            <div className="conv-list support-list-panel">
              <div className="chat-search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={t('apprenant.searchTickets')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <form className="new-ticket-form" onSubmit={handleCreateTicket}>
                <h3><FaPlus /> {t('apprenant.createNewTicket')}</h3>
                <input
                  type="text"
                  className="ticket-input"
                  placeholder={t('apprenant.subject')}
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm((prev) => ({ ...prev, subject: e.target.value }))}
                />

                <div className="ticket-select-row">
                  <select
                    className="ticket-input ticket-select"
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, category: e.target.value }))}
                  >
                    <option value="technical">{t('apprenant.technical')}</option>
                    <option value="billing">{t('apprenant.billing')}</option>
                    <option value="certificate">{t('apprenant.certificate')}</option>
                    <option value="other">{t('apprenant.other')}</option>
                  </select>

                  <select
                    className="ticket-input ticket-select"
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm((prev) => ({ ...prev, priority: e.target.value }))}
                  >
                    <option value="low">{t('apprenant.low')}</option>
                    <option value="medium">{t('apprenant.medium')}</option>
                    <option value="high">{t('apprenant.high')}</option>
                  </select>
                </div>

                <textarea
                  className="ticket-textarea"
                  rows={4}
                  placeholder={t('apprenant.message')}
                  value={ticketForm.message}
                  onChange={(e) => setTicketForm((prev) => ({ ...prev, message: e.target.value }))}
                />

                <div className="form-buttons">
                  <button type="submit" className="btn-submit" disabled={creatingTicket}>
                    {creatingTicket ? t('apprenant.sending') : t('apprenant.submitTicket')}
                  </button>
                </div>
              </form>

              {loadingConversations ? (
                <div className="conv-empty-state">{t('apprenant.loadingTickets')}</div>
              ) : filteredConversations.length === 0 ? (
                <div className="conv-empty-state">
                  <FaHeadset />
                  <p>{t('apprenant.noTicketsFound')}</p>
                </div>
              ) : (
                <div className="conversations-scroll">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation._id}
                      className={`conv-item ${conversation._id === activeConvId ? 'active' : ''}`}
                      onClick={() => setActiveConvId(conversation._id)}
                    >
                      <div className="conv-item-top">
                        <span className="conv-student-name">{getTicketLabel(conversation)}</span>
                        <span className="conv-time">{formatDate(conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt)}</span>
                      </div>

                      <div className="ticket-mini-meta">
                        <span className="ticket-mini-id">{conversation.supportTicket?.ticketId || 'SUPPORT'}</span>
                        <span className={`ticket-mini-status ${getStatusClass(conversation.supportTicket?.status)}`}>
                          {conversation.supportTicket?.status || t('apprenant.open')}
                        </span>
                      </div>

                      <div className="conv-item-bottom">
                        <span className="conv-preview">{getTicketPreview(conversation)}</span>
                        {conversation.unreadCount > 0 && <span className="conv-unread">{conversation.unreadCount}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="chat-window support-chat-panel">
              <div className="chat-header support-chat-header">
                <div>
                  <h3>{activeConversation ? getTicketLabel(activeConversation) : t('apprenant.supportTickets')}</h3>
                  {activeConversation ? (
                    <div className="support-ticket-head-meta">
                      <span>{activeConversation.supportTicket?.ticketId}</span>
                      <span className={`ticket-mini-status ${getStatusClass(activeConversation.supportTicket?.status)}`}>
                        {activeConversation.supportTicket?.status || t('apprenant.open')}
                      </span>
                      <span className={`priority-badge priority-${activeConversation.supportTicket?.priority || 'medium'}`}>
                        {activeConversation.supportTicket?.priority || t('apprenant.medium')}
                      </span>
                    </div>
                  ) : (
                    <p>{t('apprenant.noTicketsMessage')}</p>
                  )}
                </div>

                {activeConversation && activeConversation.supportTicket?.status !== 'closed' && (
                  <button type="button" className="btn-secondary-inline" onClick={handleCloseTicket}>
                    Close Ticket
                  </button>
                )}
              </div>

              <div className="chat-body">
                {loadingMessages ? (
                  <div className="chat-empty-state">{t('apprenant.loadingTickets')}</div>
                ) : !activeConversation ? (
                  <div className="chat-empty-state">{t('apprenant.noTicketsMessage')}</div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty-state">{t('apprenant.noMessagesYet')}</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message._id}
                      className={`chat-message ${message.sender?._id === user?._id ? 'sent' : 'received'}`}
                    >
                      <div className="chat-bubble">
                        <div>{message.content}</div>
                        <span className="chat-meta">{formatTime(message.createdAt)}</span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input ticket-chat-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={activeConversation?.supportTicket?.status === 'closed' ? 'This ticket is closed.' : t('apprenant.writeMessage')}
                  rows={3}
                  disabled={!activeConversation || activeConversation?.supportTicket?.status === 'closed'}
                />
                <button
                  type="button"
                  className="btn-send-message"
                  onClick={handleSendMessage}
                  disabled={!activeConversation || !newMessage.trim() || sendingMessage || activeConversation?.supportTicket?.status === 'closed'}
                >
                  {sendingMessage ? t('apprenant.sending') : <><FaPaperPlane /> {t('apprenant.send')}</>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantSupport;
