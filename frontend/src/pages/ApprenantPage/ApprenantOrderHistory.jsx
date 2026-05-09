import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaDownload, FaEye, FaCalendar, FaCreditCard, FaCheckCircle, FaClock, FaTimesCircle, FaHistory } from 'react-icons/fa';
import ApprenantLayout from '../../components/apprenant/ApprenantLayout';
import API from '../../api/axios';
import './dashboard.css';

const ApprenantOrderHistory = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const response = await API.get('/payment/my-payments');
        setOrders(response.data.data || []);
      } catch (error) {
        console.error('Error fetching order history:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="status-icon completed" />;
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'failed':
        return <FaTimesCircle className="status-icon failed" />;
      default:
        return <FaClock className="status-icon pending" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t('apprenant.completed');
      case 'pending':
        return t('apprenant.pending');
      case 'failed':
        return t('apprenant.failed');
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const rightContent = (
    <div className="filter-buttons">
      <button
        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        onClick={() => setFilter('all')}
      >
        {t('apprenant.all')}
      </button>
      <button
        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
        onClick={() => setFilter('completed')}
      >
        {t('apprenant.completed')}
      </button>
      <button
        className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
        onClick={() => setFilter('pending')}
      >
        {t('apprenant.pending')}
      </button>
    </div>
  );

  return (
    <ApprenantLayout
      title={t('apprenant.orderHistory')}
      breadcrumb={[{ to: '/', label: t('home') }, { label: t('apprenant.orderHistory') }]}
      rightContent={rightContent}
    >
      <div className="order-history-page">
        <div className="orders-container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>{t('apprenant.loadingOrders')}</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="empty-state">
              <FaHistory className="empty-icon" />
              <h3>{t('apprenant.noOrdersFound')}</h3>
              <p>{t('apprenant.noOrdersMessage')}</p>
            </div>
          ) : (
            <div className="orders-grid">
              {filteredOrders.map((order) => (
                <div key={order._id} className="order-card">
                  <div className="order-header">
                    <div className="order-id">
                      <span className="label">{t('apprenant.orderId')}:</span>
                      <span className="value">{order._id}</span>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span className={`status-text ${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-content">
                    <h4 className="course-name">{order.course?.title || t('apprenant.unknownCourse')}</h4>

                    <div className="order-details">
                      <div className="detail-item">
                        <FaCalendar className="detail-icon" />
                        <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <FaCreditCard className="detail-icon" />
                        <span>{order.paymentMethod}</span>
                      </div>
                    </div>

                    <div className="order-amount">
                      <span className="amount">{order.amount?.currency || 'USD'} {order.amount?.final?.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="order-actions">
                    <button className="action-btn view-btn">
                      <FaEye />
                      {t('apprenant.view')}
                    </button>
                    {order.status === 'completed' && (
                      <button className="action-btn download-btn">
                        <FaDownload />
                        {t('apprenant.downloadInvoice')}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ApprenantLayout>
  );
};

export default ApprenantOrderHistory;