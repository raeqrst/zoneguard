'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2 } from 'lucide-react';
import './style.css';

export default function DisputesPage() {
  const [searchTerm, setSearchTerm] = useState('');
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
      const res = await fetch('/api/disputes');
      if (!res.ok) throw new Error('Failed to fetch payment dispute records.');
      const data = await res.json();
      setDisputes(data);
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
      const res = await fetch(`/api/disputes/${disputeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dispute_status: newStatus }),
      });

      if (!res.ok) throw new Error(`Failed to update dispute status to ${newStatus}.`);

      setDisputes((prev) => prev.filter((item) => item.dispute_id !== disputeId));
      setSelectedDispute(null);
    } catch (err) {
      console.error('Error resolving dispute:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

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

  const getStatusClass = (status) => {
    switch (status?.toUpperCase()) {
      case 'RESOLVED': return 'stat-resolved';
      case 'REJECTED': return 'stat-active';
      default: return 'stat-investigating';
    }
  };

  return (
    <div className="disputes-page">
      {/* Title & Right-Aligned Search Toolbar */}
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

      {/* Main Table Container */}
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
                const displayName = item.homeowner 
                  ? `${item.homeowner.firstName} ${item.homeowner.lastName}` 
                  : item.homeowner_id;
                const address = item.homeowner?.address || 'NIA Subdivision';
                const initials = item.homeowner 
                  ? `${item.homeowner.firstName[0]}${item.homeowner.lastName[0]}` 
                  : 'HO';

                return (
                  <tr key={item.dispute_id}>
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
                      <span className={`status-pill ${getStatusClass(item.dispute_status)}`}>
                        {item.dispute_status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-resolve" onClick={() => setSelectedDispute(item)}>
                          Resolve
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
                  No matching dispute records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
                    <strong>{selectedDispute.homeowner_id}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Assigned Collector: {selectedDispute.collector_id}
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
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id, 'RESOLVED')}
                >
                  {actionLoading ? 'PROCESSING...' : 'APPROVE & RESOLVE'}
                </button>
                <button 
                  className="deny-dispute-btn" 
                  disabled={actionLoading}
                  onClick={() => handleResolveDispute(selectedDispute.dispute_id, 'REJECTED')}
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