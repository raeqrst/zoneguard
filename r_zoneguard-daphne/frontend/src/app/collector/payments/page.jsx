'use client';

import { useState, useEffect } from 'react';
import './style.css';

export default function CollectorPaymentsPage() {
  const [payments, setPayments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [loading, setLoading] = useState(true);
<<<<<<< HEAD

  // Fetch pending payments connected to backend Prisma API
=======
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  useEffect(() => {
    async function loadPayments() {
      setLoading(true);
      try {
        const res = await fetch(`/api/collector/payments?search=${encodeURIComponent(searchTerm)}`);
<<<<<<< HEAD
        const result = await res.json();
        if (result.success) {
          setPayments(result.data);
        }
      } catch (err) {
        console.error("Failed fetching payments:", err);
=======
        if (res.ok) {
          const result = await res.json();
          if (result.success && result.data) {
            setPayments(result.data);
          }
        }
      } catch (err) {
        console.error("Failed fetching payments from backend:", err);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      } finally {
        setLoading(false);
      }
    }

    const delayDebounce = setTimeout(() => {
      loadPayments();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

<<<<<<< HEAD
  // Handle Accepting or Declining a payment
  const handleUpdateStatus = async (paymentId, status) => {
    try {
      const res = await fetch('/api/collector/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId, status }),
=======
  // Reset to page 1 whenever the user types in the search box
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleUpdateStatus = async (paymentId, status) => {
    try {
      const res = await fetch(`/api/collector/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      });

      if (res.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        if (selectedPayment?.id === paymentId) {
          setSelectedPayment(null);
        }
<<<<<<< HEAD
      }
    } catch (err) {
      console.error("Failed to update payment status:", err);
    }
  };

  return (
    <div className="payments-page">
      {/* Title Header */}
=======
        
        // Handle edge case: if approving the last item on a page, go back one page
        if (paginatedPayments.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        }
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  // 1. Filter the payments based on search
  const filteredPayments = payments.filter(p => 
    (p.name && p.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 2. Calculate pagination boundaries
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // 3. Slice the array to only show 8 items per page
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  return (
    <div className="payments-page">
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      <div className="page-title-section">
        <div className="title-content">
          <h1>Digital Payment Management</h1>
          <p>Approve digital transactions.</p>
        </div>
      </div>

<<<<<<< HEAD
      {/* Toolbar */}
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
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

<<<<<<< HEAD
      {/* Table */}
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
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
<<<<<<< HEAD
            ) : payments.length > 0 ? (
              payments.map((row) => (
=======
            ) : paginatedPayments.length > 0 ? (
              // Use paginatedPayments instead of filteredPayments here
              paginatedPayments.map((row) => (
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
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

<<<<<<< HEAD
        {/* Footer */}
        <div className="table-footer">
          <span>Showing 1 to {payments.length} of {payments.length} pending digital transactions</span>
          <div className="pagination">
            <button className="page-btn">{'<'}</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">{'>'}</button>
          </div>
        </div>
      </div>

      {/* Proof of Payment Detail View Modal */}
=======
        <div className="table-footer">
          <span>
            Showing {filteredPayments.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredPayments.length)} of {filteredPayments.length} pending digital transactions
          </span>
          
          {/* Conditionally render pagination ONLY if there is more than 1 page */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
              >
                {'<'}
              </button>
              
              {/* Generate dynamic page numbers based on totalPages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button 
                  key={page} 
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button 
                className="page-btn" 
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
              >
                {'>'}
              </button>
            </div>
          )}
        </div>
      </div>

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
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