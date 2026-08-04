import React from 'react';
import { 
  Wallet, 
  Percent, 
  CheckSquare, 
  Bell 
} from 'lucide-react';
import './style.css';

const CollectorDashboard = ({ activeItem = 'Dashboard', setActiveItem = () => {} }) => {
  return (
    <main className="main-content">
      {/* Top Header */}
      <header className="topbar">
        <div className="breadcrumb-section">
          <span className="breadcrumb">COLLECTOR - DASHBOARD</span>
        </div>
        <div className="user-profile">
          <button className="notification-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>
          <div className="user-info">
            <span className="user-name">Marilou Del Rosario</span>
            <span className="user-role">COLLECTOR</span>
          </div>
          <div className="user-avatar">CO</div>
        </div>
      </header>

      {/* Title */}
      <div className="page-title-section flex-title">
        <h1>Collector Command Center</h1>
        <span className="zone-tag">ZONE 3</span>
      </div>

      {/* Dashboard Grid Cards Row 1 */}
      <div className="metrics-grid collector-metrics-grid">
        {/* Total Collected */}
        <div className="metric-card">
          <div className="metric-icon-wrap light-green">
            <Wallet size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Total Collected</span>
            <span className="metric-value">₱40,000</span>
            <div className="card-sub-stats">
              <div className="sub-stat-item">
                <span className="dot cash-dot"></span>
                <span className="sub-label">Cash: <strong>₱20,000</strong></span>
              </div>
              <div className="sub-stat-item">
                <span className="dot digital-dot"></span>
                <span className="sub-label">Digital: <strong>₱20,000</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Incentive */}
        <div className="metric-card">
          <div className="metric-icon-wrap light-pink">
            <Percent size={22} />
          </div>
          <div className="metric-info">
            <span className="metric-label">Incentive</span>
            <span className="metric-value">₱4,000</span>
            <div className="incentive-progress-wrapper">
              <div className="metric-progress-bar bg-gray">
                <div className="progress-fill pink-fill" style={{ width: '100%' }}></div>
              </div>
              <span className="incentive-tag">10% Monthly Incentive</span>
            </div>
          </div>
        </div>

        {/* Pending Task */}
        <div className="dash-card compact-pending-card">
          <div className="pending-header">
            <CheckSquare size={18} className="green-text" />
            <h3>Pending Task</h3>
          </div>
          <ul className="task-list">
            <li>
              <span>Payment Reviews</span>
              <span className="badge">10</span>
            </li>
            <li>
              <span>Dispute</span>
              <span className="badge">5</span>
            </li>
            <li>
              <span>Vehicle Sticker Application</span>
              <span className="badge">3</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Dashboard Row 2: Monthly Goal & Billing Info */}
      <div className="dashboard-grid collector-middle-grid">
        {/* Monthly Collection Goal */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h2>Monthly Collection Goal</h2>
            <p>Progress toward achieving Zone 3 target for this billing cycle.</p>
          </div>
          <div className="goal-numbers">
            <div className="goal-main-stat">
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
          </div>
        </div>

        {/* Billing Cycle Info Box */}
        <div className="dash-card billing-info-stack">
          <div className="billing-block">
            <span className="billing-title">BILLING CYCLE</span>
            <span className="billing-value green-text-bold">July 2026</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAYS REMAINING</span>
            <span className="billing-value green-text-bold">8 Days</span>
          </div>
          <div className="billing-block">
            <span className="billing-title">DAILY AVE NEEDED</span>
            <span className="billing-value green-text-bold">2.0</span>
          </div>
        </div>
      </div>

      {/* Dashboard Row 3: Task Distribution */}
      <div className="dash-card">
        <div className="dash-card-header" style={{ marginBottom: '16px' }}>
          <h2>Task Distribution and Status</h2>
          <p>Operational progress across Zone 3 Categories</p>
        </div>

        <div className="distribution-stack">
          <div className="distribution-item">
            <div className="dist-label-row">
              <span className="dist-title">Dispute Handling</span>
              <span className="dist-percent">50%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill blue-fill" style={{ width: '50%' }}></div>
            </div>
          </div>

          <div className="distribution-item">
            <div className="dist-label-row">
              <span className="dist-title">Vehicle Sticker Applications</span>
              <span className="dist-percent">75%</span>
            </div>
            <div className="metric-progress-bar bg-gray">
              <div className="progress-fill light-blue-fill" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CollectorDashboard;