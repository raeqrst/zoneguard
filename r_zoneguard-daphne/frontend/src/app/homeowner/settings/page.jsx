'use client';

import React, { useState } from 'react';
import './style.css';

const Icons = {
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  userOutline: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};

export default function HomeownerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="settings-container">
      {/* PAGE HEADER & TOP RIGHT TAB SWITCHER */}
      <div className="settings-header">
        <h1 className="settings-title">Account Settings</h1>

        <div className="tab-pill-container">
          <button
            onClick={() => setActiveTab('profile')}
            className={`tab-pill-btn ${activeTab === 'profile' ? 'active' : ''}`}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`tab-pill-btn ${activeTab === 'privacy' ? 'active' : ''}`}
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
            <div>
              {/* PERSONAL & CONTACT INFORMATION */}
              <div className="form-sections-row">
                <div className="section-column">
                  <h3 className="settings-section-heading">PERSONAL INFORMATION</h3>
                  <div className="settings-fields-group">
                    <div>
                      <label className="settings-label">FIRST NAME</label>
                      <input type="text" defaultValue="Thelma" readOnly className="settings-input" />
                    </div>
                    <div>
                      <label className="settings-label">MIDDLE INITIAL</label>
                      <input type="text" defaultValue="I." readOnly className="settings-input" />
                    </div>
                    <div>
                      <label className="settings-label">LAST NAME</label>
                      <input type="text" defaultValue="Ipac" readOnly className="settings-input" />
                    </div>
                  </div>
                </div>

                <div className="section-column">
                  <h3 className="settings-section-heading">CONTACT INFORMATION</h3>
                  <div className="settings-fields-group">
                    <div>
                      <label className="settings-label">CONTACT NUMBER</label>
                      <div className="phone-input-wrapper">
                        <span className="phone-prefix">+63</span>
                        <input type="text" defaultValue="923 584 1827" readOnly className="settings-input flex-1" />
                      </div>
                    </div>
                    <div>
                      <label className="settings-label">EMAIL ADDRESS</label>
                      <input type="text" defaultValue="thelma.ipac1@zoneguard.demo" readOnly className="settings-input" />
                    </div>
                  </div>
                </div>
              </div>

              {/* PROPERTY ADDRESS DETAILS */}
              <div className="settings-sub-section">
                <h3 className="settings-section-heading">PROPERTY ADDRESS DETAILS</h3>
                <span className="sub-heading-label">PRIMARY RESIDENCE</span>
                
                <div className="address-grid-top">
                  <div>
                    <label className="settings-label">HOUSE NO.</label>
                    <input type="text" defaultValue="16" readOnly className="settings-input" />
                  </div>
                  <div>
                    <label className="settings-label">BLOCK</label>
                    <input type="text" defaultValue="BLK 2A" readOnly className="settings-input" />
                  </div>
                  <div>
                    <label className="settings-label">LOT</label>
                    <input type="text" defaultValue="LOT 1" readOnly className="settings-input" />
                  </div>
                </div>

                <div className="address-grid-bottom">
                  <div className="street-col">
                    <label className="settings-label">STREET</label>
                    <input type="text" defaultValue="Pantabangan St." readOnly className="settings-input" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="privacy-container">
              <h3 className="settings-section-heading text-center">CHANGE PASSWORD</h3>
              <div className="settings-fields-group">
                <div>
                  <label className="settings-label">CURRENT PASSWORD</label>
                  <input type="password" placeholder="Enter current password" className="settings-input" />
                </div>
                <div>
                  <label className="settings-label">NEW PASSWORD</label>
                  <input type="password" placeholder="Enter new password" className="settings-input" />
                </div>
                <div>
                  <label className="settings-label">CONFIRM NEW PASSWORD</label>
                  <input type="password" placeholder="Confirm new password" className="settings-input" />
                </div>
                <button className="change-password-btn">Update Password</button>
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DISPLAY SIDEBAR */}
        <div className="profile-display-card">
          <div className="profile-avatar-circle">
            {Icons.userOutline}
          </div>
          <h2 className="profile-name">Thelma Ipac</h2>
          <span className="profile-role">HOMEOWNER</span>

          <button className="edit-profile-btn">
            edit profile {Icons.pencil}
          </button>
        </div>
      </div>
    </div>
  );
}