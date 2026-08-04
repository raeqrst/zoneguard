import React from 'react';
import './style.css';

const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
};

const consolidatedFinancialsData = [
  { cycle: 'January', gross: '₱70,800.00', net: '₱63,720.00', budget: '₱56,800.00', variance: '+₱6,920.00', positive: true },
  { cycle: 'February', gross: '₱37,000.00', net: '₱33,300.00', budget: '₱33,300.00', variance: '₱0', positive: false },
  { cycle: 'March', gross: '₱55,000.00', net: '₱49,500.00', budget: '₱45,000.00', variance: '+₱4,500.00', positive: true },
  { cycle: 'Quarterly Total', gross: '₱162,800.00', net: '₱146,520.00', budget: '₱146,520.00', variance: '+₱11,420.00', positive: true, isTotal: true },
];

const escalatedIssuesData = [
  { category: 'Infrastructure', total: '5', resolved: '5', active: '0' },
  { category: 'Public Relations', total: '4', resolved: '4', active: '0' },
  { category: 'Grievance', total: '3', resolved: '3', active: '0' },
  { category: 'Financial', total: '2', resolved: '2', active: '0' },
  { category: 'Beautification', total: '1', resolved: '1', active: '0' },
  { category: 'Sport', total: '1', resolved: '1', active: '0' },
];

export default function ExecutiveReportsPage() {
  return (
    <div className="main-content">
      {/* Top Header */}
      <header className="top-header">
        <div className="search-bar">
          <span className="search-icon">{Icons.search}</span>
          <input type="text" placeholder="Search reports..." />
        </div>

        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">Dir. Del Rosario</div>
            <div className="user-role">ZONE 3 DIRECTOR</div>
          </div>
          <div className="avatar">DR</div>
        </div>
      </header>

      {/* Page Title Header */}
      <div className="page-header">
        <div>
          <h1>Executive Reports</h1>
          <p className="page-subtitle">
            Strategic performance metrics and high-level financial health monitoring.
          </p>
        </div>
        <div className="header-actions-group">
          <button className="dropdown-select-btn">
            Q1 2026 (Jan - March) {Icons.chevronDown}
          </button>
          <button className="export-btn primary-export-btn">
            {Icons.download} Generate CSV File
          </button>
        </div>
      </div>

      {/* Table Section 1: Consolidated Financials */}
      <div className="table-card">
        <div className="section-card-header">
          Consolidated Financials
        </div>
        <table className="reports-table">
          <thead>
            <tr>
              <th>BILLING CYCLE</th>
              <th>GROSS COLLECTIONS</th>
              <th>NET COLLECTIBLE (AFTER 10% INCENTIVE)</th>
              <th>TOTAL ALLOCATED BUDGET</th>
              <th className="align-right">NET VARIANCE</th>
            </tr>
          </thead>
          <tbody>
            {consolidatedFinancialsData.map((row, idx) => (
              <tr key={idx} className={row.isTotal ? 'total-row' : ''}>
                <td className={row.isTotal ? 'bold-label' : ''}>{row.cycle}</td>
                <td>{row.gross}</td>
                <td>{row.net}</td>
                <td>{row.budget}</td>
                <td className={`align-right ${row.positive ? 'positive-variance' : ''}`}>
                  {row.variance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Table Section 2: Escalated Issues by Category */}
      <div className="table-card">
        <div className="section-card-header">
          Escalated Issues by Category
        </div>
        <table className="reports-table">
          <thead>
            <tr>
              <th>COMPLAINT CATEGORY</th>
              <th className="align-center">TOTAL ESCALATED</th>
              <th className="align-center">RESOLVED (REVERTED TO ADMIN WITH STATUS NOW RESOLVED)</th>
              <th className="align-center">CURRENTLY ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {escalatedIssuesData.map((row, idx) => (
              <tr key={idx}>
                <td className="category-cell-name">{row.category}</td>
                <td className="align-center">{row.total}</td>
                <td className="align-center resolved-count">{row.resolved}</td>
                <td className="align-center active-count">{row.active}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}