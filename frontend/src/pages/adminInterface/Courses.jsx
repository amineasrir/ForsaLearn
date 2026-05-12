import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/dashboard.css';
import '../../styles/courses-admin.css';
import {
  FaFilter,
  FaEye,
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
import { approveAdminCourse, deleteAdminCourse, getAdminCourses, getAdminProfile } from '../../services/adminService';
import { getMediaUrl } from '../../utils/mediaUrl';

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

const Courses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [coursesData, setCoursesData] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoading(true);
        const [coursesResponse, profileResponse] = await Promise.all([
          getAdminCourses({
            search: searchTerm || undefined,
            status: filterStatus !== 'all' ? filterStatus : undefined
          }),
          getAdminProfile()
        ]);

        setCoursesData(coursesResponse.data?.data || []);
        setProfile(profileResponse.data?.user || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load courses.');
      } finally {
        setLoading(false);
      }
    };

    loadCourses();
  }, [searchTerm, filterStatus]);

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => (
      filterCategory === 'all' || course.category === filterCategory
    ));
  }, [coursesData, filterCategory]);

  const getFinalPrice = (course) => {
    const discountPercentage = course.discount?.percentage || 0;
    if (course.priceType === 'free') return 0;
    if (discountPercentage > 0) {
      return course.price - (course.price * discountPercentage / 100);
    }
    return course.price || 0;
  };

  const formatDuration = (minutes = 0) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

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

  const handleDelete = async (courseId) => {
    try {
      await deleteAdminCourse(courseId);
      setCoursesData((prev) => prev.filter((course) => course._id !== courseId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete course.');
    }
  };

  const handleApprove = async (courseId) => {
    try {
      await approveAdminCourse(courseId);
      setCoursesData((prev) => prev.map((course) => (
        course._id === courseId ? { ...course, status: 'published' } : course
      )));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve course.');
    }
  };

  const totalStudents = filteredCourses.reduce((sum, course) => sum + (course.totalEnrollments || 0), 0);
  const averageRating = filteredCourses.length
    ? (filteredCourses.reduce((sum, course) => sum + Number(course.averageRating || 0), 0) / filteredCourses.length).toFixed(1)
    : '0.0';
  const totalRevenue = filteredCourses.reduce((sum, course) => sum + Number(course.totalRevenue || 0), 0);

  return (
    <div className="dashboard">
      <Header title='Courses'/>
      <div className="container main-content">
        <div className="content-wrapper">
          <aside className="sidebar">
            <Sidebar />
          </aside>

          <main className="main">
            <ProfileCard name={profile?.fullName || 'Administrator'} role="Administrateur" image={profile?.profilePicture} />

            {error && <div className="error-message">{error}</div>}

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

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple">
                    <FaBookOpen />
                  </div>
                  <span className="stat-label">Total Courses</span>
                </div>
                <p className="stat-value">{loading ? '...' : filteredCourses.length}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon cyan">
                    <FaUsers />
                  </div>
                  <span className="stat-label">Total Students</span>
                </div>
                <p className="stat-value">{loading ? '...' : totalStudents}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon pink">
                    <FaStar />
                  </div>
                  <span className="stat-label">Average Rating</span>
                </div>
                <p className="stat-value">{loading ? '...' : averageRating}</p>
              </div>

              <div className="stat-card">
                <div className="stat-header">
                  <div className="stat-icon purple-gradient">
                    <FaMoneyBillWave />
                  </div>
                  <span className="stat-label">Total Revenue</span>
                </div>
                <p className="stat-value">{loading ? '...' : `$${totalRevenue.toLocaleString()}`}</p>
              </div>
            </div>

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
                        src={getMediaUrl(course.thumbnail) || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400'}
                        alt={course.title}
                        className="course-image"
                      />
                      {course.isFeatured && (
                        <span className="course-badge featured">Featured</span>
                      )}
                      <span className={`course-badge ${getStatusClass(course.status)}`}>
                        {course.status}
                      </span>
                      {(course.discount?.percentage || 0) > 0 && (
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
                      <p className="course-description">{course.shortDescription || course.description}</p>

                      <div className="course-instructor">
                        <span>By {course.formateur?.fullName || 'Unknown Instructor'}</span>
                      </div>

                      <div className="course-stats">
                        <div className="course-stat-item">
                          <FaUsers />
                          <span>{course.totalEnrollments || 0}</span>
                        </div>
                        <div className="course-stat-item">
                          <FaStar />
                          <span>{Number(course.averageRating || 0).toFixed(1)} ({course.totalReviews || 0})</span>
                        </div>
                        <div className="course-stat-item">
                          <FaClock />
                          <span>{formatDuration(course.totalDuration || 0)}</span>
                        </div>
                        <div className="course-stat-item">
                          <FaBookOpen />
                          <span>{course.sections?.length || 0} sections</span>
                        </div>
                      </div>

                      <div className="course-footer">
                        <div className="course-price">
                          {course.priceType === 'free' ? (
                            <span className="price-free">Free</span>
                          ) : (
                            <>
                              {(course.discount?.percentage || 0) > 0 && (
                                <span className="price-original">${Number(course.price || 0).toFixed(2)}</span>
                              )}
                              <span className="price-current">${getFinalPrice(course).toFixed(2)}</span>
                            </>
                          )}
                        </div>

                        <div className="course-actions">
                          {course.status === 'pending' && (
                            <button className="action-btn approve" title="Approve" onClick={() => handleApprove(course._id)}>
                              Approve
                            </button>
                          )}
                          <button className="action-btn view" title="View" onClick={() => navigate(`/admin/courses/${course._id}`)}>
                            <FaEye />
                          </button>
                          <button className="action-btn delete" title="Delete" onClick={() => handleDelete(course._id)}>
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!loading && filteredCourses.length === 0 && (
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
