import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaDownload } from 'react-icons/fa';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import DashboardNavbar from '../../components/common/DashboardNavbar';
import './dashboard.css';
import logo_rem from '../../assets/image/home_page/logo_rem.png';


const sampleCertificates = [
  {
    id: '01',
    course: 'UI/UX Design Certificate',
    date: '22 Aug 2025',
    marks: 20,
    outOf: 20,
  },
  {
    id: '02',
    course: 'Wordpress Certificate',
    date: '10 Aug 2025',
    marks: 18,
    outOf: 20,
  },
  {
    id: '03',
    course: 'HTML CSS Certificate',
    date: '26 Jul 2025',
    marks: 25,
    outOf: 30,
  },
  {
    id: '04',
    course: 'JavaScript Certificate',
    date: '14 Jul 2025',
    marks: 15,
    outOf: 20,
  },
  {
    id: '05',
    course: 'Photoshop Certificate',
    date: '19 Jun 2025',
    marks: 20,
    outOf: 30,
  },
  {
    id: '06',
    course: 'Python Certificate',
    date: '12 Jun 2025',
    marks: 20,
    outOf: 20,
  },
];

const ApprenantCertificates = () => {
  const rightContent = (
    <>
      <button className="lang-btn">ENG</button>
      <div className="notification-icon"></div>
      <div className="cart-icon"></div>
    </>
  );

  return (
    <div className="apprenant-dashboard">
      <DashboardNavbar
        title="My Certificates"
        breadcrumb={[{ to: '/', label: 'Home' }, { label: 'My Certificates' }]}
        rightContent={rightContent}
      />

      <CardP />

      <div className="dashboard-container">
        <Sidebar />

        <main className="main-content">
          <section className="certificates-section">
            <h2>My Certificates</h2>
            <div className="certificates-table-container" style={{marginTop:"20px"}}>
              <table className="certificates-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Course Name</th>
                    <th>Date</th>
                    <th>Marks</th>
                    <th>Out of</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleCertificates.map(cert => (
                    <tr key={cert.id}>
                      <td>{cert.id}</td>
                      <td>{cert.course}</td>
                      <td>{cert.date}</td>
                      <td>{cert.marks}</td>
                      <td>{cert.outOf}</td>
                      <td>
                        {/* static icons only */}
                        <FaEye title="View" style={{cursor: 'pointer', marginRight: '0.5rem'}} />
                        <FaDownload title="Download" style={{cursor: 'pointer'}} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ApprenantCertificates;
