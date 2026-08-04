'use client';

import React, { useState } from 'react';
import { Search, ChevronRight, X, Bell } from 'lucide-react';
import './style.css';

const initialDisputesData = [
  { id: 1, name: 'Charlie D. Balagtas', address: 'Zone 3, 25 Camiling St.', initials: 'CB', txId: 'ARD-2026-0015', amount: '₱ 200', period: 'June 2026', category: 'Monthly Dues', color: 'bg-amber', reason: '“I already paid via Gcash last June 30 but the system still shows as unpaid. I have attached the screenshot of the transaction receipt below for verification”' },
  { id: 2, name: 'Daisy C. Perez', address: 'Zone 3, 5 Jalaur St.', initials: 'DP', txId: 'ARD-2026-0004', amount: '₱ 200', period: 'Jan 2026', category: 'Monthly Dues', color: 'bg-yellow', reason: '“Payment was made over-the-counter via the collector, but status is still reflecting unpaid in my portal.”' },
  { id: 3, name: 'Mark Jason G. Garcia', address: 'Zone 3, 9 Jalaur St.', initials: 'MG', txId: 'ARV-2026-0001', amount: '₱ 500', period: 'May 2026', category: 'Vehicle Sticker', color: 'bg-red', reason: '“Incorrect amount deducted for vehicle registration sticker validation.”' },
  { id: 4, name: 'Donna K. Kamias', address: 'Zone 3, 21 Pantabangan St.', initials: 'DK', txId: 'ARD-2026-0125', amount: '₱ 200', period: 'March 2026', category: 'Monthly Dues', color: 'bg-teal', reason: '“Transaction went through twice on my online banking account for March dues.”' },
  { id: 5, name: 'Mark Karl R. Cruz', address: 'Zone 3, 23 Pantabangan St.', initials: 'MC', txId: 'ARD-2026-0642', amount: '₱ 200', period: 'Dec 2025', category: 'Monthly Dues', color: 'bg-slate', reason: '“Already settled this payment prior to the system migration.”' },
  { id: 6, name: 'Donna K. Kamias', address: 'Zone 3, 21 Pantabangan St.', initials: 'DK', txId: 'ARD-2026-0827', amount: '₱ 200', period: 'March 2026', category: 'Monthly Dues', color: 'bg-teal', reason: '“Disputing late penalty fee charge as payment was submitted on time.”' },
  { id: 7, name: 'Mark Karl R. Cruz', address: 'Zone 3, 23 Pantabangan St.', initials: 'MC', txId: 'ARD-2026-0164', amount: '₱ 200', period: 'Dec 2025', category: 'Monthly Dues', color: 'bg-slate', reason: '“Incorrect recording of reference number for digital remittance.”' },
];

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [disputes, setDisputes] = useState(initialDisputesData);
  const [selectedDispute, setSelectedDispute] = useState(null);

  // Filter disputes based on search input
  const filteredDisputes = disputes.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle dispute resolution (Approve/Deny)
  const handleResolveDispute = (id) => {
    setDisputes((prev) => prev.filter((item) => item.id !== id));
    setSelectedDispute(null);
  };

  return (
    <div className="disputes-container">
      {/* Top Header Section matching Payments Layout */}
      <div className="disputes-header-row">
        <div>
          <h1 className="disputes-title">Disputes Management</h1>
          <p className="disputes-subtitle">Manage Residents Dispute</p>
        </div>
        
        <div className="payments-profile-right">
          <button className="notification-btn" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <div className="user-profile-badge">
            <div className="user-text-info">
              <span className="user-name">Marilou Del Rosario</span>
              <span className="user-role">COLLECTOR</span>
            </div>
            <div className="user-avatar-circle">CO</div>
          </div>
        </div>
      </div>

      {/* Toolbar Row matching Payments Layout (Search on the right) */}
      <div className="payments-toolbar-row">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Type a name here.." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="disputes-table-card">
        <table className="disputes-table">
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>TRANSACTION ID</th>
              <th>AMOUNT</th>
              <th>PERIOD</th>
              <th>CATEGORY</th>
              <th className="text-right"></th>
            </tr>
          </thead>
          <tbody>
            {filteredDisputes.length > 0 ? (
              filteredDisputes.map((item) => (
                <tr key={item.id} onClick={() => setSelectedDispute(item)} className="clickable-row">
                  <td>
                    <div className="resident-cell">
                      <div className={`avatar-badge ${item.color}`}>{item.initials}</div>
                      <div>
                        <div className="resident-name">{item.name}</div>
                        <div className="resident-address">{item.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="tx-id-cell">{item.txId}</td>
                  <td className="amount-cell">{item.amount}</td>
                  <td className="period-cell">{item.period}</td>
                  <td className="category-cell">{item.category}</td>
                  <td className="arrow-cell">
                    <button className="arrow-btn" onClick={(e) => { e.stopPropagation(); setSelectedDispute(item); }}>
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-records">No matching dispute records found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Pagination Footer */}
        <div className="table-footer">
          <span>Showing 1 to {filteredDisputes.length} of {disputes.length} pending escalated complaints</span>
          <div className="pagination-controls">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* REVIEW PAYMENT DISPUTE POP-UP MODAL */}
      {selectedDispute && (
        <div className="modal-backdrop">
          <div className="dispute-modal-card">
            <div className="modal-header">
              <div>
                <h3>Review Payment Dispute</h3>
                <p className="modal-subtitle-top">Review resident contesting record for transaction ID: {selectedDispute.txId}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedDispute(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="dispute-modal-body">
              <div className="dispute-grid-container">
                {/* Left Column: Resident Info & Reason */}
                <div className="dispute-left-col">
                  <div className="section-label">RESIDENT INFORMATION</div>
                  <div className="resident-info-box">
                    <div className="resident-info-header">
                      <div className={`avatar-badge ${selectedDispute.color}`}>{selectedDispute.initials}</div>
                      <div>
                        <div className="resident-name">{selectedDispute.name}</div>
                        <span className="in-dispute-tag">IN DISPUTE</span>
                      </div>
                    </div>
                    <div className="resident-address-label">ADDRESS</div>
                    <div className="resident-address-text">{selectedDispute.address}</div>
                  </div>

                  <div className="section-label" style={{ marginTop: '16px' }}>REASON FOR DISPUTE</div>
                  <div className="reason-box">
                    <p>{selectedDispute.reason}</p>
                  </div>
                </div>

                {/* Right Column: Dispute Details & Evidence */}
                <div className="dispute-right-col">
                  <div className="section-label">DISPUTE DETAILS</div>
                  <div className="details-grid-card">
                    <div className="detail-item">
                      <span className="detail-title">STATEMENT MONTH</span>
                      <span className="detail-value">{selectedDispute.period}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-title">TRANSACTION ID</span>
                      <span className="detail-value">{selectedDispute.txId}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-title">CATEGORY</span>
                      <span className="detail-value">{selectedDispute.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-title">TOTAL AMOUNT</span>
                      <span className="detail-value amount-green">{selectedDispute.amount}</span>
                    </div>
                  </div>

                  <div className="section-label" style={{ marginTop: '16px' }}>UPLOADED EVIDENCE</div>
                  <div className="evidence-preview-box">
                    <div className="mini-receipt-screen">
                      <div className="mini-receipt-top">✓ Successfully Sent</div>
                      <div className="mini-receipt-body">
                        <span>Amount</span>
                        <div className="line-placeholder"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Action Footer */}
              <div className="dispute-modal-footer">
                <button 
                  className="approve-dispute-btn" 
                  onClick={() => handleResolveDispute(selectedDispute.id)}
                >
                  APPROVE DISPUTE
                </button>
                <button 
                  className="deny-dispute-btn" 
                  onClick={() => handleResolveDispute(selectedDispute.id)}
                >
                  DENY DISPUTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}