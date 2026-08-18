'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2, FileText } from 'lucide-react';

export default function VehicleStickerPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ACTIVE');
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/collector/vehicle-stickers');
      if (!res.ok) throw new Error('Failed to fetch vehicle sticker application records.');
      const json = await res.json();
      setApplications(json.data || json);
    } catch (err) {
      console.error('Error loading vehicle sticker applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId, newStatus) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/collector/vehicle-stickers/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_status: newStatus }),
      });

      if (!res.ok) throw new Error(`Failed to update application status to ${newStatus}.`);

      setApplications((prev) =>
        prev.map((item) =>
          (item.application_id || item.id) === appId
            ? { ...item, application_status: newStatus, status: newStatus }
            : item
        )
      );
      setSelectedApplication(null);
    } catch (err) {
      console.error('Error updating application status:', err);
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredApplications = applications.filter((item) => {
    const residentName = item.residentName || item.homeowner_id || '';
    const plateNumber = item.plate_number || '';
    const appId = item.application_id || '';
    const status = (item.application_status || item.status || '').toUpperCase();

    const matchesSearch =
      residentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appId.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (statusFilter === 'ACTIVE') {
      return status === 'PENDING' || status === 'REVIEWING';
    } else if (statusFilter === 'APPROVED') {
      return status === 'APPROVED' || status === 'RESOLVED';
    } else if (statusFilter === 'REJECTED') {
      return status === 'REJECTED';
    }
    return true;
  });

  return (
    <div className="disputes-page">
      <div className="page-title-section">
        <div>
          <h1>Vehicle Sticker Management</h1>
          <p>Manage and issue vehicle stickers for residents</p>
        </div>

        {/* Fixed Search Box Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px', padding: '6px 12px', width: '280px' }}>
          <Search size={16} color="#9ca3af" />
          <input 
            type="text" 
            placeholder="Search by plate or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ border: 'none', background: 'none', outline: 'none', fontSize: '0.8rem', width: '100%', color: '#111827' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px' }}>
        {['ACTIVE', 'APPROVED', 'REJECTED', 'ALL'].map(filter => (
          <button
            key={filter}
            onClick={() => setStatusFilter(filter)}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: statusFilter === filter ? '#065f46' : '#f3f4f6',
              color: statusFilter === filter ? '#ffffff' : '#374151',
              border: 'none',
              transition: 'all 0.2s'
            }}
          >
            {filter === 'ACTIVE' ? 'Active (Pending / Reviewing)' : 
             filter === 'ALL' ? 'All Applications' : filter.charAt(0) + filter.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>PLATE NUMBER</th>
              <th>AMOUNT</th>
              <th>DOCUMENT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                    <Loader2 size={18} className="animate-spin" /> Loading applications...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', color: '#dc2626' }}>{error}</td>
              </tr>
            ) : filteredApplications.length > 0 ? (
              filteredApplications.map((item) => {
                const displayName = item.residentName || item.homeowner_id;
                const address = 'NIA Subdivision';
                const initials = displayName ? displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'NA';
                const currentStatus = (item.application_status || item.status || '').toUpperCase();

                return (
                  <tr key={item.application_id || item.id}>
                    <td>
                      <div className="resident-cell">
                        <div className="resident-avatar">{initials}</div>
                        <div className="resident-info">
                          <strong>{displayName}</strong>
                          <span>{address}</span>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{item.plate_number}</td>
                    <td>{item.amount ? `₱ ${item.amount}` : '₱ 100'}</td>
                    <td>
                      {item.document_url ? (
                        <a href={`/${item.document_url}`} target="_blank" rel="noreferrer" style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 600, textDecoration: 'none' }}>
                          View Documents
                        </a>
                      ) : (
                        <span style={{ color: '#9ca3af', fontSize: '0.8rem' }}>None</span>
                      )}
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-resolve" onClick={() => setSelectedApplication(item)}>
                          {currentStatus === 'PENDING' || currentStatus === 'REVIEWING' ? 'Review' : 'View'}
                        </button>
                        <button className="btn-map" onClick={() => setSelectedApplication(item)}>
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '24px', color: '#6b7280' }}>
                  No matching vehicle sticker applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedApplication && (
        <div className="modal-backdrop">
          <div className="dispute-modal-card">
            <div className="modal-header">
              <div>
                <h3>Review Application ({selectedApplication.application_id || selectedApplication.id})</h3>
                <p className="modal-subtitle-top">Plate Number: {selectedApplication.plate_number}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedApplication(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="dispute-modal-body">
              <div className="dispute-grid-container">
                <div>
                  <div className="section-label">RESIDENT DETAILS</div>
                  <div className="resident-info-box">
                    <strong>{selectedApplication.residentName}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Homeowner ID: {selectedApplication.homeowner_id}
                    </div>
                  </div>

                  <div className="section-label mt-16">VEHICLE DETAILS</div>
                  <div className="reason-box">
                    <div style={{ fontSize: '0.85rem' }}>
                      <div><strong>Type:</strong> {selectedApplication.vehicle_type || 'Car / SUV'}</div>
                      <div><strong>Plate:</strong> {selectedApplication.plate_number}</div>
                      <div><strong>Fee:</strong> ₱ {selectedApplication.amount || '100'}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="section-label">APPLICATION METADATA</div>
                  <div className="details-grid-card" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                    <div><strong>Status:</strong> {(selectedApplication.application_status || selectedApplication.status)}</div>
                    <div><strong>Submitted:</strong> {new Date(selectedApplication.created_at || Date.now()).toLocaleDateString()}</div>
                  </div>

                  <div className="section-label mt-16">SUPPORTING DOCUMENTS</div>
                  <div className="evidence-preview-box" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} color="#065f46" />
                    {selectedApplication.document_url ? (
                      <a href={`/${selectedApplication.document_url}`} target="_blank" rel="noreferrer" style={{ color: '#065f46', fontSize: '0.8rem', fontWeight: 600 }}>
                        View Uploaded Documents
                      </a>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>No documents attached</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="dispute-modal-footer">
                <button 
                  className="approve-dispute-btn" 
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedApplication.application_id || selectedApplication.id, 'APPROVED')}
                >
                  {actionLoading ? 'PROCESSING...' : 'APPROVE & ISSUE'}
                </button>
                <button 
                  className="deny-dispute-btn" 
                  disabled={actionLoading}
                  onClick={() => handleUpdateStatus(selectedApplication.application_id || selectedApplication.id, 'REJECTED')}
                >
                  {actionLoading ? 'PROCESSING...' : 'REJECT'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}