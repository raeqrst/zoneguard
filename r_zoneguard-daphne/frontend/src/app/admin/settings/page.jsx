// src/app/admin/settings/page.jsx
'use client';

import React, { useState, useEffect } from 'react';
import './style.css';

const Icons = {
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg>
  ),
  userOutline: (
    <svg width="84" height="84" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )
};

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

  if (loading) return <div style={{ padding: '40px' }}>Loading settings...</div>;

  return (
    <div className="settings-page">
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

        {/* PROFILE DISPLAY SIDE CARD */}
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
    </div>
  );
}