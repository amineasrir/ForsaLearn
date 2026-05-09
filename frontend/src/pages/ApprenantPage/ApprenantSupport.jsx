import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaSearch, FaFilter, FaClock, FaCheckCircle, FaTimesCircle, FaUser, FaComment, FaEye, FaTimes } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import { getConversations } from '../../services/apprenentService';
import './dashboard.css';

const ApprenantSupport = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'technical',
    priority: 'medium',
    message: ''
  });

  useEffect(() => {
    const loadTickets = async () => {
      setLoading(true);
      try {
        const response = await getConversations({ type: 'support' });
        setTickets(response.data?.data || []);
      } catch (error) {
        console.error('Error loading support tickets:', error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaClock className="status-icon open" />;
      case 'resolved':
        return <FaCheckCircle className="status-icon resolved" />;
      case 'closed':
        return <FaTimesCircle className="status-icon closed" />;
      default:
        return <FaClock className="status-icon open" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'open':
        return t('apprenant.open');
      case 'resolved':
        return t('apprenant.resolved');
      case 'closed':
        return t('apprenant.closed');
      default:
        return status;
    }
  };

  const getTicketStatus = (ticket) => {
    if (ticket.status) return ticket.status;
    if (ticket.unreadCount > 0) return 'open';
    return 'resolved';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return 'priority-medium';
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const subject = ticket.name || ticket.course?.title || ticket.lastMessage?.content || '';
    const matchesSearch = subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || getTicketStatus(ticket) === filter;
    return matchesSearch && matchesFilter;
  });

  const handleNewTicketSubmit = (e) => {
    e.preventDefault();
    // Handle new ticket submission
    console.log('New ticket:', newTicket);
    setShowNewTicketForm(false);
    setNewTicket({
      subject: '',
      category: 'technical',
      priority: 'medium',
      message: ''
    });
  };

  const rightContent = (
    <button
      className="new-ticket-btn"
      onClick={() => setShowNewTicketForm(true)}
    >
      <FaPlus />
      {t('apprenant.newTicket')}
    </button>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.supportTickets')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.supportTickets') }]}
      rightContent={rightContent}
    >
      <div className="support-page">
        <div className="support-container">
          {/* Search and Filter Bar */}
          <div className="support-controls">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder={t('apprenant.searchTickets')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                {t('apprenant.all')}
              </button>
              <button
                className={`filter-btn ${filter === 'open' ? 'active' : ''}`}
                onClick={() => setFilter('open')}
              >
                {t('apprenant.open')}
              </button>
              <button
                className={`filter-btn ${filter === 'resolved' ? 'active' : ''}`}
                onClick={() => setFilter('resolved')}
              >
                {t('apprenant.resolved')}
              </button>
            </div>
          </div>

          {/* Tickets List */}
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{t('apprenant.loadingTickets')}</p>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="empty-state">
              <FaComment className="empty-icon" />
              <h3>{t('apprenant.noTicketsFound')}</h3>
              <p>{t('apprenant.noTicketsMessage')}</p>
            </div>
          ) : (
            <div className="tickets-grid">
              {filteredTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-card">
                  <div className="ticket-header">
                    <div className="ticket-id">
                      <span className="label">{t('apprenant.ticketId')}:</span>
                      <span className="value">{ticket._id}</span>
                    </div>
                    <div className="ticket-status">
                      {getStatusIcon(getTicketStatus(ticket))}
                      <span className={`status-text ${getTicketStatus(ticket)}`}>
                        {getStatusText(getTicketStatus(ticket))}
                      </span>
                    </div>
                  </div>

                  <div className="ticket-content">
                    <h4 className="ticket-subject">{ticket.name || ticket.course?.title || ticket.lastMessage?.content || t('apprenant.supportTickets')}</h4>

                    <div className="ticket-meta">
                      <span className={`priority-badge ${getPriorityColor(ticket.priority || 'medium')}`}>
                        {ticket.priority || t('apprenant.medium')}
                      </span>
                      <span className="category">{ticket.course?.title || t('apprenant.other')}</span>
                      <span className="messages-count">
                        <FaComment /> {ticket.unreadCount || 0}
                      </span>
                    </div>

                    <div className="ticket-dates">
                      <div className="date-item">
                        <span className="label">{t('apprenant.created')}:</span>
                        <span className="value">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="date-item">
                        <span className="label">{t('apprenant.lastUpdate')}:</span>
                        <span className="value">{new Date(ticket.lastMessageAt || ticket.updatedAt || ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="ticket-actions">
                    <button className="action-btn view-btn">
                      <FaEye />
                      {t('apprenant.view')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* New Ticket Modal/Form */}
        {showNewTicketForm && (
          <div className="modal-overlay" onClick={() => setShowNewTicketForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>{t('apprenant.createNewTicket')}</h3>
                <button
                  className="close-btn"
                  onClick={() => setShowNewTicketForm(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <form onSubmit={handleNewTicketSubmit} className="new-ticket-form">
                <div className="form-group">
                  <label>{t('apprenant.subject')}</label>
                  <input
                    type="text"
                    value={newTicket.subject}
                    onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t('apprenant.category')}</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                    >
                      <option value="technical">{t('apprenant.technical')}</option>
                      <option value="billing">{t('apprenant.billing')}</option>
                      <option value="certificate">{t('apprenant.certificate')}</option>
                      <option value="other">{t('apprenant.other')}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>{t('apprenant.priority')}</label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                    >
                      <option value="low">{t('apprenant.low')}</option>
                      <option value="medium">{t('apprenant.medium')}</option>
                      <option value="high">{t('apprenant.high')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>{t('apprenant.message')}</label>
                  <textarea
                    value={newTicket.message}
                    onChange={(e) => setNewTicket({...newTicket, message: e.target.value})}
                    rows={5}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="button" className="cancel-btn" onClick={() => setShowNewTicketForm(false)}>
                    {t('apprenant.cancel')}
                  </button>
                  <button type="submit" className="submit-btn">
                    {t('apprenant.submitTicket')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantSupport;