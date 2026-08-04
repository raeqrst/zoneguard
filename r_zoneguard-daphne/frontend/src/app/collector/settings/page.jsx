'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './style.css';

const Icons = {
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  userOutline: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};

export default function DirectorSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-outer-wrapper">
      {/* SCROLLABLE MAIN CONTENT */}
      <main className="settings-main">
        
        {/* TOPBAR */}
        <header className="settings-topbar">
          <div className="settings-user-wrapper">
            <div className="settings-user-info">
              <span className="settings-user-name">Marilou Del Rosario</span>
              <span className="settings-user-role">ZONE 3 DIRECTOR</span>
            </div>
            <div className="settings-avatar-badge">DR</div>
          </div>
        </header>

        {/* PAGE HEADER & TABS */}
        <div className="settings-header">
          <h1 className="settings-title">Account Settings</h1>
          
          <div className="tab-pill-group">
            <button
              onClick={() => setActiveTab('profile')}
              className={`tab-btn ${activeTab === 'profile' ? 'active-tab' : ''}`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`tab-btn ${activeTab === 'privacy' ? 'active-tab' : ''}`}
            >
              Privacy Settings
            </button>
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="settings-grid">
          
          {/* FORM CARD */}
          <div className="settings-form-card">
            {activeTab === 'profile' ? (
              <div>
                {/* SECTION 1 */}
                <h3 className="settings-section-heading">Personal Information</h3>
                <div className="settings-form-grid-2">
                  <div>
                    <label className="settings-label">FIRST NAME</label>
                    <input type="text" defaultValue="Marilou" readOnly className="settings-input" />
                  </div>
                  <div>
                    <label className="settings-label">MIDDLE INITIAL</label>
                    <input type="text" defaultValue="A." readOnly className="settings-input" />
                  </div>
                  <div className="span-2">
                    <label className="settings-label">LAST NAME</label>
                    <input type="text" defaultValue="Del Rosario" readOnly className="settings-input" />
                  </div>
                </div>

                {/* SECTION 2 */}
                <h3 className="settings-section-heading">Contact Information</h3>
                <div className="settings-form-grid-2">
                  <div>
                    <label className="settings-label">CONTACT NUMBER</label>
                    <div className="phone-input-wrapper">
                      <span className="phone-prefix">+63</span>
                      <input type="text" defaultValue="917 412 9988" readOnly className="settings-input flex-1" />
                    </div>
                  </div>
                  <div>
                    <label className="settings-label">EMAIL ADDRESS</label>
                    <input type="text" defaultValue="delrosario.zone3@zoneguard.ph" readOnly className="settings-input" />
                  </div>
                </div>

                {/* SECTION 3 */}
                <div className="settings-sub-section">
                  <h3 className="settings-section-heading">Administrative Assignment</h3>
                  <div className="settings-form-grid-2">
                    <div>
                      <label className="settings-label">ASSIGNED ZONE</label>
                      <input defaultValue="Zone 3" readOnly className="settings-input" />
                    </div>
                    <div>
                      <label className="settings-label">ROLE LEVEL</label>
                      <input defaultValue="Executive Director" readOnly className="settings-input" />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="privacy-container">
                <h3 className="settings-section-heading text-center">Change Password</h3>
                <div className="settings-fields-group">
                  <div>
                    <label className="settings-label">Current Password</label>
                    <input type="password" className="settings-input" />
                  </div>
                  <div>
                    <label className="settings-label">New Password</label>
                    <input type="password" className="settings-input" />
                  </div>
                  <div>
                    <label className="settings-label">Confirm New Password</label>
                    <input type="password" className="settings-input" />
                  </div>
                  <button className="change-password-btn">Update Password</button>
                </div>
              </div>
            )}
          </div>

          {/* PROFILE SUMMARY CARD */}
          <div className="profile-display-card settings-form-card">
            <div className="profile-avatar-circle">
              {Icons.userOutline}
            </div>
            <h2 className="profile-display-name">Marilou Del Rosario</h2>
            <p className="profile-display-role">ZONE 3 DIRECTOR</p>
            
            <button className="edit-profile-btn">
              Edit Profile {Icons.pencil}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}