// src/app/admin/settings/page.jsx (Restored email placement above "edit profile" button and fixed backend field synchronization)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

const Icons = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  analytics: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  ),
  map: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
  ),
  complaints: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  residents: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  ),
  tenant: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  ),
  settings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  ),
  logout: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  ),
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
  ),
  userOutline: (
    <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )
};

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Icons.dashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Icons.analytics },
  { label: 'Map', href: '/admin/map', icon: Icons.map },
  { label: 'Complaints', href: '/admin/complaints', icon: Icons.complaints },
  { label: 'Residents', href: '/admin/residents', icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant_management', icon: Icons.tenant },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    userId: '',
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    systemRole: 'ADMIN',
    accountStatus: 'ACTIVE'
  });

  useEffect(() => {
    async function fetchAdminSettings() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/settings');
        const json = await res.json();
        if (json.success && json.data) {
          setFormData(json.data);
        }
      } catch (err) {
        console.error('Failed to load admin settings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdminSettings();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const json = await res.json();
      if (json.success) {
        alert('Admin details updated successfully!');
        setIsEditing(false);
      } else {
        alert(json.message || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      alert('An error occurred while updating.');
    }
  };

  if (loading) return <div className="layout-wrapper"><div className="main-container"><p style={{padding: '40px'}}>Loading settings...</p></div></div>;

  const adminFullName = `${formData.firstName} ${formData.lastName}`.trim() || 'Admin';
  const adminInitials = `${formData.firstName?.[0] || 'A'}${formData.lastName?.[0] || 'D'}`;

  return (
    <div className="layout-wrapper">
      <div className="main-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand-header">
            <svg className="official-brand-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L4 10V20C4 29.5 10.8 38.1 20 40C29.2 38.1 36 29.5 36 20V10L20 2Z" fill="#065F46"/>
              <path d="M20 8L8 14V20C8 27.2 13.1 33.8 20 35.5C26.9 33.8 32 27.2 32 20V14L20 8Z" fill="#10B981"/>
              <path d="M14 20L18 24L26 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="brand-text">
              <strong>ZoneGuard</strong>
              <span>NIA VILLAGE SUBD.</span>
            </div>
          </div>

          <nav className="nav-menu">
            {sidebarItems.map((item) => (
              <Link key={item.label} href={item.href} className="nav-link">
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-divider"></div>
            <Link href="/admin/settings" className="nav-link active">
              <span className="nav-icon">{Icons.settings}</span>
              Account Settings
            </Link>
            <button className="nav-link btn-logout">
              <span className="nav-icon">{Icons.logout}</span>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          <header className="topbar">
            <div className="search-bar-large">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" placeholder="Search here..." autoComplete="off" name="global_search_noop" />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{adminFullName}</span>
                <span className="user-role">ADMINISTRATOR</span>
              </div>
              <div className="user-avatar">{adminInitials}</div>
            </div>
          </header>

          {/* PAGE TITLE & TABS */}
          <div className="settings-header">
            <h1 className="settings-title">Account Settings</h1>

            <div className="tab-pill-group">
              <button
                onClick={() => setActiveTab('profile')}
                className={`tab-btn ${activeTab === 'profile' ? 'active-tab' : 'light-tab'}`}
              >
                Profile Settings
              </button>
              <button
                onClick={() => setActiveTab('privacy')}
                className={`tab-btn ${activeTab === 'privacy' ? 'active-tab' : 'light-tab'}`}
              >
                Privacy Settings
              </button>
            </div>
          </div>

          {/* TWO-COLUMN GRID CONTENT */}
          <div className="settings-grid">
            {/* MAIN FORM CARD */}
            <div className="settings-form-card">
              {activeTab === 'profile' ? (
                <form onSubmit={handleSaveProfile} autoComplete="off">
                  <div className="form-sections-row">
                    <div className="section-column">
                      <h3 className="settings-section-heading">ADMIN IDENTITY</h3>
                      <div className="settings-fields-group">
                        <div>
                          <label className="settings-label">FIRST NAME</label>
                          <input 
                            type="text" 
                            name="firstName"
                            value={formData.firstName} 
                            onChange={handleChange}
                            readOnly={!isEditing} 
                            className="settings-input" 
                          />
                        </div>
                        <div>
                          <label className="settings-label">MIDDLE NAME</label>
                          <input 
                            type="text" 
                            name="middleName"
                            value={formData.middleName} 
                            onChange={handleChange}
                            readOnly={!isEditing} 
                            className="settings-input" 
                          />
                        </div>
                        <div>
                          <label className="settings-label">LAST NAME</label>
                          <input 
                            type="text" 
                            name="lastName"
                            value={formData.lastName} 
                            onChange={handleChange}
                            readOnly={!isEditing} 
                            className="settings-input" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="section-column">
                      <h3 className="settings-section-heading">CREDENTIALS & CONTACT</h3>
                      <div className="settings-fields-group">
                        <div>
                          <label className="settings-label">EMAIL ADDRESS</label>
                          <input 
                            type="text" 
                            name="email"
                            value={formData.email} 
                            onChange={handleChange}
                            readOnly={!isEditing} 
                            className="settings-input" 
                          />
                        </div>
                        <div>
                          <label className="settings-label">PHONE NUMBER</label>
                          <div className="phone-input-wrapper">
                            <span className="phone-prefix">+63</span>
                            <input 
                              type="text" 
                              name="phoneNumber"
                              value={formData.phoneNumber} 
                              onChange={handleChange}
                              readOnly={!isEditing} 
                              className="settings-input flex-1" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="settings-label">DATE OF BIRTH</label>
                          <input 
                            type="text" 
                            name="dateOfBirth"
                            value={formData.dateOfBirth} 
                            onChange={handleChange}
                            readOnly={!isEditing} 
                            className="settings-input" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="settings-sub-section">
                    <h3 className="settings-section-heading">SYSTEM METADATA</h3>
                    <div className="address-grid-top">
                      <div>
                        <label className="settings-label">USER ID</label>
                        <input 
                          type="text" 
                          value={formData.userId} 
                          readOnly 
                          className="settings-input" 
                          style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
                        />
                      </div>
                      <div>
                        <label className="settings-label">SYSTEM ROLE</label>
                        <input 
                          type="text" 
                          value={formData.systemRole} 
                          readOnly 
                          className="settings-input" 
                          style={{ backgroundColor: '#f9fafb', color: '#6b7280' }}
                        />
                      </div>
                      <div>
                        <label className="settings-label">ACCOUNT STATUS</label>
                        <input 
                          type="text" 
                          value={formData.accountStatus} 
                          readOnly 
                          className="settings-input" 
                          style={{ backgroundColor: '#f9fafb', color: '#10b981', fontWeight: 'bold' }}
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div style={{ marginTop: '20px' }}>
                        <button type="submit" className="change-password-btn">Save Changes</button>
                      </div>
                    )}
                  </div>
                </form>
              ) : (
                <div className="privacy-container" autoComplete="off">
                  <h3 className="settings-section-heading text-center">CHANGE PASSWORD</h3>
                  <div className="settings-fields-group">
                    <div>
                      <label className="settings-label">CURRENT PASSWORD</label>
                      <input type="password" placeholder="Enter current password" className="settings-input" autoComplete="new-password" />
                    </div>
                    <div>
                      <label className="settings-label">NEW PASSWORD</label>
                      <input type="password" placeholder="Enter new password" className="settings-input" autoComplete="new-password" />
                    </div>
                    <div>
                      <label className="settings-label">CONFIRM NEW PASSWORD</label>
                      <input type="password" placeholder="Confirm new password" className="settings-input" autoComplete="new-password" />
                    </div>
                    <button className="change-password-btn">Update Password</button>
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE DISPLAY SIDE CARD - Restored Email ABOVE Edit Profile */}
            <div className="profile-display-card">
              <div className="profile-avatar-circle">
                {Icons.userOutline}
              </div>
              <p className="profile-display-email">{formData.email}</p>
              
              <button 
                type="button" 
                className="edit-profile-btn"
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'cancel' : 'edit profile'} {Icons.pencil}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}