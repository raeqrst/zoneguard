'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import './style.css';

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
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  upload: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#044e3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
};

function HomeownerPaymentsContent() {
  const searchParams = useSearchParams();
  const propertyId = searchParams.get('propertyId') || '';

  const [selectedYear, setSelectedYear] = useState('2026');
  const [searchQuery, setSearchQuery] = useState('');

  // Payment Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Dispute Modal states
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeEvidence, setDisputeEvidence] = useState(null);

  // Dispute Summary Status Modal states
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [activeDisputeRecord, setActiveDisputeRecord] = useState(null);

  // Live dynamic state from backend
  const [balance, setBalance] = useState(0.00);
  const [isDelinquent, setIsDelinquent] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPaymentsData = async (propId) => {
    setLoading(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const url = new URL('http://localhost:5000/api/homeowner/payments');
      if (propId) url.searchParams.append('propertyId', propId);
      if (loggedInUserId) url.searchParams.append('userId', loggedInUserId);
      
      // 🌟 NEW: Add a timestamp to permanently break browser caching
      url.searchParams.append('_t', new Date().getTime());

      // 🌟 NEW: Force 'no-store' to ensure we grab the updated DB values
      const res = await fetch(url.toString(), {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setBalance(data.balance);
        setIsDelinquent(data.isDelinquent);
        setTransactions(data.transactions);
      }
    } catch (err) {
      console.error('Failed to load payment ledger:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentsData(propertyId);
  }, [propertyId]);

  const filteredLedger = transactions.filter((row) => {
    const matchesYear = row.year === selectedYear;
    const matchesSearch =
      row.period.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.mode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.statusText.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesYear && matchesSearch;
  });

  const handleActionClick = async (action, row) => {
    if (action === 'Pay Now') {
      setActiveRow(row);
      setReferenceNumber('');
      setProofFile(null);
      setIsModalOpen(true);
    } else if (action === 'Dispute') {
      setActiveRow(row);
      setDisputeReason('');
      setDisputeEvidence(null);
      setIsDisputeModalOpen(true);
    } else if (action === 'Status') {
      // Handles Dispute Status Tracker
      setActiveDisputeRecord(row);
      try {
        const res = await fetch(`http://localhost:5000/api/homeowner/disputes/${row.id}`);
        if (res.ok) {
          const disputeData = await res.json();
          setActiveDisputeRecord({ ...row, ...disputeData });
        }
      } catch (e) {
        console.error("Could not fetch dispute details", e);
      }
      setIsSummaryModalOpen(true);
    } else if (action === 'View Status') {
      // Handles Payment Validation (Collector's Approval Queue) Status Tracker
      setActiveDisputeRecord(row);
      try {
        const res = await fetch(`http://localhost:5000/api/homeowner/transactions/${row.id}`);
        if (res.ok) {
          const txData = await res.json();
          setActiveDisputeRecord({
            ...row,
            homeownerClaim: `Reference Number: ${txData.referenceNo || 'N/A'}`,
            evidenceUrl: txData.paymentMethod ? `Payment Method: ${txData.paymentMethod}` : 'Digital Submission'
          });
        }
      } catch (e) {
        console.error("Could not fetch transaction details", e);
      }
      setIsSummaryModalOpen(true);
    } else {
      alert(`Viewing document record for ${row.period}`);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setProofFile(file);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!referenceNumber.trim()) {
      alert('Please enter a reference number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const response = await fetch('http://localhost:5000/api/homeowner/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          referenceNumber: referenceNumber.trim(),
          propertyId: propertyId,
          userId: loggedInUserId,
          billingId: activeRow?.id
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Payment submitted successfully for validation!');
        setIsModalOpen(false);
        setReferenceNumber('');
        setProofFile(null);
        fetchPaymentsData(propertyId);
      } else {
        alert('Failed to submit payment: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      alert('Network error while submitting payment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisputeSubmit = async (e) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert('Please enter a reason for your dispute.');
      return;
    }

    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const response = await fetch('http://localhost:5000/api/homeowner/disputes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: propertyId,
          userId: loggedInUserId,
          billingId: activeRow?.id,
          referenceMonth: activeRow?.period,
          homeownerClaim: disputeReason.trim(),
          evidenceUrl: disputeEvidence ? disputeEvidence.name : null
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Dispute successfully filed and routed to the review queue.');
        setIsDisputeModalOpen(false);
        fetchPaymentsData(propertyId);
      } else {
        alert('Failed to file dispute: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Dispute submission network error:', err);
      alert('Network error while submitting dispute.');
    }
  };

  const lastPaidTransaction = transactions.find(t => t.statusText === 'PAID');

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
            <h1 className="zg-balance-amount">₱{balance.toFixed(2)}</h1>
          </div>
          {isDelinquent && (
            <div className="zg-arrears-badge">
              {Icons.warning}
              WITH ARREARS
            </div>
          )}
        </div>

        <div className="zg-balance-grid">
          <div>
            <span className="zg-stat-label">CURRENT STATUS</span>
            <span className={isDelinquent ? 'zg-badge-rejected' : 'zg-stat-value'}>
              {isDelinquent ? 'PAYMENT DUE' : 'IN GOOD STANDING'}
            </span>
          </div>
          <div>
            <span className="zg-stat-label">LAST PAYMENT</span>
            <span className="zg-stat-value">
              {lastPaidTransaction ? lastPaidTransaction.datePaid : 'None'}
            </span>
          </div>
          <div>
            <span className="zg-stat-label">PAYMENT METHOD</span>
            <span className="zg-stat-value">Digital</span>
          </div>
          <div>
            <span className="zg-stat-label">NEXT BILLING CYCLE</span>
            <span className="zg-stat-value">September 2026</span>
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

          <button className="zg-export-btn" onClick={() => alert(`Exporting Year-to-End Statement for ${selectedYear}...`)}>
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
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', color: '#94a3b8', padding: '32px' }}>
                    Loading payment records...
                  </td>
                </tr>
              ) : filteredLedger.length > 0 ? (
                filteredLedger.map((row, index) => (
                  <tr key={index}>
                    <td>{row.period}</td>
                    <td>{row.mode}</td>
                    <td>{row.amount}</td>
                    <td>
                      <span className={
                        row.statusType === 'paid'
                          ? 'zg-status-badge-paid'
                          : row.statusText === 'PENDING'
                            ? 'zg-status-badge-pending'
                            : row.statusText === 'IN DISPUTE'
                              ? 'zg-status-badge-dispute'
                              : row.statusText === 'UNPAID'
                                ? 'zg-status-badge-unpaid'
                                : 'zg-status-badge-arrears'
                      }>
                        {row.statusText}
                      </span>
                    </td>
                    <td>{row.datePaid}</td>
                    <td>
                      <div className="zg-action-buttons">
                        {row.actions.map((action, actIdx) => (
                          <button
                            key={actIdx}
                            className={
                              action === 'Pay Now'
                                ? 'zg-btn-pay'
                                : action === 'Dispute' || action === 'Status'
                                  ? 'zg-btn-dispute'
                                  : 'zg-btn-generic'
                            }
                            onClick={() => handleActionClick(action, row)}
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
                    No payment records found for {selectedYear}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Digital Payment Modal */}
      {isModalOpen && (
        <div className="zg-modal-overlay">
          <div className="zg-modal-card">
            <div className="zg-modal-header">
              <div>
                <h2>QR Code Digital Payment</h2>
                <span className="zg-modal-subtitle">Transaction ID: #{activeRow?.id || 'ARD-2026-0004'}</span>
              </div>
              <button className="zg-modal-close" onClick={() => setIsModalOpen(false)}>
                {Icons.close}
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit}>
              <div className="zg-provider-pill">
                <Image src="/gcash.png" alt="GCash" width={64} height={20} style={{ objectFit: 'contain' }} />
              </div>

              <div className="zg-qr-display-box">
                <Image src="/qr.png" alt="Scan QR Code" width={140} height={140} style={{ objectFit: 'contain' }} />
              </div>

              <div className="zg-modal-form-section">
                <label className="zg-modal-label">UPLOAD PROOF OF PAYMENT</label>
                <label className="zg-modal-upload-box">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  {Icons.upload}
                  <strong>{proofFile ? proofFile.name : 'Upload Proof of Payment'}</strong>
                  <span>JPG, PNG (Max 5MB)</span>
                </label>
              </div>

              <div className="zg-modal-form-section">
                <label className="zg-modal-label">INPUT REFERENCE NUMBER</label>
                <div className="zg-input-row">
                  <input
                    type="text"
                    className="zg-modal-input"
                    placeholder="e.g. 9012345678910"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    required
                  />
                  <span className="zg-input-hint">i</span>
                </div>
              </div>

              <button
                type="submit"
                className="zg-modal-submit-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'SUBMITTING...' : 'SUBMIT FOR VALIDATION'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 1. DISPUTE SUBMISSION MODAL */}
      {isDisputeModalOpen && (
        <div className="zg-modal-overlay">
          <div className="zg-dispute-modal-card">
            <div className="zg-modal-header">
              <div>
                <h2>Dispute Transaction</h2>
                <p className="zg-modal-subtitle">Please provide accurate details regarding the transaction you wish to contest. Our team will review your submission within 2-3 business days.</p>
              </div>
              <button className="zg-modal-close" onClick={() => setIsDisputeModalOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleDisputeSubmit} className="zg-dispute-layout">
              <div className="zg-summary-box">
                <h4>Transaction Summary</h4>
                <div className="zg-summary-row">
                  <span>MONTH</span>
                  <strong>{activeRow?.period}</strong>
                </div>
                <div className="zg-summary-row">
                  <span>ID</span>
                  <strong>#{activeRow?.id || 'ARD-2026-0015'}</strong>
                </div>
                <div className="zg-summary-row">
                  <span>CATEGORY</span>
                  <strong>Monthly Dues</strong>
                </div>
                <div className="zg-summary-total">
                  <span>TOTAL AMOUNT</span>
                  <h2>{activeRow?.amount}</h2>
                </div>
                <div className="zg-security-box">
                  <strong>Security Policy</strong>
                  <p>This is a secure channel. All documents uploaded are encrypted and visible only to the HOA Board.</p>
                </div>
              </div>

              <div className="zg-details-box">
                <h4>Dispute Details</h4>
                <p className="zg-subtext">Detail your reason for dispute and provide evidence below.</p>

                <label className="zg-modal-label">REASON FOR DISPUTE:</label>
                <textarea
                  className="zg-dispute-textarea"
                  placeholder="Explain why you are contesting this transaction. Please include specific reference numbers."
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  required
                />

                <label className="zg-modal-label">SUPPORTING EVIDENCE:</label>
                <label className="zg-modal-upload-box">
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={(e) => setDisputeEvidence(e.target.files[0])}
                    style={{ display: 'none' }}
                  />
                  <strong>{disputeEvidence ? disputeEvidence.name : 'Upload supporting evidence'}</strong>
                  <span>JPG, PNG (Max 5MB)</span>
                </label>

                <div className="zg-modal-submit-row">
                  <button type="submit" className="zg-modal-submit-btn">
                    SUBMIT DISPUTE →
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISPUTE & VALIDATION STATUS TRACKER MODAL */}
      {isSummaryModalOpen && (
        <div className="zg-modal-overlay">
          <div className="zg-summary-modal-card">
            <div className="zg-modal-header">
              <div>
                <h2>{activeDisputeRecord?.statusText === 'VALIDATING' ? 'Payment Validation Summary' : 'Dispute Summary'}</h2>
                <span className="zg-modal-subtitle">TRANSACTION ID: #{activeDisputeRecord?.id || 'ARD-2026-0001'}</span>
              </div>
              <button className="zg-modal-close" onClick={() => setIsSummaryModalOpen(false)}>
                ✕
              </button>
            </div>

            {(() => {
              // Extract the actual backend status
              const currentStatus = (activeDisputeRecord?.dispute_status || activeDisputeRecord?.status || activeDisputeRecord?.statusText || '').toUpperCase();

              // Determine current progress
              const isResolved = currentStatus === 'RESOLVED' || currentStatus === 'PAID';
              const isRejected = currentStatus === 'REJECTED';

              return (
                <div className="zg-stepper-container">
                  {/* Step 1: Submitted */}
                  <div className="zg-step active">
                    <div className="zg-step-icon">✓</div>
                    <span>Submitted</span>
                  </div>

                  <div className="zg-step-line active"></div>

                  {/* Step 2: Investigating / Reviewing */}
                  <div className="zg-step active">
                    <div className="zg-step-icon">✓</div>
                    <span>{activeDisputeRecord?.statusText === 'VALIDATING' ? 'Collector Review' : 'Investigating'}</span>
                  </div>

                  {/* Step 3 Line (Dynamic Color) */}
                  <div
                    className={`zg-step-line ${isResolved || isRejected ? 'active' : ''}`}
                    style={isRejected ? { backgroundColor: '#dc2626' } : {}}
                  ></div>

                  {/* Step 3: Final Decision (Dynamic Text & Color) */}
                  <div className={`zg-step ${isResolved || isRejected ? 'active' : ''}`}>
                    <div
                      className="zg-step-icon"
                      style={isRejected ? { backgroundColor: '#dc2626', borderColor: '#dc2626' } : {}}
                    >
                      {isResolved ? '✓' : isRejected ? '✕' : '✓'}
                    </div>
                    <span style={isRejected ? { color: '#dc2626' } : {}}>
                      {isRejected ? 'Rejected' : 'Approved'}
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="zg-review-details-box">
              <label className="zg-modal-label">
                {activeDisputeRecord?.statusText === 'VALIDATING' ? 'TRANSACTION DETAILS:' : 'REASON FOR DISPUTE:'}
              </label>
              <p className="zg-review-text">
                {activeDisputeRecord?.homeownerClaim || activeDisputeRecord?.disputeInfo?.reason || 'Awaiting collector validation of submitted proof.'}
              </p>

              <label className="zg-modal-label">
                {activeDisputeRecord?.statusText === 'VALIDATING' ? 'SUBMISSION METHOD' : 'ATTACHED EVIDENCE'}
              </label>
              <div className="zg-evidence-preview-text">
                {activeDisputeRecord?.evidenceUrl || activeDisputeRecord?.disputeInfo?.evidence || 'Digital QR Payment'}
              </div>
            </div>

            {/* UPDATE THIS BUTTON */}
            <button
              className="zg-close-summary-btn"
              onClick={() => {
                setIsSummaryModalOpen(false);
                // Refresh the ledger automatically when the modal closes
                // This forces the "IN DISPUTE" badge to revert to "WITH ARREARS" or "UNPAID"
                fetchPaymentsData(propertyId);
              }}
            >
              Close Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HomeownerPaymentsPage() {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: '#64748b' }}>Loading payments ledger...</div>}>
      <HomeownerPaymentsContent />
    </Suspense>
  );
}