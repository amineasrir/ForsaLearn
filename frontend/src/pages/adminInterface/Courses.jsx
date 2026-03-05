import React, { useState } from 'react';
import '../../styles/dashboard.css';
import '../../styles/courses-admin.css';
import { 
  FaSearch, 
  FaFilter, 
  FaPlus, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaStar,
  FaUsers,
  FaClock,
  FaBookOpen,
  FaMoneyBillWave
} from 'react-icons/fa';
import Header from '../../components/admin/Header';
import Sidebar from '../../components/admin/Sidebar';
import ProfileCard from '../../components/admin/ProfileCard';

const Courses = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // Sample courses data based on the schema
  const coursesData = [
    {
      _id: '1',
      title: 'Complete Web Development Bootcamp',
      shortDescription: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
      category: 'Web Development',
      level: 'Beginner',
      language: 'English',
      price: 99.99,
      priceType: 'paid',
      discount: { percentage: 20 },
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      status: 'published',
      totalEnrollments: 234,
      averageRating: 4.5,
      totalReviews: 89,
      totalDuration: 4800,
      formateur: { name: 'John Doe' },
      sections: Array(12).fill({}),
      isPublished: true,
      isFeatured: true
    },
    {
      _id: '2',
      title: 'Data Science with Python',
      shortDescription: 'Master data analysis, visualization and machine learning',
      category: 'Data Science',
      level: 'Intermediate',
      language: 'English',
      price: 149.99,
      priceType: 'paid',
      discount: { percentage: 0 },
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
      status: 'published',
      totalEnrollments: 156,
      averageRating: 4.8,
      totalReviews: 62,
      totalDuration: 3600,
      formateur: { name: 'Jane Smith' },
      sections: Array(10).fill({}),
      isPublished: true,
      isFeatured: false
    },
    {
      _id: '3',
      title: 'UI/UX Design Masterclass',
      shortDescription: 'Learn Figma, Adobe XD and design principles',
      category: 'Design',
      level: 'All Levels',
      language: 'Arabic',
      price: 79.99,
      priceType: 'paid',
      discount: { percentage: 30 },
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
      status: 'published',
      totalEnrollments: 189,
      averageRating: 4.7,
      totalReviews: 45,
      totalDuration: 2400,
      formateur: { name: 'Ahmed Ali' },
      sections: Array(8).fill({}),
      isPublished: true,
      isFeatured: true
    },
    {
      _id: '4',
      title: 'Mobile App Development with React Native',
      shortDescription: 'Build iOS and Android apps with JavaScript',
      category: 'Mobile Development',
      level: 'Intermediate',
      language: 'English',
      price: 0,
      priceType: 'free',
      discount: { percentage: 0 },
      thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
      status: 'published',
      totalEnrollments: 421,
      averageRating: 4.6,
      totalReviews: 123,
      totalDuration: 3000,
      formateur: { name: 'Sarah Johnson' },
      sections: Array(15).fill({}),
      isPublished: true,
      isFeatured: false
    },
    {
      _id: '5',
      title: 'Digital Marketing Complete Course',
      shortDescription: 'SEO, Social Media, Content Marketing and more',
      category: 'Marketing',
      level: 'Beginner',
      language: 'French',
      price: 59.99,
      priceType: 'semi-free',
      discount: { percentage: 50 },
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      status: 'draft',
      totalEnrollments: 87,
      averageRating: 4.3,
      totalReviews: 28,
      totalDuration: 1800,
      formateur: { name: 'Marie Dupont' },
      sections: Array(6).fill({}),
      isPublished: false,
      isFeatured: false
    },
    {
      _id: '6',
      title: 'Machine Learning A-Z',
      shortDescription: 'Complete guide to ML algorithms and applications',
      category: 'Machine Learning',
      level: 'Advanced',
      language: 'English',
      price: 199.99,
      priceType: 'paid',
      discount: { percentage: 15 },
      thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
      status: 'pending',
      totalEnrollments: 92,
      averageRating: 4.9,
      totalReviews: 41,
      totalDuration: 5400,
      formateur: { name: 'Dr. Smith' },
      sections: Array(18).fill({}),
      isPublished: false,
      isFeatured: false
    }
  ];

  const categories = [
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
    { value: 'draft', label: 'Draft' },
    { value: 'pending', label: 'Pending' },
    { value: 'published', label: 'Published' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'archived', label: 'Archived' }
  ];

  // Filter courses
  const filteredCourses = coursesData.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.shortDescription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || course.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate price after discount
  const getFinalPrice = (course) => {
    if (course.priceType === 'free') return 0;
    if (course.discount.percentage > 0) {
      return course.price - (course.price * course.discount.percentage / 100);
    }
    return course.price;
  };

  // Format duration
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Get status badge class
  const getStatusClass = (status) => {
    const classes = {
      draft: 'status-draft',
      pending: 'status-pending',
      published: 'status-published',
      rejected: 'status-rejected',
      archived: 'status-archived'
    };
    return classes[status] || 'status-draft';
  };

  return (
    <div className="dashboard">
      <Header title='Courses'/>
      
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            {/* Page Header */}
            <ProfileCard />
            {/* Filters and Search */}
            <div className="chart-card">
              <div className="courses-filters">
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search courses..."
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
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="filter-select"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Total Courses</span>
                </div>
                <p className="stat-value">{coursesData.length}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">
                  {coursesData.reduce((sum, course) => sum + course.totalEnrollments, 0)}
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaStar />
                  </div>
                  <span className="stat-label">Average Rating</span>
                </div>
                <p className="stat-value">
                  {(coursesData.reduce((sum, course) => sum + course.averageRating, 0) / coursesData.length).toFixed(1)}
                </p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaMoneyBillWave />
                  </div>
                  <span className="stat-label">Total Revenue</span>
                </div>
                <p className="stat-value">$12,450</p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="chart-card">
              <div className="chart-header">
                <h3 className="chart-title">
                  All Courses ({filteredCourses.length})
                </h3>
              </div>

              <div className="courses-grid">
                {filteredCourses.map(course => (
                  <div key={course._id} className="course-card">
                    <div className="course-image-wrapper">
                      <img 
                        src={course.thumbnail} 
                        alt={course.title}
                        className="course-image"
                      />
                      {course.isFeatured && (
                        <span className="course-badge featured">Featured</span>
                      )}
                      <span className={`course-badge ${getStatusClass(course.status)}`}>
                        {course.status}
                      </span>
                      {course.discount.percentage > 0 && (
                        <span className="course-badge discount">
                          -{course.discount.percentage}%
                        </span>
                      )}
                    </div>

                    <div className="course-content">
                      <div className="course-meta">
                        <span className="course-category">{course.category}</span>
                        <span className="course-level">{course.level}</span>
                      </div>

                      <h3 className="course-title">{course.title}</h3>
                      <p className="course-description">{course.shortDescription}</p>

                      <div className="course-instructor">
                        <span>By {course.formateur.name}</span>
                      </div>

                      <div className="course-stats">
                        <div className="course-stat-item">
                          <FaUsers />
                          <span>{course.totalEnrollments}</span>
                        </div>
                        <div className="course-stat-item">
                          <FaStar />
                          <span>{course.averageRating} ({course.totalReviews})</span>
                        </div>
                        <div className="course-stat-item">
                          <FaClock />
                          <span>{formatDuration(course.totalDuration)}</span>
                        </div>
                        <div className="course-stat-item">
                          <FaBookOpen />
                          <span>{course.sections.length} sections</span>
                        </div>
                      </div>

                      <div className="course-footer">
                        <div className="course-price">
                          {course.priceType === 'free' ? (
                            <span className="price-free">Free</span>
                          ) : (
                            <>
                              {course.discount.percentage > 0 && (
                                <span className="price-original">${course.price}</span>
                              )}
                              <span className="price-current">${getFinalPrice(course).toFixed(2)}</span>
                            </>
                          )}
                        </div>

                        <div className="course-actions">
                          <button className="action-btn view" title="View">
                            <FaEye />
                          </button>
                          <button className="action-btn edit" title="Edit">
                            <FaEdit />
                          </button>
                          <button className="action-btn delete" title="Delete">
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredCourses.length === 0 && (
                <div className="empty-state">
                  <FaBookOpen className="empty-icon" />
                  <h3>No courses found</h3>
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

export default Courses;