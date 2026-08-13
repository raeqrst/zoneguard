'use client';

<<<<<<< HEAD
import React from 'react';
import { 
  Wallet, 
  Percent, 
  CheckSquare 
} from 'lucide-react';
import './style.css';

export default function CollectorDashboard() {
=======
import React, { useState, useEffect } from 'react';
import { Wallet, Percent, CheckSquare } from 'lucide-react';
import './style.css';

export default function CollectorDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:5000/api/collector/dashboard');
        if (res.ok) {
          const result = await res.json();
          setData(result);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard metrics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading Command Center metrics...</div>;
  }

  const m = data?.metrics || {};
  const goal = m.goal || { accomplished: 7, total: 159, remaining: 152, percentage: 4 };
  const billing = m.billing || { cycle: 'August 2026', daysRemaining: 24, dailyAvgNeeded: '6.3' };
  const dist = m.distribution || { disputePercent: 50, paymentPercent: 4 };

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  return (
    <>
      <div className="breadcrumb-section" style={{ marginBottom: '16px' }}>
        <span className="breadcrumb">COLLECTOR - DASHBOARD</span>
      </div>

      {/* Title Section */}
<<<<<<< HEAD
      <div className="page-title-section flex-title" style={{ marginBottom: '24px' }}>
        <h1>Collector Command Center</h1>
        <span className="zone-tag">ZONE 3</span>
=======
      <div className="page-title-section flex-title" style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Collector Command Center</h1>
        <span className="zone-tag">{data?.collector?.zone || 'ZONE 3'}</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      </div>

      {/* Dashboard Grid Cards Row 1 */}
      <div className="metrics-grid collector-metrics-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap light-green">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Collected</span>
<<<<<<< HEAD
            <span className="metric-value">₱40,000</span>
            <div className="card-sub-stats">
              <div className="sub-stat-item">
                <span className="dot cash-dot"></span>
                <span className="sub-label">Cash: <strong>₱20,000</strong></span>
              </div>
              <div className="sub-stat-item">
                <span className="dot digital-dot"></span>
                <span className="sub-label">Digital: <strong>₱20,000</strong></span>
=======
            <span className="metric-value">₱{Number(m.totalCollected || 0).toLocaleString('en-US')}</span>
            <div className="card-sub-stats">
              <div className="sub-stat-item">
                <span className="dot cash-dot"></span>
                <span className="sub-label">Cash: <strong>₱{Number(m.totalCash || 0).toLocaleString('en-US')}</strong></span>
              </div>
              <div className="sub-stat-item">
                <span className="dot digital-dot"></span>
                <span className="sub-label">Digital: <strong>₱{Number(m.totalDigital || 0).toLocaleString('en-US')}</strong></span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
              </div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap light-pink">
            <Percent size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Incentive</span>
<<<<<<< HEAD
            <span className="metric-value">₱4,000</span>
=======
            <span className="metric-value">₱{Number(m.incentive || 0).toLocaleString('en-US')}</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            <div className="incentive-progress-wrapper">
              <div className="metric-progress-bar bg-gray">
                <div className="progress-fill pink-fill" style={{ width: '100%' }}></div>
              </div>
              <span className="incentive-tag">10% Monthly Incentive</span>
            </div>
          </div>
        </div>

        <div className="dash-card compact-pending-card">
          <div className="pending-header">
            <CheckSquare size={18} className="green-text" />
            <h3>Pending Task</h3>
          </div>
          <ul className="task-list">
            <li>
              <span>Payment Reviews</span>
<<<<<<< HEAD
              <span className="badge">10</span>
            </li>
            <li>
              <span>Dispute</span>
              <span className="badge">5</span>
            </li>
            <li>
              <span>Vehicle Sticker Application</span>
              <span className="badge">3</span>
=======
              <span className="badge">{m.pendingReviews ?? 0}</span>
            </li>
            <li>
              <span>Dispute</span>
              <span className="badge">{m.pendingDisputes ?? 0}</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            </li>
          </ul>
        </div>
      </div>

      {/* Dashboard Row 2: Monthly Goal & Billing Info */}
      <div className="dashboard-grid collector-middle-grid" style={{ marginTop: '20px' }}>
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Monthly Collection Goal</h2>
            <p>Progress toward achieving Zone 3 target for this billing cycle.</p>
          </div>
          <div className="goal-numbers">
            <div className="goal-main-stat">
<<<<<<< HEAD
              <span className="big-number">165</span>
              <span className="gray-sub">/ 185 Payments Accomplished</span>
            </div>
            <span className="percentage-text">89%</span>
          </div>
          <div className="metric-progress-bar bg-gray">
            <div className="progress-fill mid-green" style={{ width: '89%' }}></div>
          </div>
          <div className="goal-footer-legend">
            <span className="legend-item"><span className="dot digital-dot"></span> 165 Collected</span>
            <span className="legend-item"><span className="dot gray-dot"></span> 20 Remaining</span>
=======
              <span className="big-number">{goal.accomplished}</span>
              <span className="gray-sub">/ {goal.total} Payments Accomplished</span>
            </div>
            <span className="percentage-text">{goal.percentage}%</span>
          </div>
          <div className="metric-progress-bar bg-gray">
            <div className="progress-fill mid-green" style={{ width: `${goal.percentage}%` }}></div>
          </div>
          <div className="goal-footer-legend">
            <span className="legend-item"><span className="dot digital-dot"></span> {goal.accomplished} Collected</span>
            <span className="legend-item"><span className="dot gray-dot"></span> {goal.remaining} Remaining</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
          </div>
        </div>

        <div className="dash-card billing-info-stack">
          <div className="billing-block">
            <span className="billing-title">BILLING CYCLE</span>
<<<<<<< HEAD
            <span className="billing-value green-text-bold">July 2026</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAYS REMAINING</span>
            <span className="billing-value green-text-bold">8 Days</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAILY AVE NEEDED</span>
            <span className="billing-value green-text-bold">2.0</span>
=======
            <span className="billing-value green-text-bold">{billing.cycle}</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAYS REMAINING</span>
            <span className="billing-value green-text-bold">{billing.daysRemaining} Days</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAILY AVE NEEDED</span>
            <span className="billing-value green-text-bold">{billing.dailyAvgNeeded}</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
          </div>
        </div>
      </div>

<<<<<<< HEAD
      {/* Dashboard Row 3: Task Distribution */}
=======
      {/* Dashboard Row 3: Restored Task Distribution Box */}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      <div className="dash-card" style={{ marginTop: '20px' }}>
        <div className="dash-card-header" style={{ marginBottom: '16px' }}>
          <h2>Task Distribution and Status</h2>
          <p>Operational progress across Zone 3 Categories</p>
        </div>

        <div className="distribution-stack">
<<<<<<< HEAD
          <div className="distribution-item">
            <div className="dist-label-row">
              <span className="dist-title">Dispute Handling</span>
              <span className="dist-percent">50%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill blue-fill" style={{ width: '50%' }}></div>
=======
          <div className="distribution-item" style={{ marginBottom: '16px' }}>
            <div className="dist-label-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="dist-title" style={{ fontWeight: '600', color: '#1e293b' }}>Dispute Handling</span>
              <span className="dist-percent" style={{ fontWeight: '700', color: '#0f172a' }}>{dist.disputePercent}%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill blue-fill" style={{ width: `${dist.disputePercent}%` }}></div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            </div>
          </div>

          <div className="distribution-item">
<<<<<<< HEAD
            <div className="dist-label-row">
              <span className="dist-title">Vehicle Sticker Applications</span>
              <span className="dist-percent">75%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill light-blue-fill" style={{ width: '75%' }}></div>
=======
            <div className="dist-label-row" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="dist-title" style={{ fontWeight: '600', color: '#1e293b' }}>Payment Handling</span>
              <span className="dist-percent" style={{ fontWeight: '700', color: '#0f172a' }}>{dist.paymentPercent}%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill light-blue-fill" style={{ width: `${dist.paymentPercent}%` }}></div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            </div>
          </div>
        </div>
      </div>
    </>
  );
}