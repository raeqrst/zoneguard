'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import './style.css';

const Icons = {
  shieldHome: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
  ),
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  sticker: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  ),
  check: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  upload: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>
  ),
  arrowLeft: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
  )
};

const sidebarItems = [
  { label: 'Dashboard', href: '/tenant/dashboard', icon: Icons.dashboard },
  { label: 'Payments', href: '/tenant/payments', icon: Icons.payments },
  { label: 'Complaints', href: '/tenant/complaints', icon: Icons.complaints, active: true },
  { label: 'Vehicle Sticker', href: '/tenant/vehicle-sticker', icon: Icons.sticker },
];

const mockComplaints = [
  {
    id: '#G3-0002',
    date: 'May 04, 2026',
    subject: 'Not paying credit to person A',
    category: 'FINANCIAL',
    status: 'Active',
    description: 'Concerns regarding outstanding community financial obligations.',
    timeline: [
      { status: 'Submitted', time: 'May 04, 2026 • 10:00 AM', desc: 'Ticket logged successfully.' }
    ]
  },
  {
    id: '#G3-0001',
    date: 'February 01, 2026',
    subject: 'Unauthorized parking in A Street',
    category: 'GRIEVANCE',
    status: 'Investigating',
    description: 'May nagparking sa harap ng garahe ko. Nde ko malabas motor ko. plz help. We tried negotiating pero mukhang siya pa may ganang magalit kahit na sabihin naming bawal magparking sa driveway.',
    timeline: [
      { status: 'Submitted', time: 'Feb 01, 2026 • 09:14 AM', desc: 'Ticket successfully received and logged into the maintenance queue.' },
      { status: 'Investigating', time: 'Feb 01, 2026 • 02:00 PM', desc: 'Worker is on-site investigating.' }
    ]
  },
  {
    id: '#G3-0000',
    date: 'Mar 2026',
    subject: 'Flickering lights',
    category: 'INFRASTRUCTURE',
    status: 'Resolved',
    description: 'Streetlight near Lot 4 is flickering intermittently.',
    timeline: [
      { status: 'Submitted', time: 'Mar 10, 2026 • 08:30 AM', desc: 'Issue logged.' },
      { status: 'Resolved', time: 'Mar 11, 2026 • 01:15 PM', desc: 'Bulb replaced by maintenance.' }
    ]
  }
];

