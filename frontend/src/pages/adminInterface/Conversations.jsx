import React, { useEffect, useMemo, useRef, useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/conversations-admin.css';
import {
  FaSearch,
  FaUsers,
  FaUser,
  FaHeadset,
  FaPaperPlane,
  FaEllipsisV,
  FaArchive,
  FaBell,
  FaBellSlash,
  FaThumbtack,
  FaBookOpen
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';
import {
  archiveAdminConversation,
  getAdminConversationMessages,
  getAdminConversations,
  getAdminProfile,
  getAdminUnreadMessagesCount,
  markAdminConversationAsRead,
  muteAdminConversation,
  pinAdminConversation,
  sendAdminConversationMessage,
  unmuteAdminConversation,
  unpinAdminConversation
} from '../../services/adminService';

const formatTime = (value) => {
  if (!value) return '';

  return new Date(value).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatConversationTime = (value) => {
  if (!value) return '';

  const messageDate = new Date(value);
  const today = new Date();
  const diffInHours = (today - messageDate) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return messageDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  if (diffInHours < 48) {
    return 'Yesterday';
  }

  return messageDate.toLocaleDateString([], {
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

const getConversationAvatar = (conversation, currentUserId) => {
  if (conversation.type === 'group' || conversation.type === 'support') {
    return null;
  }

  const otherParticipant = (conversation.participants || []).find(
    (participant) => participant._id !== currentUserId
  );

  return otherParticipant?.profilePicture || 'https://via.placeholder.com/50x50?text=U';
};

const getLastMessagePreview = (conversation) => {
  const content = conversation.lastMessage?.content;

  if (!content) {
    return 'No messages yet';
  }

  return content.length > 60 ? `${content.slice(0, 60)}...` : content;
};

const getConversationType = (conversation) => {
  if (conversation.type === 'support') return 'support';
  if (conversation.type === 'group') return 'group';
  return 'direct';
};

const Conversations = () => {
  const [admin, setAdmin] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedConversationId, setSelectedConversationId] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [unreadTotal, setUnreadTotal] = useState(0);
  const messagesEndRef = useRef(null);
  const lastLoadedConversationRef = useRef(null);

  const typeOptions = [
    { value: 'all', label: 'All Conversations', icon: <FaUsers /> },
    { value: 'direct', label: 'Direct Messages', icon: <FaUser /> },
    { value: 'group', label: 'Groups', icon: <FaUsers /> },
    { value: 'support', label: 'Support', icon: <FaHeadset /> }
  ];

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoadingConversations(true);
        setError('');

        const [profileResponse, conversationsResponse, unreadResponse] = await Promise.all([
          getAdminProfile(),
          getAdminConversations(),
          getAdminUnreadMessagesCount()
        ]);

        const currentAdmin = profileResponse.data?.user || null;
        const loadedConversations = conversationsResponse.data?.data || [];

        setAdmin(currentAdmin);
        setConversations(loadedConversations);
        setUnreadTotal(unreadResponse.data?.data?.unreadCount || 0);
        setSelectedConversationId((currentId) => currentId || loadedConversations[0]?._id || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load conversations.');
      } finally {
        setLoadingConversations(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const filteredConversations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return conversations
      .filter((conversation) => {
        const matchesType = filterType === 'all' || getConversationType(conversation) === filterType;

        if (!matchesType) {
          return false;
        }

        if (!normalizedSearch) {
          return true;
        }

        const label = getConversationLabel(conversation, admin?._id).toLowerCase();
        const participantMatch = (conversation.participants || []).some((participant) =>
          `${participant.fullName || ''} ${participant.email || ''}`.toLowerCase().includes(normalizedSearch)
        );
        const courseMatch = (conversation.course?.title || '').toLowerCase().includes(normalizedSearch);

        return label.includes(normalizedSearch) || participantMatch || courseMatch;
      })
      .sort((a, b) => {
        const aPinned = (a.pinnedBy || []).includes(admin?._id);
        const bPinned = (b.pinnedBy || []).includes(admin?._id);

        if (aPinned && !bPinned) return -1;
        if (!aPinned && bPinned) return 1;

        return new Date(b.lastMessageAt || 0) - new Date(a.lastMessageAt || 0);
      });
  }, [admin?._id, conversations, filterType, searchTerm]);

  const selectedConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  );

  useEffect(() => {
    if (!selectedConversationId) {
      setMessages([]);
      return;
    }

    if (lastLoadedConversationRef.current === selectedConversationId) {
      return;
    }

    const loadMessages = async () => {
      try {
        setLoadingMessages(true);
        setError('');

        const unreadBeforeOpening = selectedConversation?.unreadCount || 0;

        const response = await getAdminConversationMessages(selectedConversationId);
        setMessages(response.data?.data || []);

        await markAdminConversationAsRead(selectedConversationId);
        setConversations((prev) => prev.map((conversation) => (
          conversation._id === selectedConversationId
            ? { ...conversation, unreadCount: 0 }
            : conversation
        )));
        setUnreadTotal((prev) => Math.max(0, prev - unreadBeforeOpening));
        lastLoadedConversationRef.current = selectedConversationId;
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load messages.');
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
  }, [selectedConversation, selectedConversationId]);

  const stats = useMemo(() => ({
    total: conversations.length,
    direct: conversations.filter((conversation) => getConversationType(conversation) === 'direct').length,
    groups: conversations.filter((conversation) => getConversationType(conversation) === 'group').length,
    support: conversations.filter((conversation) => getConversationType(conversation) === 'support').length,
    unread: unreadTotal
  }), [conversations, unreadTotal]);

  const handleSelectConversation = (conversationId) => {
    lastLoadedConversationRef.current = null;
    setSelectedConversationId(conversationId);
  };

  const updateConversationState = (conversationId, updates) => {
    setConversations((prev) => prev.map((conversation) => (
      conversation._id === conversationId
        ? { ...conversation, ...updates }
        : conversation
    )));
  };

  const handleTogglePin = async () => {
    if (!selectedConversation || !admin?._id) return;

    const isPinned = (selectedConversation.pinnedBy || []).includes(admin._id);

    try {
      if (isPinned) {
        await unpinAdminConversation(selectedConversation._id);
        updateConversationState(
          selectedConversation._id,
          {
            pinnedBy: (selectedConversation.pinnedBy || []).filter((id) => id !== admin._id)
          }
        );
      } else {
        await pinAdminConversation(selectedConversation._id);
        updateConversationState(
          selectedConversation._id,
          {
            pinnedBy: [...(selectedConversation.pinnedBy || []), admin._id]
          }
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update pin status.');
    }
  };

  const handleToggleMute = async () => {
    if (!selectedConversation || !admin?._id) return;

    const isMuted = (selectedConversation.mutedBy || []).includes(admin._id);

    try {
      if (isMuted) {
        await unmuteAdminConversation(selectedConversation._id);
        updateConversationState(
          selectedConversation._id,
          {
            mutedBy: (selectedConversation.mutedBy || []).filter((id) => id !== admin._id)
          }
        );
      } else {
        await muteAdminConversation(selectedConversation._id);
        updateConversationState(
          selectedConversation._id,
          {
            mutedBy: [...(selectedConversation.mutedBy || []), admin._id]
          }
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update mute status.');
    }
  };

  const handleArchive = async () => {
    if (!selectedConversation) return;

    try {
      await archiveAdminConversation(selectedConversation._id);
      setConversations((prev) => prev.filter(
        (conversation) => conversation._id !== selectedConversation._id
      ));
      lastLoadedConversationRef.current = null;
      setSelectedConversationId((prev) => (
        prev === selectedConversation._id ? null : prev
      ));
      setMessages([]);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to archive conversation.');
    }
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();

    if (!messageInput.trim() || !selectedConversationId || sending) {
      return;
    }

    try {
      setSending(true);
      setError('');

      const response = await sendAdminConversationMessage(selectedConversationId, {
        content: messageInput.trim(),
        type: 'text'
      });

      const createdMessage = response.data?.data;

      if (createdMessage) {
        setMessages((prev) => [...prev, createdMessage]);
        updateConversationState(selectedConversationId, {
          lastMessage: createdMessage,
          lastMessageAt: createdMessage.createdAt
        });
      }

      setMessageInput('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="dashboard">
      <Header title="Conversations" />

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
                  <div className="stat-icon purple">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Conversations</span>
                </div>
                <p className="stat-value">{stats.total}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaUser />
                  </div>
                  <span className="stat-label">Direct Messages</span>
                </div>
                <p className="stat-value">{stats.direct}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Group Chats</span>
                </div>
                <p className="stat-value">{stats.groups}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaBell />
                  </div>
                  <span className="stat-label">Unread Messages</span>
                </div>
                <p className="stat-value">{stats.unread}</p>
              </div>
            </div>

            <div className="chart-card messages-container">
              <div className="conversations-sidebar">
                <div className="conversations-header">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(event) => setSearchTerm(event.target.value)}
                      className="search-input-small"
                    />
                  </div>

                  <div className="filter-tabs">
                    {typeOptions.map((option) => (
                      <button
                        key={option.value}
                        className={`filter-tab ${filterType === option.value ? 'active' : ''}`}
                        onClick={() => setFilterType(option.value)}
                        title={option.label}
                      >
                        {option.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="conversations-list">
                  {loadingConversations ? (
                    <div className="empty-conversations">
                      <FaUsers className="empty-icon" />
                      <p>Loading conversations...</p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="empty-conversations">
                      <FaUsers className="empty-icon" />
                      <p>No conversations found</p>
                    </div>
                  ) : filteredConversations.map((conversation) => {
                    const isPinned = (conversation.pinnedBy || []).includes(admin?._id);
                    const isMuted = (conversation.mutedBy || []).includes(admin?._id);
                    const isActive = selectedConversationId === conversation._id;
                    const label = getConversationLabel(conversation, admin?._id);
                    const avatar = getConversationAvatar(conversation, admin?._id);

                    return (
                      <div
                        key={conversation._id}
                        className={`conversation-item ${isActive ? 'active' : ''} ${conversation.unreadCount > 0 ? 'unread' : ''}`}
                        onClick={() => handleSelectConversation(conversation._id)}
                      >
                        {isPinned && <FaThumbtack className="pin-icon" />}

                        <div className="conversation-avatar-wrapper">
                          {conversation.type === 'group' ? (
                            <div className="group-avatar">
                              <FaUsers />
                            </div>
                          ) : conversation.type === 'support' ? (
                            <div className="support-avatar">
                              <FaHeadset />
                            </div>
                          ) : (
                            <img src={avatar} alt={label} className="conversation-avatar" />
                          )}
                        </div>

                        <div className="conversation-content">
                          <div className="conversation-top">
                            <h4 className="conversation-name">{label}</h4>
                            <span className="conversation-time">
                              {formatConversationTime(conversation.lastMessageAt)}
                            </span>
                          </div>
                          <div className="conversation-bottom">
                            <p className="conversation-last-message">
                              {isMuted && <FaBellSlash className="muted-icon" />}
                              {getLastMessagePreview(conversation)}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="unread-badge">{conversation.unreadCount}</span>
                            )}
                          </div>
                          {conversation.course && (
                            <div className="conversation-course-tag">
                              <FaBookOpen /> {conversation.course.title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="chat-area">
                {selectedConversation ? (
                  <>
                    <div className="chat-header">
                      <div className="chat-header-info">
                        {selectedConversation.type === 'group' ? (
                          <div className="chat-avatar group-avatar-header">
                            <FaUsers />
                          </div>
                        ) : selectedConversation.type === 'support' ? (
                          <div className="chat-avatar support-avatar-header">
                            <FaHeadset />
                          </div>
                        ) : (
                          <div className="chat-avatar-wrapper">
                            <img
                              src={getConversationAvatar(selectedConversation, admin?._id)}
                              alt={getConversationLabel(selectedConversation, admin?._id)}
                              className="chat-avatar"
                            />
                          </div>
                        )}

                        <div>
                          <h3 className="chat-name">
                            {getConversationLabel(selectedConversation, admin?._id)}
                          </h3>
                          <p className="chat-status">
                            {selectedConversation.type === 'group'
                              ? `${selectedConversation.participants?.length || 0} participants`
                              : selectedConversation.type === 'support'
                                ? 'Support conversation'
                                : 'Direct conversation'}
                          </p>
                        </div>
                      </div>

                      <div className="chat-actions">
                        <button
                          className="chat-action-btn"
                          title={(selectedConversation.mutedBy || []).includes(admin?._id) ? 'Unmute' : 'Mute'}
                          onClick={handleToggleMute}
                        >
                          {(selectedConversation.mutedBy || []).includes(admin?._id) ? <FaBellSlash /> : <FaBell />}
                        </button>
                        <button
                          className="chat-action-btn"
                          title={(selectedConversation.pinnedBy || []).includes(admin?._id) ? 'Unpin' : 'Pin'}
                          onClick={handleTogglePin}
                        >
                          <FaThumbtack />
                        </button>
                        <button
                          className="chat-action-btn"
                          title="Archive"
                          onClick={handleArchive}
                        >
                          <FaArchive />
                        </button>
                        <button className="chat-action-btn" title="More">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>

                    <div className="messages-area">
                      {loadingMessages ? (
                        <div className="chat-placeholder-state">Loading messages...</div>
                      ) : messages.length === 0 ? (
                        <div className="chat-placeholder-state">
                          Start the conversation by sending a message.
                        </div>
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
                              {!isOwn && (
                                <span className="message-sender-name">
                                  {message.sender?.fullName || 'User'}
                                </span>
                              )}
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
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(event) => setMessageInput(event.target.value)}
                        className="message-input"
                        disabled={sending}
                      />
                      <button type="submit" className="send-btn" disabled={!messageInput.trim() || sending}>
                        <FaPaperPlane />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="no-conversation-selected">
                    <FaUsers className="no-conv-icon" />
                    <h3>Select a conversation</h3>
                    <p>Choose a conversation from the list to start messaging</p>
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

export default Conversations;
