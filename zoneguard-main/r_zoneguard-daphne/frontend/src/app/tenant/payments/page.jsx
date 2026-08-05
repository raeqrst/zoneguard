"use client";


import React, { useState } from 'react';
import {
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';
import './style.css';


export default function PaymentsPage() {
  const [activeYear, setActiveYear] = useState('2026');


  const ledgerData2026 = [
    { period: 'June 2026', mode: 'Digital', amount: '₱200.00', status: 'PAID', datePaid: 'June 04, 2026', hasOR: false },
    { period: 'May 2026', mode: 'Digital', amount: '₱200.00', status: 'PAID', datePaid: 'May 01, 2026', hasOR: false },
    { period: 'Apr 2026', mode: 'Digital', amount: '₱200.00', status: 'PAID', datePaid: 'April 01, 2026', hasOR: false },
    { period: 'Mar 2026', mode: 'Digital', amount: '₱200.00', status: 'PAID', datePaid: 'March 01, 2026', hasOR: false },
    { period: 'Feb 2026', mode: 'Cash', amount: '₱200.00', status: 'PAID', datePaid: 'February 21, 2026', hasOR: true },
    { period: 'Jan 2026', mode: 'Digital', amount: '₱200.00', status: 'PAID', datePaid: 'January 01, 2026', hasOR: false }
  ];


  return (
    <div className="tenant-page-container">
      {/* TOPBAR */}
      <header className="topbar">
        <div className="search-container">
          <Search size={16} className="search-icon" />
          <input type="text" className="search-input" placeholder="Search transactions, receipts..." />
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">Charlie B.</span>
            <span className="user-role">TENANT</span>
          </div>
          <div className="user-avatar">CB</div>
        </div>
      </header>


      <div className="main-content-wrapper">
        <div className="payments-main-container">
         
          {/* CURRENT OUTSTANDING BALANCE CARD */}
          <div className="balance-card">
            <div className="balance-card-top">
              <div className="balance-title-group">
                <h3>Current Outstanding Balance</h3>
                <h1 className="balance-amount">₱0.00</h1>
              </div>
              <div className="standing-badge">
                <CheckCircle2 size={14} /> IN GOOD STANDING
              </div>
            </div>


            <div className="balance-card-grid">
              <div className="balance-meta-item">
                <span className="meta-label">JUNE 2026 PAYMENT</span>
                <span className="meta-value">
                  <span className="status-pill-approved">APPROVED</span>
                </span>
              </div>
              <div className="balance-meta-item">
                <span className="meta-label">LAST PAYMENT</span>
                <span className="meta-value">June 04, 2026</span>
              </div>
              <div className="balance-meta-item">
                <span className="meta-label">PAYMENT METHOD</span>
                <span className="meta-value">Digital</span>
              </div>
              <div className="balance-meta-item" style={{ gridColumn: 'span 3', borderTop: '1px solid #f3f4f6', paddingTop: '12px', marginTop: '4px' }}>
                <span className="meta-label">NEXT BILLING CYCLE</span>
                <span className="meta-value">July 2026</span>
              </div>
            </div>
          </div>


          {/* ANNUAL PAYMENT LEDGER SECTION */}
          <div className="ledger-section">
            <div className="section-header">
              <h3>
                <FileText size={18} /> Annual Payment Ledger
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div className="year-tabs">
                  <button
                    className={`year-tab ${activeYear === '2026' ? 'active' : ''}`}
                    onClick={() => setActiveYear('2026')}
                  >
                    2026
                  </button>
                  <button
                    className={`year-tab ${activeYear === '2025' ? 'active' : ''}`}
                    onClick={() => setActiveYear('2025')}
                  >
                    2025
                  </button>
                </div>
                <button className="export-link">Export Year-to-End Statement</button>
              </div>
            </div>


            <div className="table-container">
              <table className="ledger-table">
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
                  {ledgerData2026.map((item, index) => (
                    <tr key={index} className="table-row">
                      <td className="period-cell">{item.period}</td>
                      <td>{item.mode}</td>
                      <td className="amount-cell">{item.amount}</td>
                      <td>
                        <span className="status-paid">{item.status}</span>
                      </td>
                      <td>{item.datePaid}</td>
                      <td>
                        <div className="action-cell">
                          <button className="btn-action">View AOR</button>
                          <button className="btn-action">Dispute</button>
                          {item.hasOR && <button className="btn-action">View OR</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}

