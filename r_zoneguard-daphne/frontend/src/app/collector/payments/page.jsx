'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, X, Upload } from 'lucide-react';
import './style.css';

const initialPaymentsData = [
  { id: 1, name: 'Charlie D. Balagtas', address: 'Zone 3, 25 Camiling St.', initials: 'CB', amount: '₱ 200', period: 'May 2026', color: 'bg-amber', transactionId: '#ARD-2026-0018', mode: 'Digital', refNumber: '1001 543 610110' },
  { id: 2, name: 'Daisy C. Perez', address: 'Zone 3, 5 Jalaur St.', initials: 'DP', amount: '₱ 200', period: 'Jan 2026', color: 'bg-yellow', transactionId: '#ARD-2026-0019', mode: 'Digital', refNumber: '1001 543 610111' },
  { id: 3, name: 'Mark Jason G. Garcia', address: 'Zone 3, 9 Jalaur St.', initials: 'MG', amount: '₱ 200', period: 'May 2026', color: 'bg-red', transactionId: '#ARD-2026-0020', mode: 'Digital', refNumber: '1001 543 610112' },
  { id: 4, name: 'Donna K. Kamias', address: 'Zone 3, 21 Pantabangan St.', initials: 'DK', amount: '₱ 200', period: 'March 2026', color: 'bg-teal', transactionId: '#ARD-2026-0021', mode: 'Digital', refNumber: '1001 543 610113' },
  { id: 5, name: 'Mark Karl R. Cruz', address: 'Zone 3, 23 Pantabangan St.', initials: 'MC', amount: '₱ 200', period: 'Dec 2025', color: 'bg-slate', transactionId: '#ARD-2026-0022', mode: 'Digital', refNumber: '1001 543 610114' },
  { id: 6, name: 'Donna K. Kamias', address: 'Zone 3, 21 Pantabangan St.', initials: 'DK', amount: '₱ 200', period: 'March 2026', color: 'bg-teal', transactionId: '#ARD-2026-0023', mode: 'Digital', refNumber: '1001 543 610115' },
  { id: 7, name: 'Mark Karl R. Cruz', address: 'Zone 3, 23 Pantabangan St.', initials: 'MC', amount: '₱ 200', period: 'Dec 2025', color: 'bg-slate', transactionId: '#ARD-2026-0024', mode: 'Digital', refNumber: '1001 543 610116' },
];

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [payments, setPayments] = useState(initialPaymentsData);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isRemitModalOpen, setIsRemitModalOpen] = useState(false);

  // Filter payments based on search input
  const filteredPayments = payments.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle Accept or Decline actions
  const handleAction = (id) => {
    setPayments((prev) => prev.filter((item) => item.id !== id));
    if (selectedPayment && selectedPayment.id === id) {
      setSelectedPayment(null);
    }
  };

  return (
    <div className="payments-container">
      {/* Top Header Section */}
      <div className="payments-header-row">
        <div>
          <h1 className="payments-title">Digital Payment Management</h1>
          <p className="payments-subtitle">Approve digital transactions.</p>
        </div>
        
        {/* Top Right: Notification & Profile Group */}
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

      {/* Second Row: Search and Remit Button on the Right */}
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
        <button className="remit-btn" onClick={() => setIsRemitModalOpen(true)}>
          <Plus size={16} /> REMIT COLLECTION
        </button>
      </div>

      {/* Main Table Card */}
      <div className="payments-table-card">
        <table className="payments-table">
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>AMOUNT</th>
              <th>PERIOD</th>
              <th>DOCUMENT</th>
              <th className="text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPayments.length > 0 ? (
              filteredPayments.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="resident-cell">
                      <div className={`avatar-badge ${item.color}`}>{item.initials}</div>
                      <div>
                        <div className="resident-name">{item.name}</div>
                        <div className="resident-address">{item.address}</div>
                      </div>
                    </div>
                  </td>
                  <td className="amount-cell">{item.amount}</td>
                  <td className="period-cell">{item.period}</td>
                  <td className="document-cell">
                    <button 
                      onClick={() => setSelectedPayment(item)} 
                      className="view-docs-link-btn"
                    >
                      View Documents 👁
                    </button>
                  </td>
                  <td className="action-cell">
                    <div className="action-buttons-group">
                      <button onClick={() => handleAction(item.id)} className="accept-btn">ACCEPT</button>
                      <button onClick={() => handleAction(item.id)} className="decline-btn">DECLINE</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-records">No matching records found.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Table Pagination Footer */}
        <div className="table-footer">
          <span>Showing 1 to {filteredPayments.length} of {payments.length} pending digital transactions</span>
          <div className="pagination-controls">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* PROOF OF PAYMENT MODAL */}
      {selectedPayment && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>PROOF OF PAYMENT</h3>
              <button className="close-btn" onClick={() => setSelectedPayment(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="receipt-preview-box">
                <div className="mock-receipt-screen">
                  <div className="receipt-top-bar">
                    <span>Express Send</span>
                  </div>
                  <div className="receipt-content">
                    <div className="success-badge">✓ Successfully Sent</div>
                    <div className="receipt-row"><span>Amount</span><strong>{selectedPayment.amount}</strong></div>
                    <div className="receipt-row"><span>Total</span><strong>{selectedPayment.amount}</strong></div>
                    <div className="ref-tag">Ref. No. {selectedPayment.refNumber}</div>
                    <div className="gcash-label">GCash Send Money</div>
                  </div>
                </div>
              </div>

              <div className="payment-details-box">
                <div className="details-card">
                  <h4>Payment Details</h4>
                  <p><strong>Transaction ID:</strong><br/>{selectedPayment.transactionId}</p>
                  <p><strong>Mode of Payment:</strong><br/>{selectedPayment.mode}</p>
                  <p><strong>Reference Number:</strong><br/>{selectedPayment.refNumber}</p>
                  <p><strong>Amount:</strong><br/><span className="amount-highlight">{selectedPayment.amount}</span></p>
                </div>
                
                <button 
                  className="proceed-receipt-btn"
                  onClick={() => handleAction(selectedPayment.id)}
                >
                  Proceed to Issue Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REMIT MONTHLY DUES MODAL */}
      {isRemitModalOpen && (
        <div className="modal-backdrop">
          <div className="remit-modal-card">
            <div className="modal-header">
              <h3>REMIT MONTHLY DUES</h3>
              <button className="close-btn" onClick={() => setIsRemitModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="remit-modal-body">
              <div className="remit-section-label">TRANSACTION DETAILS</div>
              
              <div className="remit-grid-row">
                <div className="remit-input-group">
                  <label>COLLECTOR</label>
                  <input type="text" readOnly defaultValue="MARILOU DEL ROSARIO" className="remit-input readonly-input" />
                </div>
                <div className="remit-input-group month-group">
                  <label>MONTH</label>
                  <input type="text" defaultValue="MAY" className="remit-input" />
                </div>
                <div className="remit-input-group year-group">
                  <label>YEAR</label>
                  <input type="text" defaultValue="2026" className="remit-input" />
                </div>
              </div>

              <div className="remit-grid-row" style={{ marginTop: '16px' }}>
                <div className="remit-input-group">
                  <label>AMOUNT</label>
                  <input type="text" placeholder="eg. 94,000" className="remit-input" />
                </div>
                <div className="remit-input-group" style={{ gridColumn: 'span 2' }}>
                  <label>BANK TRANSACTION NUMBER</label>
                  <input type="text" placeholder="eg. 9012345678910" className="remit-input" />
                </div>
              </div>

              <div className="remit-section-label" style={{ marginTop: '24px' }}>UPLOAD OFFICIAL RECEIPT</div>
              
              <div className="upload-dropzone">
                <div className="upload-content">
                  <Upload size={24} className="upload-icon-green" />
                  <span className="upload-main-text">Upload OR</span>
                  <span className="upload-sub-text">JPG, PNG (Max 5MB)</span>
                </div>
              </div>

              <div className="remit-modal-footer">
                <button className="upload-remittance-btn" onClick={() => setIsRemitModalOpen(false)}>
                  UPLOAD REMITTANCE
                </button>
                <button className="reject-transaction-btn" onClick={() => setIsRemitModalOpen(false)}>
                  REJECT TRANSACTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}