'use client';

import { useState, useEffect } from 'react';
import './style.css';

export default function CollectorPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        const res = await fetch(`/api/collector/payments?search=${encodeURIComponent(searchTerm)}`);
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setPayments(result.data);
          }
        }
      } catch (err) {
        console.error("Failed fetching payments from backend:", err);
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      loadPayments();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  const handleUpdateStatus = async (paymentId, status) => {
    try {
      const res = await fetch(`/api/collector/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        if (selectedPayment?.id === paymentId) {
          setSelectedPayment(null);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const filteredPayments = payments.filter(p => 
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="payments-page">
      <div className="page-title-section">
        <div className="title-content">
          <h1>Digital Payment Management</h1>
          <p>Approve digital transactions.</p>
        </div>
      </div>

      <div className="toolbar-section">
        <div className="search-box">
          <svg className="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            placeholder="Type a name here..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="btn-remit">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          REMIT COLLECTION
        </button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>AMOUNT</th>
              <th>PERIOD</th>
              <th>DOCUMENT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                  Loading digital payments...
                </td>
              </tr>
            ) : filteredPayments.length > 0 ? (
              filteredPayments.map((row) => (
                <tr key={row.id}>
                  <td>
                    <div className="resident-cell">
                      <div className="resident-avatar" style={{ backgroundColor: row.bgColor || '#8a6d3b' }}>
                        {row.initials}
                      </div>
                      <div className="resident-info">
                        <strong>{row.name}</strong>
                        <span>{row.address}</span>
                      </div>
                    </div>
                  </td>
                  <td><strong>{row.amount}</strong></td>
                  <td>{row.period}</td>
                  <td>
                    <button className="doc-link-btn" onClick={() => setSelectedPayment(row)}>
                      View Documents 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    </button>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-accept" onClick={() => handleUpdateStatus(row.id, 'ACCEPTED')}>
                        ACCEPT
                      </button>
                      <button className="btn-decline" onClick={() => handleUpdateStatus(row.id, 'DECLINED')}>
                        DECLINE
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                  No pending transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Showing 1 to {filteredPayments.length} of {filteredPayments.length} pending digital transactions</span>
          <div className="pagination">
            <button className="page-btn">{'<'}</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">{'>'}</button>
          </div>
        </div>
      </div>

      {selectedPayment && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>PROOF OF PAYMENT</h3>
              <button className="btn-close" onClick={() => setSelectedPayment(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="receipt-screen">
                <div className="receipt-banner">Express Send</div>
                <div className="receipt-row">
                  <span>Amount</span>
                  <strong>{selectedPayment.amount}</strong>
                </div>
                <div className="receipt-row">
                  <span>Mode</span>
                  <span>GCash Send Money</span>
                </div>
                <div className="receipt-ref">
                  Ref. No. {selectedPayment.refNumber || '1001 543 610110'}
                </div>
              </div>

              <div>
                <div className="details-box">
                  <h4>Payment Details</h4>
                  <p><strong>Transaction ID:</strong><br />{selectedPayment.transactionId || '#ARD-2026-0018'}</p>
                  <p><strong>Mode of Payment:</strong><br />Digital</p>
                  <p><strong>Reference Number:</strong><br />{selectedPayment.refNumber || '1001 543 610110'}</p>
                  <p><strong>Amount:</strong><br /><span className="highlight-green">{selectedPayment.amount}</span></p>
                </div>
                <button className="btn-issue" onClick={() => handleUpdateStatus(selectedPayment.id, 'ACCEPTED')}>
                  Proceed to Issue Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}