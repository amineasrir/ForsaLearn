import React, { useEffect, useMemo, useRef, useState } from 'react';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
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

const formatConversationTime = (value) => {
  if (!value) return '';

  return new Date(value).toLocaleDateString([], {
    month: 'short',
    day: 'numeric'
  });
};

const getConversationLabel = (conversation, currentUserId) => {
  if (conversation.name) {
    return conversation.name;
  }

  const otherParticipant = (conversation.participants || []).find(
    (participant) => participant._id !== currentUserId
  );

  if (otherParticipant?.fullName) {
    return otherParticipant.fullName;
  }

  return 'Conversation';
};

const getLastMessagePreview = (conversation) => {
  const content = conversation.lastMessage?.content;
  if (!content) return 'No messages yet';
  return content.length > 45 ? `${content.slice(0, 45)}...` : content;
};

const ApprenantMessages = () => {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingConversations(true);
        const [userResponse, conversationsResponse] = await Promise.all([
          getApprenantProfile(),
          getConversations()
        ]);

        const currentUser = userResponse.data?.user || null;
        const loadedConversations = conversationsResponse.data?.data || [];

        setUser(currentUser);
        setConversations(loadedConversations);
        setActiveConvId(loadedConversations[0]?._id || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load conversations.');
      } finally {
        setLoadingConversations(false);
      }
    };

    loadInitialData();
  }, []);

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
        setError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [activeConvId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    if (!normalizedSearch) {
      return conversations;
    }

    return conversations.filter((conversation) =>
      getConversationLabel(conversation, user?._id).toLowerCase().includes(normalizedSearch)
    );
  }, [conversations, searchTerm, user?._id]);

  const activeConv = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConvId) || null,
    [activeConvId, conversations]
  );

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId || sending) return;

    try {
      setSending(true);
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
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
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
      <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
      <CardP user={user} />

          {error && <div className="error-message">{error}</div>}
          <div className="message-wrapper">
            <div className="conv-list">
              <div className="chat-search-box">
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {loadingConversations ? (
                <div className="conv-empty-state">Loading conversations...</div>
              ) : filteredConversations.length === 0 ? (
                <div className="conv-empty-state">No conversations found.</div>
              ) : filteredConversations.map((conv) => (
                <div
                  key={conv._id}
                  className={`conv-item ${conv._id === activeConvId ? 'active' : ''}`}
                  onClick={() => setActiveConvId(conv._id)}
                >
                  <div className="conv-item-top">
                    <span className="conv-student-name">{getConversationLabel(conv, user?._id)}</span>
                    <span className="conv-time">{formatConversationTime(conv.lastMessageAt)}</span>
                  </div>
                  <div className="conv-item-bottom">
                    <span className="conv-preview">{getLastMessagePreview(conv)}</span>
                    {conv.unreadCount > 0 && <span className="conv-unread">{conv.unreadCount}</span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="chat-window">
              <div className="chat-header">
                <div>
                  <h3>{activeConv ? getConversationLabel(activeConv, user?._id) : 'Messages'}</h3>
                  <p>{activeConv?.type || 'direct conversation'}</p>
                </div>
              </div>

              <div className="chat-body">
                {loadingMessages ? (
                  <div className="chat-empty-state">Loading messages...</div>
                ) : messages.length === 0 ? (
                  <div className="chat-empty-state">Start the conversation by sending a message.</div>
                ) : messages.map((message) => (
                  <div
                    key={message._id}
                    className={`chat-message ${message.sender?._id === user?._id ? 'sent' : 'received'}`}
                  >
                    <div className="chat-bubble">
                      <div>{message.content}</div>
                      <span className="chat-meta">
                        {formatTime(message.createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  placeholder={activeConvId ? 'Write a message...' : 'Select a conversation first'}
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                  disabled={!activeConvId || sending}
                />
                <button onClick={sendMessage} disabled={!activeConvId || sending || !newMessage.trim()}>
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ApprenantMessages;
