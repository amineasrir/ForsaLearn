import React, { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/instructors-admin.css';
import { 
  FaSearch, 
  FaFilter, 
  FaUserPlus, 
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaUsers,
  FaMoneyBillWave,
  FaBookOpen,
  FaCertificate,
  FaProjectDiagram,
  FaEnvelope,
  FaPhone,
  FaGraduationCap
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';

const Instructors = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterField, setFilterField] = useState('all');

  // Sample instructors data based on the schema
  const instructorsData = [
    {
      _id: '1',
      fullName: 'Dr. Ahmed Hassan',
      email: 'ahmed.hassan@example.com',
      phoneNumber: '1234567890',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      language: 'en',
      field: 'Web Development',
      skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
      bio: 'Experienced full-stack developer with 10+ years in the industry. Passionate about teaching and helping students achieve their goals.',
      isApproved: true,
      isActive: true,
      totalEarnings: 15420,
      totalStudents: 342,
      rating: 4.8,
      totalReviews: 156,
      certificates: [
        { name: 'AWS Certified Developer', type: 'link' },
        { name: 'React Certification', type: 'file' }
      ],
      projects: [
        { title: 'E-commerce Platform', type: 'link' },
        { title: 'Social Media App', type: 'link' }
      ],
      approvedAt: new Date('2024-01-15')
    },
    {
      _id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '9876543210',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      language: 'en',
      field: 'Data Science',
      skills: ['Python', 'Machine Learning', 'TensorFlow', 'SQL', 'Data Analysis'],
      bio: 'Data scientist specializing in machine learning and AI. Former researcher with multiple publications.',
      isApproved: true,
      isActive: true,
      totalEarnings: 22150,
      totalStudents: 289,
      rating: 4.9,
      totalReviews: 132,
      certificates: [
        { name: 'Google Data Analytics', type: 'link' },
        { name: 'IBM Data Science', type: 'file' }
      ],
      projects: [
        { title: 'Predictive Analytics System', type: 'link' },
        { title: 'Customer Segmentation Tool', type: 'file' }
      ],
      approvedAt: new Date('2024-02-10')
    },
    {
      _id: '3',
      fullName: 'Mohammed Ali',
      email: 'mohammed.ali@example.com',
      phoneNumber: '5551234567',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      language: 'fr',
      field: 'Design',
      skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'Photoshop', 'Illustrator'],
      bio: 'Creative designer with a passion for creating beautiful and functional user experiences.',
      isApproved: false,
      isActive: true,
      totalEarnings: 0,
      totalStudents: 0,
      rating: 0,
      totalReviews: 0,
      certificates: [
        { name: 'Google UX Design', type: 'link' }
      ],
      projects: [
        { title: 'Mobile App Redesign', type: 'link' },
        { title: 'Brand Identity System', type: 'file' }
      ],
      approvedAt: null
    },
    {
      _id: '4',
      fullName: 'Emily Chen',
      email: 'emily.chen@example.com',
      phoneNumber: '4445556666',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      language: 'en',
      field: 'Marketing',
      skills: ['Digital Marketing', 'SEO', 'Content Strategy', 'Social Media', 'Analytics'],
      bio: 'Marketing expert with proven track record in growing online businesses and brands.',
      isApproved: true,
      isActive: true,
      totalEarnings: 18900,
      totalStudents: 425,
      rating: 4.7,
      totalReviews: 201,
      certificates: [
        { name: 'Google Ads Certification', type: 'link' },
        { name: 'HubSpot Inbound Marketing', type: 'link' }
      ],
      projects: [
        { title: 'Marketing Campaign Case Study', type: 'file' }
      ],
      approvedAt: new Date('2024-01-20')
    },
    {
      _id: '5',
      fullName: 'David Martinez',
      email: 'david.martinez@example.com',
      phoneNumber: '7778889999',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      language: 'en',
      field: 'Mobile Development',
      skills: ['React Native', 'Flutter', 'iOS', 'Android', 'Swift'],
      bio: 'Mobile app developer specializing in cross-platform development and native apps.',
      isApproved: true,
      isActive: false,
      totalEarnings: 12300,
      totalStudents: 178,
      rating: 4.6,
      totalReviews: 89,
      certificates: [
        { name: 'Apple Developer Certification', type: 'file' }
      ],
      projects: [
        { title: 'Fitness Tracking App', type: 'link' },
        { title: 'Food Delivery App', type: 'link' }
      ],
      approvedAt: new Date('2023-12-05')
    },
    {
      _id: '6',
      fullName: 'Fatima Zahra',
      email: 'fatima.zahra@example.com',
      phoneNumber: '2223334444',
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      language: 'fr',
      field: 'Business',
      skills: ['Entrepreneurship', 'Business Strategy', 'Finance', 'Leadership', 'Management'],
      bio: 'Business consultant and entrepreneur with experience in startups and corporate strategy.',
      isApproved: false,
      isActive: true,
      totalEarnings: 0,
      totalStudents: 0,
      rating: 0,
      totalReviews: 0,
      certificates: [
        { name: 'MBA Certificate', type: 'file' },
        { name: 'Project Management Professional', type: 'link' }
      ],
      projects: [
        { title: 'Business Plan Template', type: 'file' }
      ],
      approvedAt: null,
      rejectionReason: null
    }
  ];

  const fields = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'Design',
    'Marketing',
    'Business',
    'Photography',
    'Music',
    'Language Learning',
    'Other'
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending Approval' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' }
  ];

  // Filter instructors
  const filteredInstructors = instructorsData.filter(instructor => {
    const matchesSearch = instructor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         instructor.field.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'approved') matchesStatus = instructor.isApproved;
    else if (filterStatus === 'pending') matchesStatus = !instructor.isApproved;
    else if (filterStatus === 'active') matchesStatus = instructor.isActive;
    else if (filterStatus === 'inactive') matchesStatus = !instructor.isActive;
    
    const matchesField = filterField === 'all' || instructor.field === filterField;
    
    return matchesSearch && matchesStatus && matchesField;
  });

  // Calculate statistics
  const stats = {
    total: instructorsData.length,
    approved: instructorsData.filter(i => i.isApproved).length,
    pending: instructorsData.filter(i => !i.isApproved).length,
    active: instructorsData.filter(i => i.isActive).length,
    totalStudents: instructorsData.reduce((sum, i) => sum + i.totalStudents, 0),
    totalEarnings: instructorsData.reduce((sum, i) => sum + i.totalEarnings, 0),
    averageRating: (instructorsData.reduce((sum, i) => sum + i.rating, 0) / instructorsData.filter(i => i.rating > 0).length).toFixed(1)
  };

  return (
    <div className="dashboard">
      <Header title='Instructors'/>
      
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            {/* Page Header */}
            <ProfileCard />
            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaGraduationCap />
                  </div>
                  <span className="stat-label">Total Instructors</span>
                </div>
                <p className="stat-value">{stats.total}</p>
                <p className="stat-subtext">
                  {stats.approved} Approved • {stats.pending} Pending
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{stats.totalStudents}</p>
                <p className="stat-subtext">Across all instructors</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaStar />
                  </div>
                  <span className="stat-label">Average Rating</span>
                </div>
                <p className="stat-value">{stats.averageRating}</p>
                <p className="stat-subtext">Based on reviews</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaMoneyBillWave />
                  </div>
                  <span className="stat-label">Total Earnings</span>
                </div>
                <p className="stat-value">${stats.totalEarnings.toLocaleString()}</p>
                <p className="stat-subtext">Platform revenue</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="chart-card">
              <div className="courses-filters">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search instructors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <div className="filter-item">
                    <FaFilter className="filter-icon" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="filter-select"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="filter-item">
                    <select
                      value={filterField}
                      onChange={(e) => setFilterField(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Fields</option>
                      {fields.map(field => (
                        <option key={field} value={field}>
                          {field}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructors Grid */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  All Instructors ({filteredInstructors.length})
                </h3>
              </div>

              <div className="instructors-grid">
                {filteredInstructors.map(instructor => (
                  <div key={instructor._id} className="instructor-card">
                    <div className="instructor-header">
                      <div className="instructor-avatar-wrapper">
                        <img 
                          src={instructor.profilePicture} 
                          alt={instructor.fullName}
                          className="instructor-avatar"
                        />
                        <div className={`instructor-status-dot ${instructor.isActive ? 'active' : 'inactive'}`}></div>
                      </div>

                      <div className="instructor-badges">
                        {instructor.isApproved ? (
                          <span className="instructor-badge approved">
                            <FaCheckCircle /> Approved
                          </span>
                        ) : (
                          <span className="instructor-badge pending">
                            <FaTimesCircle /> Pending
                          </span>
                        )}
                        <span className="instructor-badge language">
                          {instructor.language.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    <div className="instructor-body">
                      <h3 className="instructor-name">{instructor.fullName}</h3>
                      <p className="instructor-field">
                        <FaBookOpen /> {instructor.field}
                      </p>
                      
                      <p className="instructor-bio">{instructor.bio}</p>

                      <div className="instructor-skills">
                        {instructor.skills.slice(0, 3).map((skill, index) => (
                          <span key={index} className="skill-tag">{skill}</span>
                        ))}
                        {instructor.skills.length > 3 && (
                          <span className="skill-tag more">+{instructor.skills.length - 3}</span>
                        )}
                      </div>

                      <div className="instructor-contact">
                        <div className="contact-item">
                          <FaEnvelope />
                          <span>{instructor.email}</span>
                        </div>
                        <div className="contact-item">
                          <FaPhone />
                          <span>{instructor.phoneNumber}</span>
                        </div>
                      </div>

                      <div className="instructor-stats-row">
                        <div className="instructor-stat">
                          <FaUsers />
                          <div>
                            <span className="stat-number">{instructor.totalStudents}</span>
                            <span className="stat-text">Students</span>
                          </div>
                        </div>
                        <div className="instructor-stat">
                          <FaStar />
                          <div>
                            <span className="stat-number">
                              {instructor.rating > 0 ? instructor.rating.toFixed(1) : 'N/A'}
                            </span>
                            <span className="stat-text">Rating</span>
                          </div>
                        </div>
                        <div className="instructor-stat">
                          <FaMoneyBillWave />
                          <div>
                            <span className="stat-number">${instructor.totalEarnings.toLocaleString()}</span>
                            <span className="stat-text">Earnings</span>
                          </div>
                        </div>
                      </div>

                      <div className="instructor-resources">
                        <div className="resource-item">
                          <FaCertificate />
                          <span>{instructor.certificates.length} Certificates</span>
                        </div>
                        <div className="resource-item">
                          <FaProjectDiagram />
                          <span>{instructor.projects.length} Projects</span>
                        </div>
                      </div>
                    </div>

                    <div className="instructor-footer">
                      <button className="instructor-btn view">
                        <FaEye /> View Profile
                      </button>
                      {!instructor.isApproved && (
                        <>
                          <button className="instructor-btn approve">
                            <FaCheckCircle /> Approve
                          </button>
                          <button className="instructor-btn reject">
                            <FaTimesCircle /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {filteredInstructors.length === 0 && (
                <div className="empty-state">
                  <FaGraduationCap className="empty-icon" />
                  <h3>No instructors found</h3>
                  <p>Try adjusting your search or filters</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Instructors;