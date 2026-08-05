'use client';


import React from 'react';
import Link from 'next/link';
import './style.css';


const Icons = {
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  sticker: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
  ),
  qr: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="6" height="6"></rect><rect x="15" y="3" width="6" height="6"></rect><rect x="15" y="15" width="6" height="6"></rect><path d="M15 9h-3v3"></path><path d="M9 15h3v3"></path></svg>
  ),
  upload: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
  ),
  clock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
  ),
  check: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
  ),
  arrowRight: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
  )
};


export default function TenantDashboardPage() {
  return (
    <>
      <header className="topbar">
        <div className="property-tabs">
          <button className="prop-tab active">Rented Unit (NIA Village Subd.)</button>
        </div>


        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Brian S.</span>
            <span className="user-role">TENANT</span>
          </div>
          <div className="user-avatar">CB</div>
        </div>
      </header>


      <div className="page-title-section">
        <h1>Hello, Brian!</h1>
      </div>


      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-column">


          {/* DUES CARD */}
          <section className="dashboard-card dues-card">
            <div className="dues-header">
              <div className="dues-title-group">
                <h2>My Dues</h2>
                <p className="card-paragraph">Your monthly homeowners association dues are currently up to date. Thank you for contributing to the community's growth and security.</p>
              </div>
              <span className="status-pill active-pill">
                {Icons.check} IN GOOD STANDING
              </span>
            </div>
            <div className="dues-content">
              <div className="dues-left">
                <span className="dues-label">CURRENT BALANCE</span>
                <strong className="dues-value">₱0.00</strong>
              </div>
              <div className="dues-right">
                <div className="dues-meta">
                  <span className="meta-label">JUNE 2026 PAYMENT</span>
                  <strong className="meta-badge approved">APPROVED</strong>
                </div>
                <div className="dues-meta right-align">
                  <span className="meta-label">NEXT BILLING CYCLE</span>
                  <strong className="meta-text">July 2026</strong>
                </div>
              </div>
            </div>
          </section>


          {/* OVERVIEW SECTION */}
          <div className="section-title">Overview</div>
          <div className="overview-row">
            <section className="dashboard-card overview-card">
              <div className="overview-header">
                <div className="icon-wrapper red">{Icons.complaints}</div>
                <span className="overview-label">COMPLAINTS</span>
              </div>
              <div className="overview-body">
                <h4>Active Tickets</h4>
                <strong className="overview-number">3</strong>
              </div>
              <div className="overview-footer">
                <span className="dot yellow"></span>
                <span className="muted-text">2 Investigating</span>
              </div>
            </section>


            <section className="dashboard-card overview-card">
              <div className="overview-header">
                <div className="icon-wrapper blue">{Icons.sticker}</div>
                <span className="overview-label">VEHICLE STICKERS</span>
              </div>
              <div className="overview-body">
                <h4>Registered Vehicles</h4>
                <strong className="overview-number">1</strong>
              </div>
              <div className="overview-footer split">
                <div>
                  <span className="dot yellow"></span>
                  <span className="muted-text">1 Private</span>
                </div>
                <div>
                  <span className="dot yellow"></span>
                  <span className="muted-text">0 Commercial</span>
                </div>
              </div>
            </section>
          </div>


          {/* SERVICE ACCESS CARD */}
          <section className="dashboard-card service-card">
            <div className="service-body">
              <div className="service-copy">
                <h3>{Icons.check} Service Access</h3>
                <p>As a resident in good standing, you have full access to community services and administrative request channels.</p>
              </div>
              <div className="service-actions">
                <Link href="/tenant/complaints" className="service-btn">
                  <span><span className="btn-icon">📄</span> Submit complaint</span>
                  {Icons.arrowRight}
                </Link>
                <Link href="/tenant/vehicle-sticker" className="service-btn">
                  <span><span className="btn-icon">🛵</span> Purchase Vehicle Sticker</span>
                  {Icons.arrowRight}
                </Link>
              </div>
            </div>
          </section>
        </div>


        {/* RIGHT COLUMN */}
        <div className="right-column">


          {/* PAYMENT CARD */}
          <section className="dashboard-card payment-card">
            <div className="panel-heading">
              <h3>Pay via QR</h3>
            </div>


            <div className="form-section">
              <span className="form-label">SCAN QR CODE</span>
              <div className="qr-container">
                <div className="qr-inner">
                  <div className="qr-placeholder">
                    {Icons.qr}
                  </div>
                </div>
                <div className="qr-scan-text">{Icons.qr} Scan QR Code</div>
              </div>
            </div>


            <div className="form-section">
              <span className="form-label">UPLOAD SCREENSHOT</span>
              <div className="upload-box">
                <div className="upload-icon">{Icons.upload}</div>
                <div className="upload-text">
                  <strong>Upload Proof of Payment</strong>
                  <span>JPG, PNG (Max 5MB)</span>
                </div>
              </div>
            </div>


            <div className="form-section">
              <span className="form-label">INPUT REFERENCE NUMBER</span>
              <div className="input-with-icon">
                <input className="input-ref" placeholder="e.g. 9012345678910" />
                <span className="input-info">i</span>
              </div>
            </div>


            <button className="btn-primary btn-full">SUBMIT FOR VALIDATION</button>
          </section>


          {/* OFFICE HOURS CARD */}
          <section className="dashboard-card office-card">
            <div className="panel-heading office-heading">
              {Icons.clock}
              <h3>Office Hours</h3>
            </div>
            <ul>
              <li><span>WEEKDAYS</span><strong>8:00 AM - 5:00 PM</strong></li>
              <li><span>SATURDAYS</span><strong>9:00 AM - 1:30 PM</strong></li>
              <li><span>SUN & HOLIDAYS</span><strong className="muted-strong">No Office</strong></li>
            </ul>
          </section>


        </div>
      </div>
    </>
  );
}

