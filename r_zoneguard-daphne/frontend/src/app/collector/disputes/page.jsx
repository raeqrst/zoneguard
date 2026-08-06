'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2 } from 'lucide-react';
import './style.css';

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE'); // 'ACTIVE' hides resolved/rejected by default
  const [disputes, setDisputes] = useState([]);
  const [selectedDispute, setSelectedDispute] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/collector/disputes');
      if (!res.ok) throw new Error('Failed to fetch payment dispute records.');
      const json = await res.json();
      setDisputes(json.data || json);
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
      const res = await fetch(`/api/collector/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispute_status: newStatus }),
      });

      if (!res.ok) throw new Error(`Failed to update dispute status to ${newStatus}.`);

      setDisputes((prev) =>
        prev.map((item) =>
          (item.dispute_id || item.id) === disputeId
            ? { ...item, dispute_status: newStatus, status: newStatus }
            : item
        )
      );
      setSelectedDispute(null);
    } catch (err) {
      console.error('Error resolving dispute:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

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

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return 'stat-resolved';
      case 'REJECTED': return 'stat-active';
      default: return 'stat-investigating';
    }
  };

  return (
    <div className="disputes-page">
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
            ) : filteredDisputes.length > 0 ? (
              filteredDisputes.map((item) => {
                const displayName = item.residentName || item.homeowner_id;
                const address = 'NIA Subdivision';
                const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const currentStatus = (item.dispute_status || item.status || '').toUpperCase();

                return (
                  <tr key={item.dispute_id || item.id}>
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
                      <span className={`status-pill ${getStatusClass(currentStatus)}`}>
                        {currentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-resolve" onClick={() => setSelectedDispute(item)}>
                          {currentStatus === 'PENDING' || currentStatus === 'REVIEWING' ? 'Resolve' : 'View'}
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
                  No matching dispute records found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Showing {filteredDisputes.length} of {disputes.length} records</span>
          <div className="pagination">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

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
                    <strong>{selectedDispute.residentName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Homeowner ID: {selectedDispute.homeowner_id}
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
                    <div><strong>Status:</strong> {(selectedDispute.dispute_status || selectedDispute.status)}</div>
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
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id || selectedDispute.id, 'RESOLVED')}
                >
                  {actionLoading ? 'PROCESSING...' : 'APPROVE & RESOLVE'}
                </button>
                <button 
                  className="deny-dispute-btn" 
                  disabled={actionLoading}
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id || selectedDispute.id, 'REJECTED')}
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