import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/apprenant/Sidebar';
import CardP from '../../components/apprenant/CardP';
import './dashboard.css';

const userData = {
    fullName: 'Khadija essir',
    phone: '90154‑91036',
    gender: 'Male',
    bio: "Hello! I'm Ronald Richard. I'm passionate about developing innovative software solutions, analyzing classic literature. I aspire to become a software developer, work as an editor. In my free time, I enjoy coding, reading, hiking etc.",
    registrationDate: '16 Jan 2024, 11:15 AM',
    email: 'studentdemo@example.com',
};

const ApprenantProfile = () => {
    const [user, setUser] = useState(userData);
    const [editMode, setEditMode] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const saveChanges = () => {
        // here you would send user to backend
        setEditMode(false);
    };

    const cancelEdit = () => {
        setUser(userData);
        setEditMode(false);
    };

    return (
        <div className="apprenant-dashboard">
            <header className="dashboard-header">
                <div className="header-container">
                    <div className="header-left">
                        <div className="logo" />
                    </div>
                    <div className="header-right">
                        <button className="lang-btn">ENG</button>
                        <div className="notification-icon"></div>
                        <div className="cart-icon"></div>
                    </div>
                </div>

                <div className="header-center">
                    <h1>My Profile</h1>
                    <nav className="breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span>My Profile</span>
                    </nav>
                </div>
            </header>
            <CardP />
            <div className="dashboard-container">
                <Sidebar />

                <main className="main-content">
                    <div className="profile-page-content">
                        <h2 className="profile-title">
                            My Profile
                            <button
                                className="title-edit-btn"
                                onClick={() => setEditMode(v => !v)}
                                title={editMode ? 'Cancel editing' : 'Edit profile'}
                            >✎</button>
                        </h2>
                        <div className="profile-details">
                            <div>
                                <label>Full Name</label>
                                {editMode ? (
                                    <input
                                        name="fullName"
                                        value={user.fullName}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className="value">{user.fullName}</p>
                                )}
                            </div>
                            <div>
                                <label>Registration Date</label>
                                <p className="value">{user.registrationDate}</p>
                            </div>
                            <div>
                                <label>Phone Number</label>
                                {editMode ? (
                                    <input
                                        name="phone"
                                        value={user.phone}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className="value">{user.phone}</p>
                                )}
                            </div>
                            <div>
                                <label>Email</label>
                                {editMode ? (
                                    <input
                                        name="email"
                                        value={user.email}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className="value">{user.email}</p>
                                )}
                            </div>
                            <div>
                                <label>Gender</label>
                                {editMode ? (
                                    <select
                                        name="gender"
                                        value={user.gender}
                                        onChange={handleChange}
                                    >
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                ) : (
                                    <p className="value">{user.gender}</p>
                                )}
                            </div>
                            <div>
                                <label>Bio</label>
                                {editMode ? (
                                    <textarea
                                        name="bio"
                                        value={user.bio}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <p className="value">{user.bio}</p>
                                )}
                            </div>
                        </div>
                        {editMode && (
                            <div className="profile-actions">
                                <button className="save-btn" onClick={saveChanges}>Save</button>
                                <button className="cancel-btn" onClick={cancelEdit}>Cancel</button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ApprenantProfile;