export default function TenantComplaintsPage() {
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  return (
    <div className="layout-wrapper">
      {/* FIXED SIDEBAR */}
      <aside className="sidebar">
        <div className="brand-header">
          <div className="brand-logo-zg">{Icons.shieldHome}</div>
          <div className="brand-text">
            <strong>ZoneGuard</strong>
            <span>NIA VILLAGE SUBD.</span>
          </div>
        </div>

        <nav className="nav-menu">
          {sidebarItems.map((item) => (
            <Link key={item.label} href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link href="/tenant/settings" className="nav-link">
            <span className="nav-icon">{Icons.settings}</span>
            Account Settings
          </Link>
          <Link href="/tenant/login" className="nav-link btn-logout">
            <span className="nav-icon">{Icons.logout}</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* SCROLLABLE MAIN CONTENT */}
      <main className="content-area">
        {/* TOPBAR */}
        <header className="topbar">
          <div></div>
          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">Brian S.</span>
              <span className="user-role">TENANT</span>
            </div>
            <div className="user-avatar">BS</div>
          </div>
        </header>

        {/* DETAILED VIEW IF SELECTED */}
        {selectedComplaint ? (
          <div className="complaint-detail-container">
            <button className="btn-back" onClick={() => setSelectedComplaint(null)}>
              {Icons.arrowLeft} Back to My Complaints
            </button>

            <div className="detail-header-tags">
              <span className="tag-id">{selectedComplaint.id}</span>
              <span className={`status-badge pill-${selectedComplaint.status.toLowerCase()}`}>
                {selectedComplaint.status}
              </span>
            </div>

            <h1 className="detail-title">{selectedComplaint.subject}</h1>

            {/* PROGRESSION TICKET CARD */}
            <div className="card detail-card">
              <h3 className="card-heading">
                <span className="heading-icon">⏱</span> Complaint Progression
              </h3>
              <div className="timeline-list">
                {selectedComplaint.timeline.map((item, index) => (
                  <div key={index} className="timeline-item">
                    <div className="timeline-badge icon-check">{Icons.check}</div>
                    <div className="timeline-content">
                      <div className="timeline-header">
                        <strong>{item.status}</strong>
                        <span className="timeline-time">{item.time}</span>
                      </div>
                      <p>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMISSION DETAILS CARD */}
            <div className="card detail-card">
              <h3 className="card-heading green-text">Original Submission Details</h3>
              <div className="submission-grid">
                <div>
                  <span className="sub-label">SUBJECT</span>
                  <p className="sub-value">{selectedComplaint.subject}</p>
                </div>
                <div>
                  <span className="sub-label">CATEGORY</span>
                  <p className="sub-value">{selectedComplaint.category}</p>
                </div>
              </div>

              <div className="sub-description">
                <span className="sub-label">DESCRIPTION</span>
                <p className="sub-value">{selectedComplaint.description}</p>
              </div>

              <div className="photo-evidence-section">
                <span className="sub-label">PHOTO EVIDENCE (2)</span>
                <div className="photo-grid">
                  <div className="photo-placeholder"></div>
                  <div className="photo-placeholder"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MAIN COMPLAINTS LIST VIEW */
          <div className="complaints-main-container">
            
            {/* TENANT STANDING BANNER */}
            <div className="member-standing-card">
              <div className="standing-icon">{Icons.check}</div>
              <div>
                <strong>Tenant Standing:</strong>
                <span> Your account is in green status. You are permitted to submit new formal concerns.</span>
              </div>
            </div>

            {/* SUBMIT COMPLAINT FORM CARD */}
            <div className="form-card">
              <div className="form-card-header">
                <h2>Submit a New Complaint</h2>
                <p>Please provide details and any supporting evidence for your concern.</p>
              </div>
              <div className="form-card-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>SUBJECT</label>
                    <input type="text" placeholder="e.g. Broken perimeter fence" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>CATEGORY</label>
                    <select className="form-input form-select">
                      <option>Public Relations</option>
                      <option>Grievance</option>
                      <option>Financial</option>
                      <option>Infrastructure</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>DETAILS</label>
                    <textarea placeholder="Provide a brief summary of the issue..." className="form-input form-textarea"></textarea>
                  </div>
                  <div className="form-group">
                    <label>UPLOAD PHOTOS OR EVIDENCE</label>
                    <div className="dropzone-box">
                      <div className="dropzone-icon">{Icons.upload}</div>
                      <strong>Upload or drag and drop images</strong>
                      <span>JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>

                <button className="btn-submit-complaint">FILE FORMAT COMPLAINT</button>
              </div>
            </div>

            {/* ACTIVE COMPLAINTS LIST */}
            <div className="active-complaints-section">
              <div className="section-header">
                <h3>{Icons.list} Active Complaints</h3>
                <span className="total-count">Total: {mockComplaints.length}</span>
              </div>

              <div className="table-container">
                <table className="complaints-table">
                  <thead>
                    <tr>
                      <th>DATE</th>
                      <th>SUBJECT</th>
                      <th>CATEGORY</th>
                      <th>STATUS</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockComplaints.map((item) => (
                      <tr key={item.id} onClick={() => setSelectedComplaint(item)} className="table-row">
                        <td>{item.date}</td>
                        <td className="subject-cell">{item.subject}</td>
                        <td>
                          <span className={`cat-badge cat-${item.category.toLowerCase()}`}>
                            {item.category}
                          </span>
                        </td>
                        <td>
                          <span className={`status-pill pill-${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="arrow-cell">&gt;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}