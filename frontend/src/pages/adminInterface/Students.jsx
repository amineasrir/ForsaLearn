import React, { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/students-admin.css';
import { 
  FaSearch, 
  FaFilter, 
  FaUserPlus,
  FaEye,
  FaEnvelope,
  FaPhone,
  FaBookOpen,
  FaGraduationCap,
  FaTrophy,
  FaCertificate,
  FaHeart,
  FaChartLine,
  FaUsers,
  FaClock,
  FaCheckCircle,
  FaSpinner
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';

const Students = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterProgress, setFilterProgress] = useState('all');

  // Sample students data based on the schema
  const studentsData = [
    {
      _id: '1',
      fullName: 'John Smith',
      email: 'john.smith@example.com',
      phoneNumber: '1234567890',
      profilePicture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      language: 'en',
      isActive: true,
      isEmailVerified: true,
      skillsNeeded: ['JavaScript', 'React', 'Node.js'],
      interests: ['Web Development', 'Mobile Development'],
      enrolledCourses: [
        {
          course: { _id: '1', title: 'Complete Web Development' },
          enrolledAt: new Date('2024-01-15'),
          progress: 75,
          completed: false
        },
        {
          course: { _id: '2', title: 'React Advanced Course' },
          enrolledAt: new Date('2024-02-01'),
          progress: 100,
          completed: true,
          completedAt: new Date('2024-02-28'),
          certificateIssued: true,
          certificateUrl: '/certificates/cert1.pdf'
        },
        {
          course: { _id: '3', title: 'Node.js Masterclass' },
          enrolledAt: new Date('2024-02-20'),
          progress: 30,
          completed: false
        }
      ],
      wishlist: ['4', '5'],
      totalCoursesCompleted: 1,
      createdAt: new Date('2024-01-10')
    },
    {
      _id: '2',
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phoneNumber: '9876543210',
      profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      language: 'en',
      isActive: true,
      isEmailVerified: true,
      skillsNeeded: ['Python', 'Data Analysis', 'Machine Learning'],
      interests: ['Data Science', 'AI'],
      enrolledCourses: [
        {
          course: { _id: '6', title: 'Data Science with Python' },
          enrolledAt: new Date('2024-01-20'),
          progress: 90,
          completed: false
        },
        {
          course: { _id: '7', title: 'Machine Learning A-Z' },
          enrolledAt: new Date('2024-02-10'),
          progress: 45,
          completed: false
        }
      ],
      wishlist: ['8'],
      totalCoursesCompleted: 2,
      createdAt: new Date('2024-01-15')
    },
    {
      _id: '3',
      fullName: 'Ahmed Ali',
      email: 'ahmed.ali@example.com',
      phoneNumber: '5551234567',
      profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      language: 'fr',
      isActive: true,
      isEmailVerified: false,
      skillsNeeded: ['UI/UX', 'Figma', 'Design'],
      interests: ['Design', 'Creative'],
      enrolledCourses: [
        {
          course: { _id: '9', title: 'UI/UX Design Masterclass' },
          enrolledAt: new Date('2024-02-05'),
          progress: 100,
          completed: true,
          completedAt: new Date('2024-02-25'),
          certificateIssued: true,
          certificateUrl: '/certificates/cert2.pdf'
        }
      ],
      wishlist: ['10', '11', '12'],
      totalCoursesCompleted: 1,
      createdAt: new Date('2024-02-01')
    },
    {
      _id: '4',
      fullName: 'Emily Chen',
      email: 'emily.chen@example.com',
      phoneNumber: '4445556666',
      profilePicture: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      language: 'en',
      isActive: false,
      isEmailVerified: true,
      skillsNeeded: ['Marketing', 'SEO', 'Content'],
      interests: ['Digital Marketing', 'Business'],
      enrolledCourses: [
        {
          course: { _id: '13', title: 'Digital Marketing Complete' },
          enrolledAt: new Date('2024-01-25'),
          progress: 15,
          completed: false
        }
      ],
      wishlist: [],
      totalCoursesCompleted: 0,
      createdAt: new Date('2024-01-20')
    },
    {
      _id: '5',
      fullName: 'Mohammed Hassan',
      email: 'mohammed.hassan@example.com',
      phoneNumber: '7778889999',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      language: 'fr',
      isActive: true,
      isEmailVerified: true,
      skillsNeeded: ['JavaScript', 'TypeScript', 'Angular'],
      interests: ['Web Development', 'Frontend'],
      enrolledCourses: [
        {
          course: { _id: '14', title: 'Angular Complete Guide' },
          enrolledAt: new Date('2024-02-15'),
          progress: 60,
          completed: false
        },
        {
          course: { _id: '15', title: 'TypeScript Fundamentals' },
          enrolledAt: new Date('2024-02-20'),
          progress: 100,
          completed: true,
          completedAt: new Date('2024-03-01'),
          certificateIssued: false
        }
      ],
      wishlist: ['16'],
      totalCoursesCompleted: 3,
      createdAt: new Date('2024-02-10')
    },
    {
      _id: '6',
      fullName: 'Lisa Anderson',
      email: 'lisa.anderson@example.com',
      phoneNumber: '2223334444',
      profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
      language: 'en',
      isActive: true,
      isEmailVerified: true,
      skillsNeeded: ['Photography', 'Lightroom', 'Photoshop'],
      interests: ['Photography', 'Creative Arts'],
      enrolledCourses: [
        {
          course: { _id: '17', title: 'Photography Masterclass' },
          enrolledAt: new Date('2024-01-30'),
          progress: 100,
          completed: true,
          completedAt: new Date('2024-02-28'),
          certificateIssued: true,
          certificateUrl: '/certificates/cert3.pdf'
        },
        {
          course: { _id: '18', title: 'Lightroom Editing' },
          enrolledAt: new Date('2024-02-25'),
          progress: 35,
          completed: false
        }
      ],
      wishlist: ['19', '20'],
      totalCoursesCompleted: 1,
      createdAt: new Date('2024-01-25')
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'verified', label: 'Email Verified' },
    { value: 'unverified', label: 'Email Not Verified' }
  ];

  const progressOptions = [
    { value: 'all', label: 'All Progress' },
    { value: 'beginner', label: 'Beginner (0-25%)' },
    { value: 'intermediate', label: 'Intermediate (26-75%)' },
    { value: 'advanced', label: 'Advanced (76-99%)' },
    { value: 'completed', label: 'Completed (100%)' }
  ];

  // Filter students
  const filteredStudents = studentsData.filter(student => {
    const matchesSearch = student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = true;
    if (filterStatus === 'active') matchesStatus = student.isActive;
    else if (filterStatus === 'inactive') matchesStatus = !student.isActive;
    else if (filterStatus === 'verified') matchesStatus = student.isEmailVerified;
    else if (filterStatus === 'unverified') matchesStatus = !student.isEmailVerified;
    
    let matchesProgress = true;
    if (filterProgress !== 'all') {
      const avgProgress = student.enrolledCourses.reduce((sum, c) => sum + c.progress, 0) / 
                         (student.enrolledCourses.length || 1);
      
      if (filterProgress === 'beginner') matchesProgress = avgProgress <= 25;
      else if (filterProgress === 'intermediate') matchesProgress = avgProgress > 25 && avgProgress <= 75;
      else if (filterProgress === 'advanced') matchesProgress = avgProgress > 75 && avgProgress < 100;
      else if (filterProgress === 'completed') matchesProgress = avgProgress === 100;
    }
    
    return matchesSearch && matchesStatus && matchesProgress;
  });

  // Calculate statistics
  const stats = {
    total: studentsData.length,
    active: studentsData.filter(s => s.isActive).length,
    verified: studentsData.filter(s => s.isEmailVerified).length,
    totalEnrolled: studentsData.reduce((sum, s) => sum + s.enrolledCourses.length, 0),
    totalCompleted: studentsData.reduce((sum, s) => sum + s.totalCoursesCompleted, 0),
    certificatesIssued: studentsData.reduce((sum, s) => 
      sum + s.enrolledCourses.filter(c => c.certificateIssued).length, 0
    )
  };

  // Get average progress for a student
  const getAverageProgress = (enrolledCourses) => {
    if (enrolledCourses.length === 0) return 0;
    const total = enrolledCourses.reduce((sum, course) => sum + course.progress, 0);
    return Math.round(total / enrolledCourses.length);
  };

  // Get progress status
  const getProgressStatus = (progress) => {
    if (progress === 0) return { label: 'Not Started', class: 'not-started' };
    if (progress < 25) return { label: 'Just Started', class: 'just-started' };
    if (progress < 50) return { label: 'In Progress', class: 'in-progress' };
    if (progress < 75) return { label: 'Halfway', class: 'halfway' };
    if (progress < 100) return { label: 'Almost Done', class: 'almost-done' };
    return { label: 'Completed', class: 'completed' };
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="dashboard">
      <Header title='Students'/> 
      
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
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{stats.total}</p>
                <p className="stat-subtext">
                  {stats.active} Active • {stats.verified} Verified
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Total Enrollments</span>
                </div>
                <p className="stat-value">{stats.totalEnrolled}</p>
                <p className="stat-subtext">Across all courses</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaTrophy />
                  </div>
                  <span className="stat-label">Completed Courses</span>
                </div>
                <p className="stat-value">{stats.totalCompleted}</p>
                <p className="stat-subtext">Successfully finished</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaCertificate />
                  </div>
                  <span className="stat-label">Certificates Issued</span>
                </div>
                <p className="stat-value">{stats.certificatesIssued}</p>
                <p className="stat-subtext">Total awarded</p>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="chart-card">
              <div className="courses-filters">
                <div className="search-box">
                  <FaSearch className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search students..."
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
                      value={filterProgress}
                      onChange={(e) => setFilterProgress(e.target.value)}
                      className="filter-select"
                    >
                      {progressOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Students Grid */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  All Students ({filteredStudents.length})
                </h3>
              </div>

              <div className="students-grid">
                {filteredStudents.map(student => {
                  const avgProgress = getAverageProgress(student.enrolledCourses);
                  const progressStatus = getProgressStatus(avgProgress);

                  return (
                    <div key={student._id} className="student-card">
                      <div className="student-header">
                        <div className="student-avatar-wrapper">
                          <img 
                            src={student.profilePicture} 
                            alt={student.fullName}
                            className="student-avatar"
                          />
                          <div className={`student-status-dot ${student.isActive ? 'active' : 'inactive'}`}></div>
                        </div>

                        <div className="student-badges">
                          {student.isEmailVerified ? (
                            <span className="student-badge verified">
                              <FaCheckCircle /> Verified
                            </span>
                          ) : (
                            <span className="student-badge unverified">
                              <FaClock /> Unverified
                            </span>
                          )}
                          <span className="student-badge language">
                            {student.language.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="student-body">
                        <h3 className="student-name">{student.fullName}</h3>
                        <p className="student-joined">
                          <FaClock /> Joined {formatDate(student.createdAt)}
                        </p>

                        <div className="student-contact">
                          <div className="contact-item">
                            <FaEnvelope />
                            <span>{student.email}</span>
                          </div>
                          <div className="contact-item">
                            <FaPhone />
                            <span>{student.phoneNumber}</span>
                          </div>
                        </div>

                        {/* Progress Overview */}
                        <div className="student-progress-section">
                          <div className="progress-header">
                            <span className="progress-label">Overall Progress</span>
                            <span className={`progress-status ${progressStatus.class}`}>
                              {progressStatus.label}
                            </span>
                          </div>
                          <div className="progress-bar-wrapper">
                            <div 
                              className="progress-bar-fill"
                              style={{ width: `${avgProgress}%` }}
                            ></div>
                          </div>
                          <span className="progress-percentage">{avgProgress}%</span>
                        </div>

                        {/* Stats Row */}
                        <div className="student-stats-row">
                          <div className="student-stat">
                            <FaBookOpen />
                            <div>
                              <span className="stat-number">{student.enrolledCourses.length}</span>
                              <span className="stat-text">Enrolled</span>
                            </div>
                          </div>
                          <div className="student-stat">
                            <FaGraduationCap />
                            <div>
                              <span className="stat-number">{student.totalCoursesCompleted}</span>
                              <span className="stat-text">Completed</span>
                            </div>
                          </div>
                          <div className="student-stat">
                            <FaHeart />
                            <div>
                              <span className="stat-number">{student.wishlist.length}</span>
                              <span className="stat-text">Wishlist</span>
                            </div>
                          </div>
                        </div>

                        {/* Interests & Skills */}
                        {student.interests.length > 0 && (
                          <div className="student-interests">
                            <label>Interests:</label>
                            <div className="interest-tags">
                              {student.interests.slice(0, 2).map((interest, index) => (
                                <span key={index} className="interest-tag">{interest}</span>
                              ))}
                              {student.interests.length > 2 && (
                                <span className="interest-tag more">+{student.interests.length - 2}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {student.skillsNeeded.length > 0 && (
                          <div className="student-skills">
                            <label>Learning:</label>
                            <div className="skill-tags">
                              {student.skillsNeeded.slice(0, 3).map((skill, index) => (
                                <span key={index} className="skill-tag-small">{skill}</span>
                              ))}
                              {student.skillsNeeded.length > 3 && (
                                <span className="skill-tag-small more">+{student.skillsNeeded.length - 3}</span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Certificates */}
                        {student.enrolledCourses.some(c => c.certificateIssued) && (
                          <div className="student-certificates">
                            <FaCertificate />
                            <span>
                              {student.enrolledCourses.filter(c => c.certificateIssued).length} Certificate(s) Earned
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="student-footer">
                        <button className="student-btn view">
                          <FaEye /> View Details
                        </button>
                        <button className="student-btn progress">
                          <FaChartLine /> Track Progress
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredStudents.length === 0 && (
                <div className="empty-state">
                  <FaUsers className="empty-icon" />
                  <h3>No students found</h3>
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

export default Students;