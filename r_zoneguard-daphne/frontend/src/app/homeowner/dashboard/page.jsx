'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import './style.css';

const Icons = {
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
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
  ),
  lock: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
  )
};

export default function HomeownerDashboardPage() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';

  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Payment Form States
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [proofPreview, setProofPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Live Dynamic Dashboard Data
  const fetchDashboardData = async (propId) => {
    setLoading(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;

      const url = new URL('http://localhost:5000/api/homeowner/dashboard');
      if (propId) url.searchParams.append('propertyId', propId);
      if (loggedInUserId) url.searchParams.append('userId', loggedInUserId);

      const res = await fetch(url.toString());
      const data = await res.json();

      if (res.ok) {
        setDashboardData(data);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData(propertyId);
  }, [propertyId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setProofFile(file);
      setProofPreview(URL.createObjectURL(file));
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      alert('Please provide a reference number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const response = await fetch('http://localhost:5000/api/homeowner/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber: referenceNumber.trim(),
          propertyId: propertyId || dashboardData?.activePropertyId,
          userId: loggedInUserId
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Payment submitted successfully for validation!');
        setReferenceNumber('');
        setProofFile(null);
        setProofPreview(null);
        fetchDashboardData(propertyId);
      } else {
        alert('Failed to submit payment: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('Network error while submitting payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !dashboardData) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading dashboard...</div>;
  }

  const dues = dashboardData?.dues || {
    balance: 0.00,
    status: 'IN GOOD STANDING',
    isDelinquent: false,
    lastPaymentMonth: 'None',
    lastPaymentStatus: 'N/A',
    nextBillingCycle: 'September 2026'
  };

  const complaintStats = dashboardData?.complaints || {
    activeTickets: 0,
    investigatingCount: 0
  };

  const activeProperty = dashboardData?.properties?.find(
    p => String(p.id) === String(dashboardData.activePropertyId)
  );

  const isPrimary = activeProperty
    ? activeProperty.name.toLowerCase().includes('primary')
    : true;

  return (
    <main className="dashboard-content">
      {/* PAGE HEADING */}
      <div className="page-title-section">
        <h1>Hello, {dashboardData?.homeownerName?.split(' ')[0] || 'Resident'}!</h1>
      </div>

      <div className="dashboard-grid">
        {/* LEFT COLUMN */}
        <div className="left-column">

          {/* DUES CARD */}
          <section className="dashboard-card dues-card">
            <div className="dues-header">
              <div className="dues-title-group">
                <h2>My Dues</h2>
                <p className="card-paragraph">
                  Currently viewing dues for: <strong>{activeProperty?.name || 'Primary Residence'}</strong>
                </p>
              </div>
              <span className={`status-pill ${dues.isDelinquent ? 'warning-pill' : 'active-pill'}`}>
                {!dues.isDelinquent && Icons.check} {dues.status}
              </span>
            </div>
            <div className="dues-content">
              <div className="dues-left">
                <span className="dues-label">CURRENT BALANCE</span>
                <strong className="dues-value">₱{Number(dues.balance).toFixed(2)}</strong>
              </div>
              <div className="dues-right">
                <div className="dues-meta">
                  <span className="meta-label">LAST PAYMENT</span>
                  <strong className={`meta-badge ${dues.isDelinquent ? 'pending' : 'approved'}`}>
                    {dues.lastPaymentMonth} ({dues.lastPaymentStatus})
                  </strong>
                </div>
                <div className="dues-meta right-align">
                  <span className="meta-label">NEXT BILLING CYCLE</span>
                  <strong className="meta-text">{dues.nextBillingCycle}</strong>
                </div>
              </div>
            </div>
          </section>

          {/* BADGE SECTION (ONLY SHOWN FOR PRIMARY RESIDENCE) */}
          {isPrimary && !dues.isDelinquent && (
            <>
              <div className="section-title">Community Standing</div>
              <section className="dashboard-card badge-card">
                <div className="badge-visual">
                  <div className="badge-coin">
                    <div className="stars">★★★★★</div>
                    <span>GOLD</span>
                  </div>
                </div>
                <div>
                  <h3>Gold Badge Status</h3>
                  <p>You are in the top 5% of residents for consistent on-time payments. Keep up the great work!</p>
                </div>
              </section>
            </>
          )}

          {/* OVERVIEW SECTION */}
          <div className="section-title">Overview</div>
          <div className="overview-row single-card">
            <section className="dashboard-card overview-card">
              <div className="overview-header">
                <div className="icon-wrapper red">{Icons.complaints}</div>
                <span className="overview-label">COMPLAINTS</span>
              </div>
              <div className="overview-body">
                <h4>Active Tickets</h4>
                <strong className="overview-number">
                  {complaintStats.activeTickets === 0 ? 'None' : complaintStats.activeTickets}
                </strong>
              </div>
              <div className="overview-footer">
                <span className="dot yellow"></span>
                <span className="muted-text">{complaintStats.investigatingCount} Investigating</span>
              </div>
            </section>
          </div>

          {/* SERVICE ACCESS CARD (DYNAMIC BASED ON DUES) */}
          <section className="dashboard-card service-card">
            <div className="service-body">
              <div className="service-copy">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '6px', color: dues.isDelinquent ? '#991b1b' : '#111827' }}>
                  {dues.isDelinquent ? Icons.lock : Icons.check} Service Access
                </h3>
                <p>
                  {dues.isDelinquent 
                    ? 'Service access is temporarily restricted due to unpaid balances. Please settle your arrears to submit administrative requests or complaints.' 
                    : 'As a resident, you have access to community service requests and complaint channels.'}
                </p>
              </div>
              <div className="service-actions">
                {dues.isDelinquent ? (
                  <button className="service-btn" style={{ opacity: 0.6, cursor: 'not-allowed', color: '#9ca3af' }} disabled>
                    <span><span className="btn-icon">🔒</span> Submit complaint</span>
                  </button>
                ) : (
                  <Link href="/homeowner/complaints" className="service-btn">
                    <span><span className="btn-icon">📄</span> Submit complaint</span>
                    {Icons.arrowRight}
                  </Link>
                )}
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

            <form onSubmit={handlePaymentSubmit}>
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
                <label className="upload-box" style={{ cursor: 'pointer' }}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <div className="upload-icon">{Icons.upload}</div>
                  <div className="upload-text">
                    <strong>{proofFile ? proofFile.name : 'Upload Proof of Payment'}</strong>
                    <span>{proofFile ? `${(proofFile.size / 1024 / 1024).toFixed(2)} MB` : 'JPG, PNG (Max 5MB)'}</span>
                  </div>
                </label>
                {proofPreview && (
                  <div style={{ marginTop: '8px', fontSize: '12px', color: '#059669' }}>
                    ✓ Image attached successfully
                  </div>
                )}
              </div>

              <div className="form-section">
                <span className="form-label">INPUT REFERENCE NUMBER</span>
                <div className="input-with-icon">
                  <input
                    className="input-ref"
                    placeholder="e.g. 9012345678910"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    required
                  />
                  <span className="input-info">i</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary btn-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR VALIDATION'}
              </button>
            </form>
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
    </main>
  );
}