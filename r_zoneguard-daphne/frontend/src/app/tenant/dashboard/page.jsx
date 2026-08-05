'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './style.css';

const Icons = {
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  sticker: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
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
  const router = useRouter();
  const [data, setData] = useState(null);
  const [localUser, setLocalUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const storedUserRaw = localStorage.getItem('user') || localStorage.getItem('zoneguard_user');
    
    // Auth Guard: Redirect to login if user session is missing
    if (!storedUserRaw) {
      router.push('/login');
      return;
    }

    try {
      const parsed = JSON.parse(storedUserRaw);
      const userObj = parsed.user || parsed.data || parsed;
      setLocalUser(userObj);

      // Extract user ID using all common schema key variations
      const userId = userObj?.user_id || userObj?.id || userObj?.account_id || userObj?.homeowner_id || userObj?.tenant_id;

      if (!userId) {
        console.warn('No valid User ID found in localStorage user object:', userObj);
        setFetchError('User session ID not found. Please log in again.');
        setLoading(false);
        return;
      }

      console.log('Fetching dashboard data for User ID:', userId);

      fetch(`http://localhost:5000/api/tenant/dashboard/${userId}`)
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Server status ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((resData) => {
          console.log('API Response received:', resData);
          if (resData.success && resData.data) {
            setData(resData.data);
          } else if (resData.data) {
            setData(resData.data);
          } else {
            setData(resData);
          }
          setFetchError(null);
        })
        .catch((err) => {
          console.error('Failed to load dashboard:', err);
          setFetchError(err.message || 'Unable to connect to backend server.');
        })
        .finally(() => {
          setLoading(false);
        });

    } catch (err) {
      console.error('Error parsing stored user:', err);
      router.push('/login');
    }
  }, [router]);

  const profileSource = data?.profile || data?.user || data || {};

  const firstName = profileSource.first_name || profileSource.firstName || localUser?.first_name || localUser?.firstName || 'Resident';
  const lastName = profileSource.last_name || profileSource.lastName || localUser?.last_name || localUser?.lastName || '';

  const fullNameDisplay = firstName + (lastName ? ` ${lastName[0]}.` : '');
  const avatarInitials = ((firstName[0] || 'R') + (lastName[0] || '')).toUpperCase();
  const systemRole = profileSource.system_role || profileSource.systemRole || profileSource.role || localUser?.system_role || localUser?.role || 'TENANT';
  const lotName = profileSource.lot_name || profileSource.lotName || localUser?.lot_name || 'NIA Village Subd.';

  // Extract dues and complaints directly from fetched state
  const currentBalance = data?.dues?.balance !== undefined ? Number(data.dues.balance) : 0;
  const activeComplaintsCount = data?.complaints?.active_count ?? data?.complaints?.activeCount ?? 0;
  const investigatingComplaintsCount = data?.complaints?.investigating_count ?? data?.complaints?.investigatingCount ?? 0;

  return (
    <>
      <header className="topbar">
        <div className="property-tabs">
          <button className="prop-tab active">
            {profileSource.is_rented || profileSource.isRented ? 'Rented Unit' : 'Owned Unit'} ({lotName})
          </button>
        </div>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{fullNameDisplay}</span>
            <span className="user-role">{systemRole}</span>
          </div>
          <div className="user-avatar">{avatarInitials}</div>
        </div>
      </header>

      {/* Backend API Connection Alert */}
      {fetchError && (
        <div style={{ padding: '12px 16px', margin: '16px 0', backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: '8px', fontSize: '14px', border: '1px solid #f87171' }}>
          <strong>API Connection Error:</strong> {fetchError} — Ensure your backend server is running at <code>http://localhost:5000</code> and returning data for this user ID.
        </div>
      )}

      <div className="page-title-section">
        <h1>Hello, {firstName}!</h1>
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
                  {currentBalance === 0
                    ? "Your monthly homeowners association dues are currently up to date. Thank you for contributing to the community's growth and security."
                    : "You have an outstanding balance for your homeowners association dues. Please submit your payment below to maintain good standing."}
                </p>
              </div>
              <span className="status-pill active-pill">
                {Icons.check} {data?.dues?.standing_status || data?.dues?.standingStatus || (currentBalance === 0 ? 'IN GOOD STANDING' : 'OUTSTANDING DUES')}
              </span>
            </div>
            <div className="dues-content">
              <div className="dues-left">
                <span className="dues-label">CURRENT BALANCE</span>
                <strong className="dues-value">
                  ₱{loading ? '...' : currentBalance.toFixed(2)}
                </strong>
              </div>
              <div className="dues-right">
                <div className="dues-meta">
                  <span className="meta-label">{data?.dues?.last_payment_period || data?.dues?.lastPaymentPeriod || 'JUNE 2026 PAYMENT'}</span>
                  <strong className="meta-badge approved">{data?.dues?.last_payment_status || data?.dues?.lastPaymentStatus || 'APPROVED'}</strong>
                </div>
                <div className="dues-meta right-align">
                  <span className="meta-label">NEXT BILLING CYCLE</span>
                  <strong className="meta-text">{data?.dues?.next_billing_cycle || data?.dues?.nextBillingCycle || 'July 2026'}</strong>
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
                <strong className="overview-number">{loading ? '...' : activeComplaintsCount}</strong>
              </div>
              <div className="overview-footer">
                <span className="dot yellow"></span>
                <span className="muted-text">{investigatingComplaintsCount} Investigating</span>
              </div>
            </section>

            <section className="dashboard-card overview-card">
              <div className="overview-header">
                <div className="icon-wrapper blue">{Icons.sticker}</div>
                <span className="overview-label">VEHICLE STICKERS</span>
              </div>
              <div className="overview-body">
                <h4>Registered Vehicles</h4>
                <strong className="overview-number">{data?.vehicles?.total_count ?? data?.vehicles?.totalCount ?? 0}</strong>
              </div>
              <div className="overview-footer split">
                <div>
                  <span className="dot yellow"></span>
                  <span className="muted-text">{data?.vehicles?.private_count ?? data?.vehicles?.privateCount ?? 0} Private</span>
                </div>
                <div>
                  <span className="dot yellow"></span>
                  <span className="muted-text">{data?.vehicles?.commercial_count ?? data?.vehicles?.commercialCount ?? 0} Commercial</span>
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