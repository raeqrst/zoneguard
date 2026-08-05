'use client';

import React, { useState } from 'react';
import './style.css';

// SVG Icons
const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  list: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )
};

const ledgerData2026 = [
  { period: 'June 2026', mode: '-', amount: '₱200.00', statusType: 'withArrears', statusText: 'WITH ARREARS', datePaid: 'Past Due', actions: ['Pay Now', 'Dispute'] },
  { period: 'May 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'May 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Apr 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'April 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Mar 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'March 01, 2026', actions: ['View AOR', 'Dispute'] },
  { period: 'Feb 2026', mode: 'Cash', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'February 21, 2026', actions: ['View AOR', 'View OR', 'Dispute'] },
  { period: 'Jan 2026', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'January 01, 2026', actions: ['View AOR', 'Dispute'] },
];

const ledgerData2025 = [
  { period: 'Dec 2025', mode: 'Digital', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'December 01, 2025', actions: ['View AOR', 'Dispute'] },
  { period: 'Nov 2025', mode: 'Cash', amount: '₱200.00', statusType: 'paid', statusText: 'PAID', datePaid: 'November 05, 2025', actions: ['View AOR', 'Dispute'] },
];

export default function HomeownerPaymentsPage() {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null); // 'pay' | 'dispute' | 'view'
  const [modalPayload, setModalPayload] = useState({ period: '', action: '' });
  const [disputeReason, setDisputeReason] = useState('');

  const currentLedger = (selectedYear === '2026' ? ledgerData2026 : ledgerData2025).filter((row) =>
    row.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.statusText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleActionClick = (action, period) => {
    setModalPayload({ period, action });
    if (action === 'Pay Now') {
      setActiveModal('pay');
    } else if (action === 'Dispute') {
      setDisputeReason('');
      setActiveModal('dispute');
    } else {
      setActiveModal('view');
    }
  };

  const handleExportStatement = () => {
    alert(`Exporting Year-to-End Statement for ${selectedYear}...`);
  };

  return (
    <div className="zg-payments-container">
      {/* Search Bar */}
      <div className="zg-topbar">
        <div className="zg-search-container">
          <span className="zg-search-icon">{Icons.search}</span>
          <input
            type="text"
            className="zg-search-input"
            placeholder="Search transactions, receipts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Current Outstanding Balance Card */}
      <div className="zg-balance-card">
        <div className="zg-balance-header">
          <div>
            <span className="zg-balance-title">Current Outstanding Balance</span>
            <h1 className="zg-balance-amount">₱200.00</h1>
          </div>
          <div className="zg-arrears-badge">
            {Icons.warning}
            WITH ARREARS
          </div>
        </div>

        <div className="zg-balance-grid">
          <div>
            <span className="zg-stat-label">JUNE 2026 PAYMENT</span>
            <span className="zg-badge-rejected">REJECTED</span>
          </div>
          <div>
            <span className="zg-stat-label">LAST PAYMENT</span>
            <span className="zg-stat-value">May 01, 2026</span>
          </div>
          <div>
            <span className="zg-stat-label">PAYMENT METHOD</span>
            <span className="zg-stat-value">Digital</span>
          </div>
          <div>
            <span className="zg-stat-label">NEXT BILLING CYCLE</span>
            <span className="zg-stat-value">-</span>
          </div>
        </div>
      </div>

      {/* Annual Payment Ledger Section */}
      <div className="zg-ledger-card">
        <div className="zg-ledger-topbar">
          <div className="zg-ledger-title-area">
            {Icons.list}
            <h2 className="zg-ledger-heading">Annual Payment Ledger</h2>
            <div className="zg-year-toggle">
              <button
                className={`zg-year-btn ${selectedYear === '2026' ? 'active' : ''}`}
                onClick={() => setSelectedYear('2026')}
              >
                2026
              </button>
              <button
                className={`zg-year-btn ${selectedYear === '2025' ? 'active' : ''}`}
                onClick={() => setSelectedYear('2025')}
              >
                2025
              </button>
            </div>
          </div>

          <button className="zg-export-btn" onClick={handleExportStatement}>
            Export Year-to-End Statement
          </button>
        </div>

        {/* Ledger Table */}
        <div className="zg-table-wrapper">
          <table className="zg-table">
            <thead>
              <tr>
                <th>PERIOD</th>
                <th>MODE</th>
                <th>AMOUNT</th>
                <th>STATUS</th>
                <th>DATE PAID</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {currentLedger.length > 0 ? (
                currentLedger.map((row, index) => (
                  <tr key={index}>
                    <td>{row.period}</td>
                    <td>{row.mode}</td>
                    <td>{row.amount}</td>
                    <td>
                      <span className={row.statusType === 'withArrears' ? 'zg-status-badge-arrears' : 'zg-status-badge-paid'}>
                        {row.statusText}
                      </span>
                    </td>
                    <td className={row.datePaid === 'Past Due' ? 'zg-text-past-due' : ''}>
                      {row.datePaid}
                    </td>
                    <td>
                      <div className="zg-action-buttons">
                        {row.actions.map((action, actIdx) => (
                          <button
                            key={actIdx}
                            className={
                              action === 'Pay Now'
                                ? 'zg-btn-pay'
                                : action === 'Dispute'
                                ? 'zg-btn-dispute'
                                : 'zg-btn-generic'
                            }
                            onClick={() => handleActionClick(action, row.period)}
                          >
                            {action}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                    No payment records found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Modals */}
      {activeModal && (
        <div className="zg-modal-overlay">
          <div className="zg-modal-card">
            {activeModal === 'pay' && (
              <>
                <h3 className="zg-modal-title">Pay Outstanding Dues</h3>
                <p className="zg-modal-body">
                  Submitting payment for <strong>{modalPayload.period}</strong> (Amount: ₱200.00).
                </p>
                <label className="zg-stat-label">Select Payment Method</label>
                <select className="zg-modal-input">
                  <option>GCash / Digital Transfer</option>
                  <option>Bank Transfer (BDO/BPI)</option>
                  <option>Over the Counter (HOA Office)</option>
                </select>
                <label className="zg-stat-label">Upload Proof of Payment</label>
                <input type="file" className="zg-modal-input" />
                <div className="zg-modal-actions">
                  <button className="zg-btn-dispute" onClick={() => setActiveModal(null)}>
                    Cancel
                  </button>
                  <button className="zg-btn-pay" onClick={() => { alert('Payment proof submitted for verification.'); setActiveModal(null); }}>
                    Submit Payment
                  </button>
                </div>
              </>
            )}

            {activeModal === 'dispute' && (
              <>
                <h3 className="zg-modal-title">File Payment Dispute</h3>
                <p className="zg-modal-body">
                  Filing a dispute for <strong>{modalPayload.period}</strong> record.
                </p>
                <label className="zg-stat-label">Reason for Dispute</label>
                <textarea
                  className="zg-modal-textarea"
                  rows="3"
                  placeholder="Explain why this record is incorrect..."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                ></textarea>
                <div className="zg-modal-actions">
                  <button className="zg-btn-dispute" onClick={() => setActiveModal(null)}>
                    Cancel
                  </button>
                  <button className="zg-btn-pay" onClick={() => { alert('Dispute ticket generated and submitted to HOA admin.'); setActiveModal(null); }}>
                    Submit Dispute
                  </button>
                </div>
              </>
            )}

            {activeModal === 'view' && (
              <>
                <h3 className="zg-modal-title">{modalPayload.action}</h3>
                <p className="zg-modal-body">
                  Fetching digital document record for <strong>{modalPayload.period}</strong>...
                </p>
                <div className="zg-modal-actions">
                  <button className="zg-btn-pay" onClick={() => setActiveModal(null)}>
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}