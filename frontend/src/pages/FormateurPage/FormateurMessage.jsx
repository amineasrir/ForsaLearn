import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/formateur.css';
import SidebarF from '../../components/formateur/sidebarF';
import ProfilSection from '../../components/formateur/profilSection';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import {
  getFormateurConversationMessages,
  getFormateurConversations,
  getFormateurProfile,
  markFormateurConversationAsRead,
  sendFormateurConversationMessage
} from '../../services/formateurService';

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

  return otherParticipant?.fullName || 'Conversation';
};

const getLastMessagePreview = (conversation) => {
  const content = conversation.lastMessage?.content;
  if (!content) return 'No messages yet';
  return content.length > 45 ? `${content.slice(0, 45)}...` : content;
};

const FormateurMessage = () => {
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
  const lastLoadedConversationRef = useRef(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingConversations(true);
        const [userResponse, conversationsResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurConversations()
        ]);

        const currentUser = userResponse.data?.data || null;
        const loadedConversations = (conversationsResponse.data?.data || []).filter(
          (conversation) => conversation.type !== 'support'
        );

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

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConvId) || null,
    [activeConvId, conversations]
  );

  useEffect(() => {
    if (!activeConvId) {
      setMessages([]);
      return;
    }

    if (lastLoadedConversationRef.current === activeConvId) {
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        const response = await getFormateurConversationMessages(activeConvId);
        setMessages(response.data?.data || []);
        await markFormateurConversationAsRead(activeConvId);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === activeConvId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )));
        lastLoadedConversationRef.current = activeConvId;
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

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvId || sending) return;

    try {
      setSending(true);
      const response = await sendFormateurConversationMessage(activeConvId, {
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
          <ProfilSection
            formateur={{
              name: user?.fullName || 'Instructor',
              avatar: user?.profilePicture || 'https://via.placeholder.com/80'
            }}
            actionLabel="Support"
          />

          {error && <div className="alert alert-error">{error}</div>}

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
                  onClick={() => {
                    lastLoadedConversationRef.current = null;
                    setActiveConvId(conv._id);
                  }}
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
                  <h3>{activeConversation ? getConversationLabel(activeConversation, user?._id) : 'Messages'}</h3>
                  <p>{activeConversation?.type || 'direct conversation'}</p>
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
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
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

export default FormateurMessage;
