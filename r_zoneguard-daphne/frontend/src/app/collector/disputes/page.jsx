'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2 } from 'lucide-react';
import './style.css';

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('');
<<<<<<< HEAD
=======
  const [statusFilter, setStatusFilter] = useState('ACTIVE'); // 'ACTIVE' hides resolved/rejected by default
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

<<<<<<< HEAD
=======
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  useEffect(() => {
    fetchDisputes();
  }, []);

<<<<<<< HEAD
=======
  // Reset to page 1 whenever the search term or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
<<<<<<< HEAD
      const res = await fetch('/api/disputes');
      if (!res.ok) throw new Error('Failed to fetch payment dispute records.');
      const data = await res.json();
      setDisputes(data);
=======
      const res = await fetch('/api/collector/disputes');
      if (!res.ok) throw new Error('Failed to fetch payment dispute records.');
      const json = await res.json();
      setDisputes(json.data || json);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    } catch (err) {
      console.error('Error loading disputes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResolveDispute = async (disputeId, newStatus) => {
    setActionLoading(true);
    try {
<<<<<<< HEAD
      const res = await fetch(`/api/disputes/${disputeId}`, {
=======
      const res = await fetch(`/api/collector/disputes/${disputeId}`, {
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispute_status: newStatus }),
      });

      if (!res.ok) throw new Error(`Failed to update dispute status to ${newStatus}.`);

<<<<<<< HEAD
      setDisputes((prev) => prev.filter((item) => item.dispute_id !== disputeId));
      setSelectedDispute(null);
=======
      setDisputes((prev) =>
        prev.map((item) =>
          (item.dispute_id || item.id) === disputeId
            ? { ...item, dispute_status: newStatus, status: newStatus }
            : item
        )
      );
      setSelectedDispute(null);

      // Handle edge case: if resolving the last item on a page drops it from the current filter, go back one page
      if (paginatedDisputes.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    } catch (err) {
      console.error('Error resolving dispute:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

<<<<<<< HEAD
  const filteredDisputes = disputes.filter((item) => {
    const homeownerName = item.homeowner 
      ? `${item.homeowner.firstName} ${item.homeowner.lastName}` 
      : item.homeowner_id;
    return (
      homeownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.billing_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.dispute_id.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

=======
  // 1. Filter the disputes first
  const filteredDisputes = disputes.filter((item) => {
    const residentName = item.residentName || item.homeowner_id || '';
    const billingId = item.billing_id || '';
    const disputeId = item.dispute_id || '';
    const status = (item.dispute_status || item.status || '').toUpperCase();

    const matchesSearch =
      residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      billingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      disputeId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') {
      return status === 'PENDING' || status === 'REVIEWING';
    } else if (statusFilter === 'RESOLVED') {
      return status === 'RESOLVED';
    } else if (statusFilter === 'REJECTED') {
      return status === 'REJECTED';
    }
    return true; // 'ALL'
  });

  // 2. Calculate pagination boundaries
  const totalPages = Math.ceil(filteredDisputes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  // 3. Slice the array to show only the items for the current page
  const paginatedDisputes = filteredDisputes.slice(startIndex, endIndex);

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return 'stat-resolved';
      case 'REJECTED': return 'stat-active';
      default: return 'stat-investigating';
    }
  };

  return (
    <div className="disputes-page">
<<<<<<< HEAD
      {/* Title & Right-Aligned Search Toolbar */}
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      <div className="page-title-section">
        <div>
          <h1>Disputes Management</h1>
          <p>Manage Residents Payment Disputes</p>
        </div>

        <div className="disputes-search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by ID or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

<<<<<<< HEAD
      {/* Main Table Container */}
=======
      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        <button
          onClick={() => setStatusFilter('ACTIVE')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: statusFilter === 'ACTIVE' ? '#065f46' : '#f3f4f6',
            color: statusFilter === 'ACTIVE' ? '#ffffff' : '#374151',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          Active (Pending / Reviewing)
        </button>
        <button
          onClick={() => setStatusFilter('RESOLVED')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: statusFilter === 'RESOLVED' ? '#065f46' : '#f3f4f6',
            color: statusFilter === 'RESOLVED' ? '#ffffff' : '#374151',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          Resolved
        </button>
        <button
          onClick={() => setStatusFilter('REJECTED')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: statusFilter === 'REJECTED' ? '#065f46' : '#f3f4f6',
            color: statusFilter === 'REJECTED' ? '#ffffff' : '#374151',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          Rejected
        </button>
        <button
          onClick={() => setStatusFilter('ALL')}
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: statusFilter === 'ALL' ? '#065f46' : '#f3f4f6',
            color: statusFilter === 'ALL' ? '#ffffff' : '#374151',
            border: 'none',
            transition: 'all 0.2s'
          }}
        >
          All Disputes
        </button>
      </div>

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>HOMEOWNER ID</th>
              <th>BILLING ID</th>
              <th>CLAIM</th>
              <th>PERIOD</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                    <Loader2 size={18} className="animate-spin" /> Loading disputes...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="6" style={{ padding: '24px', color: '#dc2626' }}>
                  {error}
                </td>
              </tr>
<<<<<<< HEAD
            ) : filteredDisputes.length > 0 ? (
              filteredDisputes.map((item) => {
                const displayName = item.homeowner 
                  ? `${item.homeowner.firstName} ${item.homeowner.lastName}` 
                  : item.homeowner_id;
                const address = item.homeowner?.address || 'NIA Subdivision';
                const initials = item.homeowner 
                  ? `${item.homeowner.firstName[0]}${item.homeowner.lastName[0]}` 
                  : 'HO';

                return (
                  <tr key={item.dispute_id}>
=======
            ) : paginatedDisputes.length > 0 ? (
              // Use paginatedDisputes here instead of filteredDisputes
              paginatedDisputes.map((item) => {
                const displayName = item.residentName || item.homeowner_id;
                const address = 'NIA Subdivision';
                const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const currentStatus = (item.dispute_status || item.status || '').toUpperCase();

                return (
                  <tr key={item.dispute_id || item.id}>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                    <td>
                      <div className="resident-cell">
                        <div className="resident-avatar">{initials}</div>
                        <div className="resident-info">
                          <strong>{displayName}</strong>
                          <span>{address}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.billing_id}</td>
                    <td>{item.homeowner_claim}</td>
                    <td>{item.reference_month}</td>
                    <td>
<<<<<<< HEAD
                      <span className={`status-pill ${getStatusClass(item.dispute_status)}`}>
                        {item.dispute_status}
=======
                      <span className={`status-pill ${getStatusClass(currentStatus)}`}>
                        {currentStatus}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-resolve" onClick={() => setSelectedDispute(item)}>
<<<<<<< HEAD
                          Resolve
=======
                          {currentStatus === 'PENDING' || currentStatus === 'REVIEWING' ? 'Resolve' : 'View'}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                        </button>
                        <button className="btn-map" onClick={() => setSelectedDispute(item)}>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: '24px', color: '#6b7280' }}>
<<<<<<< HEAD
                  No matching dispute records found.
=======
                  No matching dispute records found for this filter.
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                </td>
              </tr>
            )}
          </tbody>
        </table>

<<<<<<< HEAD
        {/* Footer & Pagination */}
        <div className="table-footer">
          <span>Showing {filteredDisputes.length} of {disputes.length} records</span>
          <div className="pagination">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {/* REVIEW MODAL */}
=======
        <div className="table-footer">
          <span>
            Showing {filteredDisputes.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredDisputes.length)} of {filteredDisputes.length} records
          </span>
          
          {/* Dynamically render pagination buttons */}
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
      {selectedDispute && (
        <div className="modal-backdrop">
          <div className="dispute-modal-card">
            <div className="modal-header">
              <div>
                <h3>Review Payment Dispute ({selectedDispute.dispute_id})</h3>
                <p className="modal-subtitle-top">Billing ID: {selectedDispute.billing_id}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedDispute(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="dispute-modal-body">
              <div className="dispute-grid-container">
                <div>
                  <div className="section-label">HOMEOWNER DETAILS</div>
                  <div className="resident-info-box">
<<<<<<< HEAD
                    <strong>{selectedDispute.homeowner_id}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Assigned Collector: {selectedDispute.collector_id}
=======
                    <strong>{selectedDispute.residentName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Homeowner ID: {selectedDispute.homeowner_id}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                    </div>
                  </div>

                  <div className="section-label mt-16">HOMEOWNER CLAIM</div>
                  <div className="reason-box">
                    <p style={{ margin: 0, fontStyle: 'italic', fontSize: '0.85rem' }}>
                      “{selectedDispute.homeowner_claim}”
                    </p>
                  </div>
                </div>

                <div>
                  <div className="section-label">DISPUTE DETAILS</div>
                  <div className="details-grid-card" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                    <div><strong>Month:</strong> {selectedDispute.reference_month}</div>
                    <div><strong>Billing ID:</strong> {selectedDispute.billing_id}</div>
<<<<<<< HEAD
=======
                    <div><strong>Status:</strong> {(selectedDispute.dispute_status || selectedDispute.status)}</div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                    <div><strong>Submitted:</strong> {new Date(selectedDispute.created_at).toLocaleDateString()}</div>
                  </div>

                  <div className="section-label mt-16">EVIDENCE</div>
                  <div className="evidence-preview-box">
                    {selectedDispute.evidence_url ? (
                      <a href={`/${selectedDispute.evidence_url}`} target="_blank" rel="noreferrer" style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 600 }}>
                        View Attachment
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No evidence attached</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="dispute-modal-footer">
                <button 
                  className="approve-dispute-btn" 
                  disabled={actionLoading}
<<<<<<< HEAD
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id, 'RESOLVED')}
=======
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id || selectedDispute.id, 'RESOLVED')}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                >
                  {actionLoading ? 'PROCESSING...' : 'APPROVE & RESOLVE'}
                </button>
                <button 
                  className="deny-dispute-btn" 
                  disabled={actionLoading}
<<<<<<< HEAD
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id, 'REJECTED')}
=======
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id || selectedDispute.id, 'REJECTED')}
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
                >
                  {actionLoading ? 'PROCESSING...' : 'REJECT DISPUTE'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}