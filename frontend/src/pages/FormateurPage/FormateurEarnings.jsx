import React, { useEffect, useMemo, useState } from 'react';
import '../../styles/formateur.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';
import SidebarF from '../../components/formateur/sidebarF';
import { FaDollarSign, FaStar, FaUsers } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import {
  getFormateurDashboardStats,
  getFormateurEarnings,
  getFormateurProfile
} from '../../services/formateurService';

const formatCurrency = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0
}).format(value || 0);

const FormateurEarnings = () => {
  const [profile, setProfile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const [profileResponse, earningsResponse, statsResponse] = await Promise.all([
          getFormateurProfile(),
          getFormateurEarnings(),
          getFormateurDashboardStats()
        ]);

        setProfile(profileResponse.data?.data || null);
        setSummary(earningsResponse.data?.summary || null);
        setPayments(earningsResponse.data?.payments || []);
        setDashboardStats(statsResponse.data?.data || null);
      } catch (err) {
        setError(err.response?.data?.message || t('formateur.earnings.failedToLoadEarnings'));
      }
    };

    loadEarnings();
  }, []);

  const stats = useMemo(() => ([
    {
      icon: <FaDollarSign />,
      label: t('formateur.earnings.revenue'),
      value: formatCurrency(summary?.totalEarnings),
      sub: t('formateur.earnings.completedTransactions', { count: summary?.totalTransactions || 0 }),
      color: '#10B981'
    },
    {
      icon: <FaStar />,
      label: t('formateur.earnings.courseRatings'),
      value: dashboardStats?.overview?.averageRating || 0,
      sub: t('formateur.earnings.averageRating'),
      color: '#FFB020'
    },
    {
      icon: <FaUsers />,
      label: t('formateur.earnings.studentsEnrolled'),
      value: dashboardStats?.overview?.totalEnrollments || 0,
      sub: t('formateur.earnings.acrossCourses'),
      color: '#4F46E5'
    }
  ]), [dashboardStats?.overview?.averageRating, dashboardStats?.overview?.totalEnrollments, summary?.totalEarnings, summary?.totalTransactions, t]);

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

      <div className="formateur-container">
        <SidebarF />
        <main className="formateur-main">
          {error && <div className="alert alert-error">{error}</div>}

          <div className="earnings-section">
            <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2>{t('formateur.earnings.title')}</h2>
            </div>

            <div className="stats-grid">
              {stats.map((item) => (
                <div key={item.label} className="stat-card" style={{ borderLeftColor: item.color }}>
                  <div className="stat-icon" style={{ color: item.color, fontSize: '1.8rem' }}>{item.icon}</div>
                  <div className="stat-info">
                    <p className="stat-label">{item.label}</p>
                    <h3 className="stat-value">{item.value}</h3>
                    <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem' }}>{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3>{t('formateur.earnings.orders')}</h3>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>{t('formateur.earnings.transactionsCount', { count: payments.length })}</div>
              </div>

              <div className="courses-table" style={{ background: '#fff', borderRadius: 8, padding: '1rem' }}>
                <div className="table-header formateur-earnings-header" style={{ fontWeight: 700, padding: '0.75rem 1rem', borderBottom: '1px solid #eef2f7' }}>
                  <div>Transaction ID</div>
                  <div>Date</div>
                  <div>Course</div>
                  <div style={{ textAlign: 'right' }}>Amount</div>
                </div>
                {payments.length === 0 ? (
                  <div className="table-row formateur-earnings-row" style={{ padding: '0.75rem 1rem' }}>
                    <div>No completed payouts yet.</div>
                    <div>-</div>
                    <div>-</div>
                    <div style={{ textAlign: 'right' }}>$0</div>
                  </div>
                ) : payments.map((payment) => (
                  <div key={payment._id} className="table-row formateur-earnings-row" style={{ alignItems: 'center', padding: '0.75rem 1rem', borderBottom: '1px solid #f3f4f6' }}>
                    <div>{payment.paymentProvider?.transactionId || payment._id}</div>
                    <div>{payment.paidAt ? new Date(payment.paidAt).toLocaleDateString() : 'Pending'}</div>
                    <div>{payment.course?.title || 'Course'}</div>
                    <div style={{ textAlign: 'right' }}>{formatCurrency(payment.formateurEarnings)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FormateurEarnings;
