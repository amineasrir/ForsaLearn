import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaSearch, FaComment, FaPaperPlane } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import '../../styles/formateur.css';
import './dashboard.css';
import {
  getApprenantProfile,
  getConversations,
  getConversationMessages,
  markConversationAsRead,
  sendConversationMessage
} from '../../services/apprenentService';

const formatTime = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatConversationDate = (value) => {
  if (!value) return '';
  return new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

const getConversationLabel = (conversation, currentUserId) => {
  if (conversation.name) return conversation.name;
  const otherParticipant = (conversation.participants || []).find(
    (participant) => participant._id !== currentUserId
  );
  return otherParticipant?.fullName || 'Support Ticket';
};

const getLastMessagePreview = (conversation) => {
  const content = conversation.lastMessage?.content;
  if (!content) return 'No messages yet';
  return content.length > 45 ? `${content.slice(0, 45)}...` : content;
};

const ApprenantSupport = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadSupportConversations = async () => {
      try {
        setLoadingConversations(true);
        const [profileResponse, conversationsResponse] = await Promise.all([
          getApprenantProfile(),
          getConversations({ type: 'support' })
        ]);

        setUser(profileResponse.data?.user || null);
        const supportConversations = conversationsResponse.data?.data || [];
        setConversations(supportConversations);
        setActiveConvId(supportConversations[0]?._id || null);
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
      getConversationLabel(conversation, user?._id).toLowerCase().includes(normalizedSearch) ||
      getLastMessagePreview(conversation).toLowerCase().includes(normalizedSearch)
    );
  }, [conversations, searchTerm, user?._id]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId || sendingMessage) return;

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

  return (
    <ApprenantLayout>
      <div className="support-page">
        <div className="support-container">
          <div className="message-wrapper">
            <div className="conv-list">
              <div className="chat-search-box">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder={t('apprenant.searchTickets')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {loadingConversations ? (
                <div className="conv-empty-state">{t('apprenant.loadingTickets')}</div>
              ) : filteredConversations.length === 0 ? (
                <div className="conv-empty-state">
                  <FaComment />
                  <p>{t('apprenant.noTicketsFound')}</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation._id}
                    className={`conv-item ${conversation._id === activeConvId ? 'active' : ''}`}
                    onClick={() => setActiveConvId(conversation._id)}
                  >
                    <div className="conv-item-top">
                      <span className="conv-student-name">{getConversationLabel(conversation, user?._id)}</span>
                      <span className="conv-time">{formatConversationDate(conversation.lastMessageAt || conversation.updatedAt || conversation.createdAt)}</span>
                    </div>
                    <div className="conv-item-bottom">
                      <span className="conv-preview">{getLastMessagePreview(conversation)}</span>
                      {conversation.unreadCount > 0 && <span className="conv-unread">{conversation.unreadCount}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="chat-window support-chat-window">
              <div className="chat-header">
                <div>
                  <h3>{activeConversation ? getConversationLabel(activeConversation, user?._id) : t('apprenant.supportTickets')}</h3>
                  <p>{activeConversation ? t('apprenant.supportTickets') : t('apprenant.noTicketsMessage')}</p>
                </div>
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
                      key={message._id || `${message.createdAt}-${Math.random()}`}
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

              <div className="chat-input">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={t('apprenant.writeMessage')}
                  rows={3}
                  disabled={!activeConversation}
                />
                <button
                  type="button"
                  className="btn-send-message"
                  onClick={sendMessage}
                  disabled={!activeConversation || !newMessage.trim() || sendingMessage}
                >
                  {sendingMessage ? t('apprenant.sending') : <><FaPaperPlane /> {t('apprenant.send')}</>}
                </button>
              </div>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantSupport;