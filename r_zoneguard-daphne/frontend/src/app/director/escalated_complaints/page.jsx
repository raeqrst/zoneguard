'use client';
import React, { useState } from 'react';
import './style.css';

const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  export: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trendingUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  fileText: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
};

const categoryFilters = [
  { label: 'All Pending (10)', key: 'All Pending' },
  { label: 'Infrastructure (3)', key: 'INFRASTRUCTURE' },
  { label: 'Public Relations (2)', key: 'PUBLIC RELATIONS' },
  { label: 'Grievance (2)', key: 'GRIEVANCE' },
  { label: 'Financial (1)', key: 'FINANCIAL' },
  { label: 'Beautification (1)', key: 'BEAUTIFICATION' },
  { label: 'Sport (1)', key: 'SPORT' },
  { label: 'Resolved History (6)', key: 'Resolved History' },
];

const complaintsData = [
  {
    ticket: 'F3-0015',
    init: 'DV',
    bgColor: '#713f12',
    name: 'Darth C. Vader',
    address: 'Blk 8 Lot 61 01 Palico Lane St.',
    category: 'FINANCIAL',
    catClass: 'badge-financial',
    status: 'Escalated',
    subject: 'Ledger Reversal',
    description: 'I received two reimbursements for the project supplies instead of one. Please fix this.',
    dateFiled: '4/5/2026',
    escalationReason: 'Accounting error detected (duplicate transaction entry). Need authorization for ledger reversal.'
  },
  {
    ticket: 'I3-0003',
    init: 'SG',
    bgColor: '#6b21a8',
    name: 'Sheena D. Guzman',
    address: 'Zone 3, 76 Pantabangan St.',
    category: 'INFRASTRUCTURE',
    catClass: 'badge-infra',
    status: 'Escalated',
    subject: 'Broken Streetlights',
    description: 'The streetlights along Pantabangan St. have been out for over a week, creating safety issues at night.',
    dateFiled: '4/6/2026',
    escalationReason: 'Unresolved maintenance ticket exceeding standard SLA window.'
  },
  {
    ticket: 'B3-0021',
    init: 'ES',
    bgColor: '#9d174d',
    name: 'Elena P. Soriano',
    address: 'Zone 3, 4 Camiling St.',
    category: 'BEAUTIFICATION',
    catClass: 'badge-beautification',
    status: 'Escalated',
    subject: 'Unauthorized Tree Cut',
    description: 'A neighboring resident cut down mature trees without securing clearance from the village committee.',
    dateFiled: '4/7/2026',
    escalationReason: 'Violation of environmental and beautification ordinances requiring penalty enforcement.'
  },
  {
    ticket: 'P3-0024',
    init: 'JI',
    bgColor: '#1d4ed8',
    name: 'Jeffrey B. Ignacio',
    address: 'Blk 8 Lot 39 15 Jalaur St.',
    category: 'PUBLIC RELATIONS',
    catClass: 'badge-pr',
    status: 'Escalated',
    subject: 'Fake Memo Alert',
    description: 'Unverified announcements regarding fee hikes are circulating, causing confusion among residents.',
    dateFiled: '4/8/2026',
    escalationReason: 'Public misinformation requiring formal executive retraction memo.'
  },
  {
    ticket: 'I3-0004',
    init: 'JM',
    bgColor: '#c2410c',
    name: 'Joseph N. Mendoza',
    address: 'Zone 3, 24 Camiling St.',
    category: 'INFRASTRUCTURE',
    catClass: 'badge-infra',
    status: 'Escalated',
    subject: 'Water Line Burst',
    description: 'Main water line leak near Camiling St. causing low pressure and wastage.',
    dateFiled: '4/9/2026',
    escalationReason: 'Emergency infrastructure hazard requiring immediate contractor dispatch.'
  },
  {
    ticket: 'G3-0017',
    init: 'DO',
    bgColor: '#15803d',
    name: 'Dorothy L. Ortega',
    address: 'Zone 3, 23 Camiling St.',
    category: 'GRIEVANCE',
    catClass: 'badge-grievance',
    status: 'Escalated',
    subject: 'Midnight Noise',
    description: 'Persistent loud construction and gatherings past curfew hours.',
    dateFiled: '4/10/2026',
    escalationReason: 'Repeated noise ordinance violation despite initial warnings.'
  }
];

export default function EscalatedComplaintsPage() {
  const [activeFilter, setActiveFilter] = useState('All Pending');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Filter complaints based on the selected category chip
  const filteredData = complaintsData.filter((item) => {
    if (activeFilter === 'All Pending') {
      return item.status === 'Escalated';
    }
    if (activeFilter === 'Resolved History') {
      return item.status === 'Resolved';
    }
    return item.status === 'Escalated' && item.category === activeFilter;
  });

  const handleResolve = (ticketId) => {
    alert(`Complaint ${ticketId} marked as resolved successfully.`);
  };

  return (
    <div className="main-content">
      {/* Top Header */}
      <header className="top-header">
        <div className="search-bar">
          <span className="search-icon">{Icons.search}</span>
          <input type="text" placeholder="Search ticket id or residents..." />
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
          <h1>Escalated Complaints Triage</h1>
          <p className="page-subtitle">
            Executive oversight for unresolved community grievances requiring Director-level finality.
          </p>
        </div>
        <button className="export-btn">
          {Icons.export} Export CSV
        </button>
      </div>

      {/* Category Filters + Protocols Grid */}
      <div className="top-section-grid">
        <div className="filters-container">
          <div className="pill-group">
            {categoryFilters.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`pill-btn ${isActive ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="info-text">
            ⓘ All pending represents the backlog of unresolved cases currently requiring executive oversight.
          </div>
        </div>

        <div className="protocol-card">
          <div className="protocol-title">
            <span className="protocol-icon">{Icons.shield}</span> Executive Protocols
          </div>
          <ul className="protocol-list">
            <li>
              <span className="check-icon">✓</span>
              Complaints escalated to the Director must be resolved within 48 hours.
            </li>
            <li>
              <span className="check-icon">✓</span>
              Provide a final resolution summary upon completing the triage.
            </li>
          </ul>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="table-card">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>TICKET ID</th>
              <th>RESIDENT</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>COMPLAINT SUBJECT</th>
              <th className="align-right">EXECUTIVE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                  No complaints found for this category.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.ticket}>
                  <td className="ticket-cell">{row.ticket}</td>
                  <td>
                    <div className="resident-cell">
                      <div className="res-avatar" style={{ backgroundColor: row.bgColor }}>
                        {row.init}
                      </div>
                      <div>
                        <div className="res-name">{row.name}</div>
                        <div className="res-address">{row.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`cat-badge ${row.catClass}`}>{row.category}</span>
                  </td>
                  <td>
                    <span className="status-dot"></span>
                    <span className="status-text">{row.status}</span>
                  </td>
                  <td className="subject-cell">{row.subject}</td>
                  <td>
                    <div className="actions-cell">
                      {/* Clicking the eye icon sets the selected complaint state, opening the modal */}
                      <button 
                        className="view-btn" 
                        title="View details"
                        onClick={() => setSelectedComplaint(row)}
                      >
                        {Icons.eye}
                      </button>
                      <button 
                        className="action-btn resolve-btn"
                        onClick={() => handleResolve(row.ticket)}
                      >
                        Resolve
                      </button>
                      <button className="action-btn icon-btn" title="View Location">
                        {Icons.location}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table Footer */}
        <div className="table-footer">
          <span className="footer-info">Showing 1 to {filteredData.length} of 10 pending escalated complaints</span>
          <div className="pagination">
            <button className="page-nav">&lt;</button>
            <button className="page-num active">1</button>
            <button className="page-num">2</button>
            <button className="page-nav">&gt;</button>
          </div>
        </div>
      </div>

      {/* Modal Popup for Details */}
      {selectedComplaint && (
        <div className="modal-overlay">
          <div className="modal-container">
            <button className="modal-close-btn" onClick={() => setSelectedComplaint(null)}>
              {Icons.close}
            </button>
            
            <div className="modal-left">
              <div className="modal-subject-section">
                <span className="modal-section-label">SUBJECT</span>
                <h2>{selectedComplaint.subject}</h2>
              </div>
              <div className="modal-desc-section">
                <span className="modal-section-label">DESCRIPTION</span>
                <p>{selectedComplaint.description}</p>
              </div>
              <div className="modal-evidence-section">
                <span className="modal-section-label">PHOTO EVIDENCE (2)</span>
                <div className="evidence-boxes">
                  <div className="evidence-box-placeholder"></div>
                  <div className="evidence-box-placeholder"></div>
                </div>
              </div>
            </div>

            <div className="modal-right">
              <div className="modal-right-header">
                <h3>CASE # {selectedComplaint.ticket}</h3>
              </div>
              
              <div className="modal-card-box">
                <span className="box-label">Uploaded by:</span>
                <div className="box-val font-semibold">{selectedComplaint.name}</div>
                <span className="box-label mt-2">Address:</span>
                <div className="box-val">{selectedComplaint.address}</div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.calendar}</span>
                <div>
                  <div className="tile-title">DATE FILED</div>
                  <div className="tile-sub">{selectedComplaint.dateFiled}</div>
                </div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.trendingUp}</span>
                <div>
                  <div className="tile-title">ESCALATION REASON</div>
                  <div className="tile-sub">{selectedComplaint.escalationReason}</div>
                </div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.fileText}</span>
                <div>
                  <div className="tile-title">CATEGORY</div>
                  <div className="tile-sub" style={{ textTransform: 'capitalize' }}>
                    {selectedComplaint.category.toLowerCase()}
                  </div>
                </div>
              </div>

              <button className="modal-download-btn">
                Download Evidence
              </button>
              <button 
                className="modal-resolve-btn"
                onClick={() => {
                  handleResolve(selectedComplaint.ticket);
                  setSelectedComplaint(null);
                }}
              >
                Confirm and Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}