import React, { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/conversations-admin.css';
import { 
  FaSearch,
  FaFilter,
  FaPlus,
  FaUsers,
  FaUser,
  FaHeadset,
  FaPaperPlane,
  FaPaperclip,
  FaEllipsisV,
  FaArchive,
  FaTrash,
  FaBell,
  FaBellSlash,
  FaThumbtack,
  FaBookOpen,
  FaCircle,
  FaClock,
  FaCheckDouble,
  FaCheck
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';

const Conversations = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messageInput, setMessageInput] = useState('');

  // Sample conversations data based on the schema
  const conversationsData = [
    {
      _id: '1',
      type: 'direct',
      participants: [
        {
          _id: 'user1',
          fullName: 'John Smith',
          email: 'john.smith@example.com',
          role: 'visiteur',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        },
        {
          _id: 'user2',
          fullName: 'Sarah Johnson',
          email: 'sarah.johnson@example.com',
          role: 'formateur',
          profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        }
      ],
      lastMessage: {
        _id: 'msg1',
        content: 'Thank you for the explanation! That really helped.',
        sender: 'user1',
        createdAt: new Date('2024-03-02T10:30:00'),
        isRead: true
      },
      lastMessageAt: new Date('2024-03-02T10:30:00'),
      isActive: true,
      mutedBy: [],
      pinnedBy: ['currentUser'],
      archivedBy: [],
      unreadCount: 0,
      isOnline: true
    },
    {
      _id: '2',
      type: 'group',
      name: 'Web Development Study Group',
      participants: [
        {
          _id: 'user3',
          fullName: 'Ahmed Ali',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        },
        {
          _id: 'user4',
          fullName: 'Emily Chen',
          profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
        },
        {
          _id: 'user5',
          fullName: 'Mohammed Hassan',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        }
      ],
      groupAdmin: 'user3',
      lastMessage: {
        _id: 'msg2',
        content: 'Has anyone completed the React assignment yet?',
        sender: 'user4',
        createdAt: new Date('2024-03-02T09:15:00'),
        isRead: false
      },
      lastMessageAt: new Date('2024-03-02T09:15:00'),
      isActive: true,
      mutedBy: [],
      pinnedBy: [],
      archivedBy: [],
      unreadCount: 3,
      course: {
        _id: 'course1',
        title: 'Complete Web Development Bootcamp',
        thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=100'
      }
    },
    {
      _id: '3',
      type: 'support',
      name: 'Support Ticket #1234',
      participants: [
        {
          _id: 'admin1',
          fullName: 'Admin Support',
          role: 'admin',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        },
        {
          _id: 'user6',
          fullName: 'Lisa Anderson',
          role: 'visiteur',
          profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100'
        }
      ],
      lastMessage: {
        _id: 'msg3',
        content: 'We are looking into your payment issue. Will update you shortly.',
        sender: 'admin1',
        createdAt: new Date('2024-03-01T16:45:00'),
        isRead: true
      },
      lastMessageAt: new Date('2024-03-01T16:45:00'),
      isActive: true,
      mutedBy: [],
      pinnedBy: [],
      archivedBy: [],
      unreadCount: 0,
      isOnline: true
    },
    {
      _id: '4',
      type: 'direct',
      participants: [
        {
          _id: 'user7',
          fullName: 'Dr. Ahmed Hassan',
          role: 'formateur',
          profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100'
        },
        {
          _id: 'currentUser',
          fullName: 'Current User',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        }
      ],
      lastMessage: {
        _id: 'msg4',
        content: 'Could you review my course outline when you have time?',
        sender: 'currentUser',
        createdAt: new Date('2024-03-01T14:20:00'),
        isRead: false
      },
      lastMessageAt: new Date('2024-03-01T14:20:00'),
      isActive: true,
      mutedBy: [],
      pinnedBy: [],
      archivedBy: [],
      unreadCount: 0,
      isOnline: false
    },
    {
      _id: '5',
      type: 'group',
      name: 'Data Science - Q&A',
      participants: [
        {
          _id: 'user8',
          fullName: 'Sarah Johnson',
          profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'
        },
        {
          _id: 'user9',
          fullName: 'David Martinez',
          profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100'
        }
      ],
      groupAdmin: 'user8',
      lastMessage: {
        _id: 'msg5',
        content: 'The pandas dataframe tutorial was really helpful!',
        sender: 'user9',
        createdAt: new Date('2024-02-29T11:30:00'),
        isRead: true
      },
      lastMessageAt: new Date('2024-02-29T11:30:00'),
      isActive: true,
      mutedBy: ['currentUser'],
      pinnedBy: [],
      archivedBy: [],
      unreadCount: 12,
      course: {
        _id: 'course2',
        title: 'Data Science with Python',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100'
      }
    },
    {
      _id: '6',
      type: 'direct',
      participants: [
        {
          _id: 'user10',
          fullName: 'Emily Chen',
          role: 'visiteur',
          profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100'
        },
        {
          _id: 'currentUser',
          fullName: 'Current User',
          profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
        }
      ],
      lastMessage: {
        _id: 'msg6',
        content: 'Thanks for your help with the assignment!',
        sender: 'user10',
        createdAt: new Date('2024-02-28T08:15:00'),
        isRead: true
      },
      lastMessageAt: new Date('2024-02-28T08:15:00'),
      isActive: true,
      mutedBy: [],
      pinnedBy: [],
      archivedBy: [],
      unreadCount: 0,
      isOnline: true
    }
  ];

  // Sample messages for selected conversation
  const messagesData = {
    '1': [
      {
        _id: 'msg1-1',
        sender: 'user1',
        content: 'Hi! I have a question about the React hooks lecture.',
        createdAt: new Date('2024-03-02T10:15:00'),
        isRead: true
      },
      {
        _id: 'msg1-2',
        sender: 'user2',
        content: 'Sure! What would you like to know?',
        createdAt: new Date('2024-03-02T10:20:00'),
        isRead: true
      },
      {
        _id: 'msg1-3',
        sender: 'user1',
        content: 'Can you explain the difference between useState and useEffect?',
        createdAt: new Date('2024-03-02T10:25:00'),
        isRead: true
      },
      {
        _id: 'msg1-4',
        sender: 'user2',
        content: 'Of course! useState is for managing state in functional components, while useEffect is for side effects like API calls or subscriptions.',
        createdAt: new Date('2024-03-02T10:28:00'),
        isRead: true
      },
      {
        _id: 'msg1-5',
        sender: 'user1',
        content: 'Thank you for the explanation! That really helped.',
        createdAt: new Date('2024-03-02T10:30:00'),
        isRead: true
      }
    ]
  };

  const typeOptions = [
    { value: 'all', label: 'All Conversations', icon: <FaUsers /> },
    { value: 'direct', label: 'Direct Messages', icon: <FaUser /> },
    { value: 'group', label: 'Groups', icon: <FaUsers /> },
    { value: 'support', label: 'Support', icon: <FaHeadset /> }
  ];

  // Filter conversations
  const filteredConversations = conversationsData.filter(conv => {
    const matchesType = filterType === 'all' || conv.type === filterType;
    
    let matchesSearch = false;
    if (conv.type === 'direct') {
      const otherParticipant = conv.participants.find(p => p._id !== 'currentUser');
      matchesSearch = otherParticipant?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     otherParticipant?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    } else {
      matchesSearch = conv.name?.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    return matchesType && (searchTerm === '' || matchesSearch);
  });

  // Sort: pinned first, then by lastMessageAt
  const sortedConversations = filteredConversations.sort((a, b) => {
    const aPinned = a.pinnedBy.includes('currentUser');
    const bPinned = b.pinnedBy.includes('currentUser');
    
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    
    return new Date(b.lastMessageAt) - new Date(a.lastMessageAt);
  });

  // Get conversation display info
  const getConversationDisplay = (conv) => {
    if (conv.type === 'direct') {
      const otherParticipant = conv.participants.find(p => p._id !== 'currentUser');
      return {
        name: otherParticipant?.fullName || 'Unknown User',
        avatar: otherParticipant?.profilePicture,
        isOnline: conv.isOnline
      };
    } else {
      return {
        name: conv.name,
        avatar: conv.course?.thumbnail || null,
        isOnline: false
      };
    }
  };

  // Format time
  const formatTime = (date) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now - messageDate) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Handle send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageInput.trim()) {
      console.log('Sending message:', messageInput);
      setMessageInput('');
    }
  };

  // Calculate stats
  const stats = {
    total: conversationsData.length,
    direct: conversationsData.filter(c => c.type === 'direct').length,
    groups: conversationsData.filter(c => c.type === 'group').length,
    support: conversationsData.filter(c => c.type === 'support').length,
    unread: conversationsData.reduce((sum, c) => sum + c.unreadCount, 0)
  };

  return (
    <div className="dashboard">
      <Header title='Conversations'/>
      
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main conversations-main">
            {/* Page Header */}
            <ProfileCard />
            {/* Stats Grid */}
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

            {/* Messages Container */}
            <div className="chart-card messages-container">
              {/* Conversations List */}
              <div className="conversations-sidebar">
                <div className="conversations-header">
                  <div className="search-box">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search conversations..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="search-input-small"
                    />
                  </div>

                  <div className="filter-tabs">
                    {typeOptions.map(option => (
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
                  {sortedConversations.map(conv => {
                    const display = getConversationDisplay(conv);
                    const isPinned = conv.pinnedBy.includes('currentUser');
                    const isMuted = conv.mutedBy.includes('currentUser');
                    const isActive = selectedConversation?._id === conv._id;

                    return (
                      <div
                        key={conv._id}
                        className={`conversation-item ${isActive ? 'active' : ''} ${conv.unreadCount > 0 ? 'unread' : ''}`}
                        onClick={() => setSelectedConversation(conv)}
                      >
                        {isPinned && <FaThumbtack className="pin-icon" />}
                        
                        <div className="conversation-avatar-wrapper">
                          {conv.type === 'group' ? (
                            <div className="group-avatar">
                              <FaUsers />
                            </div>
                          ) : conv.type === 'support' ? (
                            <div className="support-avatar">
                              <FaHeadset />
                            </div>
                          ) : (
                            <img src={display.avatar} alt={display.name} className="conversation-avatar" />
                          )}
                          {display.isOnline && <span className="online-dot"></span>}
                        </div>

                        <div className="conversation-content">
                          <div className="conversation-top">
                            <h4 className="conversation-name">{display.name}</h4>
                            <span className="conversation-time">{formatTime(conv.lastMessageAt)}</span>
                          </div>
                          <div className="conversation-bottom">
                            <p className="conversation-last-message">
                              {isMuted && <FaBellSlash className="muted-icon" />}
                              {conv.lastMessage?.content}
                            </p>
                            {conv.unreadCount > 0 && (
                              <span className="unread-badge">{conv.unreadCount}</span>
                            )}
                          </div>
                          {conv.course && (
                            <div className="conversation-course-tag">
                              <FaBookOpen /> {conv.course.title}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {sortedConversations.length === 0 && (
                    <div className="empty-conversations">
                      <FaUsers className="empty-icon" />
                      <p>No conversations found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Chat Area */}
              <div className="chat-area">
                {selectedConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="chat-header">
                      <div className="chat-header-info">
                        {(() => {
                          const display = getConversationDisplay(selectedConversation);
                          return (
                            <>
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
                                  <img src={display.avatar} alt={display.name} className="chat-avatar" />
                                  {display.isOnline && <span className="online-dot-large"></span>}
                                </div>
                              )}
                              <div>
                                <h3 className="chat-name">{display.name}</h3>
                                {selectedConversation.type === 'group' ? (
                                  <p className="chat-status">{selectedConversation.participants.length} participants</p>
                                ) : selectedConversation.type === 'support' ? (
                                  <p className="chat-status">Support Team</p>
                                ) : (
                                  <p className="chat-status">{display.isOnline ? 'Online' : 'Offline'}</p>
                                )}
                              </div>
                            </>
                          );
                        })()}
                      </div>

                      <div className="chat-actions">
                        <button className="chat-action-btn" title="Mute">
                          {selectedConversation.mutedBy.includes('currentUser') ? <FaBellSlash /> : <FaBell />}
                        </button>
                        <button className="chat-action-btn" title="Archive">
                          <FaArchive />
                        </button>
                        <button className="chat-action-btn" title="More">
                          <FaEllipsisV />
                        </button>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="messages-area">
                      {messagesData[selectedConversation._id]?.map(message => {
                        const isOwn = message.sender === 'currentUser' || message.sender === 'user2';
                        return (
                          <div key={message._id} className={`message ${isOwn ? 'own' : ''}`}>
                            {!isOwn && (
                              <img 
                                src={selectedConversation.participants.find(p => p._id === message.sender)?.profilePicture}
                                alt="Avatar"
                                className="message-avatar"
                              />
                            )}
                            <div className="message-content">
                              <p className="message-text">{message.content}</p>
                              <div className="message-meta">
                                <span className="message-time">{formatTime(message.createdAt)}</span>
                                {isOwn && (
                                  <span className="message-status">
                                    {message.isRead ? <FaCheckDouble className="read" /> : <FaCheck />}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Message Input */}
                    <form className="message-input-area" onSubmit={handleSendMessage}>
                      <button type="button" className="attach-btn" title="Attach file">
                        <FaPaperclip />
                      </button>
                      <input
                        type="text"
                        placeholder="Type a message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        className="message-input"
                      />
                      <button type="submit" className="send-btn" disabled={!messageInput.trim()}>
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