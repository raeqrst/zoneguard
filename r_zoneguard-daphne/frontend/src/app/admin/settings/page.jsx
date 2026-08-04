'use client';

import React, { useState } from 'react';
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
              <input type="text" placeholder="Search here..." />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">ADMINISTRATOR</span>
              </div>
              <div className="user-avatar">AD</div>
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
                <div>
                  {/* PERSONAL & CONTACT INFORMATION */}
                  <div className="form-sections-row">
                    <div className="section-column">
                      <h3 className="settings-section-heading">PERSONAL INFORMATION</h3>
                      <div className="settings-fields-group">
                        <div>
                          <label className="settings-label">FIRST NAME</label>
                          <input type="text" defaultValue="Darth" readOnly className="settings-input" />
                        </div>
                        <div>
                          <label className="settings-label">MIDDLE INITIAL</label>
                          <input type="text" defaultValue="C." readOnly className="settings-input" />
                        </div>
                        <div>
                          <label className="settings-label">LAST NAME</label>
                          <input type="text" defaultValue="Vader" readOnly className="settings-input" />
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
                            <input type="text" defaultValue="977 543 1769" readOnly className="settings-input flex-1" />
                          </div>
                        </div>
                        <div>
                          <label className="settings-label">EMAIL ADDRESS</label>
                          <input type="text" defaultValue="IAmYourFather@gmail.com" readOnly className="settings-input" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PROPERTY ADDRESS SECTION */}
                  <div className="settings-sub-section">
                    <h3 className="settings-section-heading">PROPERTY ADDRESS</h3>
                    <div className="address-grid-top">
                      <div>
                        <label className="settings-label">HOUSE NO.</label>
                        <input type="text" defaultValue="01" readOnly className="settings-input" />
                      </div>
                      <div>
                        <label className="settings-label">BLOCK</label>
                        <input type="text" defaultValue="BLK 8" readOnly className="settings-input" />
                      </div>
                      <div>
                        <label className="settings-label">LOT</label>
                        <input type="text" defaultValue="LOT 61" readOnly className="settings-input" />
                      </div>
                    </div>

                    <div className="address-grid-bottom">
                      <div className="zone-col">
                        <label className="settings-label">ZONE</label>
                        <input type="text" defaultValue="Zone 3" readOnly className="settings-input" />
                      </div>
                      <div className="street-col">
                        <label className="settings-label">STREET</label>
                        <input type="text" defaultValue="Palico Lane St." readOnly className="settings-input" />
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

            {/* PROFILE DISPLAY SIDE CARD */}
            <div className="profile-display-card">
              <div className="profile-avatar-circle">
                {Icons.userOutline}
              </div>
              <p className="profile-display-email">IAmYourFather@gmail.com</p>
              
              <button className="edit-profile-btn">
                edit profile {Icons.pencil}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}