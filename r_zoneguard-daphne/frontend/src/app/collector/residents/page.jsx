'use client';

import React, { useState, useEffect } from 'react';
import { Search, ChevronRight, X, Loader2, Phone, Mail, Home } from 'lucide-react';
import './style.css';

export default function ResidentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [residents, setResidents] = useState([]);
  const [selectedResident, setSelectedResident] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/collector/residents');
      if (!res.ok) throw new Error('Failed to fetch resident records.');
      const json = await res.json();
      setResidents(json.data || json);
    } catch (err) {
      console.error('Error loading residents:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter((item) => {
    const fullName = `${item.first_name || ''} ${item.last_name || ''}`.toLowerCase();
    const email = (item.email || '').toLowerCase();
    const phone = (item.phone || '').toLowerCase();
    const address = (item.address || '').toLowerCase();

    return (
      fullName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm.toLowerCase()) ||
      address.includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="disputes-page">
      <div className="page-title-section">
        <div>
          <h1>Residents Directory</h1>
          <p>View and manage registered residents in the community</p>
        </div>

        <div className="disputes-search-box">
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, email, or phone..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>CONTACT INFO</th>
              <th>ADDRESS</th>
              <th>STATUS</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', color: '#6b7280' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', alignItems: 'center' }}>
                    <Loader2 size={18} className="animate-spin" /> Loading resident records...
                  </div>
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan="5" style={{ padding: '24px', color: '#dc2626' }}>
                  {error}
                </td>
              </tr>
            ) : filteredResidents.length > 0 ? (
              filteredResidents.map((item) => {
                const firstName = item.first_name || '';
                const lastName = item.last_name || '';
                const fullName = `${firstName} ${lastName}`.trim() || item.name || 'Unnamed Resident';
                const address = item.address || 'NIA Subdivision';
                const initials = fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
                const status = (item.status || item.account_status || 'ACTIVE').toUpperCase();

                return (
                  <tr key={item.resident_id || item.id}>
                    <td>
                      <div className="resident-cell">
                        <div className="resident-avatar">{initials}</div>
                        <div className="resident-info">
                          <strong>{fullName}</strong>
                          <span>{item.email || 'No email provided'}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.phone || item.contact_number || 'N/A'}</td>
                    <td style={{ fontSize: '0.85rem' }}>{address}</td>
                    <td>
                      <span className={`status-pill ${status === 'ACTIVE' ? 'stat-resolved' : 'stat-active'}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn-resolve" onClick={() => setSelectedResident(item)}>
                          View
                        </button>
                        <button className="btn-map" onClick={() => setSelectedResident(item)}>
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
                  No matching resident records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span>Showing {filteredResidents.length} of {residents.length} records</span>
          <div className="pagination">
            <button className="page-btn">&lt;</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">&gt;</button>
          </div>
        </div>
      </div>

      {selectedResident && (
        <div className="modal-backdrop">
          <div className="dispute-modal-card">
            <div className="modal-header">
              <div>
                <h3>Resident Profile</h3>
                <p className="modal-subtitle-top">ID: {selectedResident.resident_id || selectedResident.id}</p>
              </div>
              <button className="close-btn" onClick={() => setSelectedResident(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="dispute-modal-body">
              <div className="dispute-grid-container">
                <div>
                  <div className="section-label">PERSONAL DETAILS</div>
                  <div className="resident-info-box">
                    <strong>{`${selectedResident.first_name || ''} ${selectedResident.last_name || ''}`.trim() || selectedResident.name}</strong>
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '4px' }}>
                      Account Status: {selectedResident.status || selectedResident.account_status || 'ACTIVE'}
                    </div>
                  </div>

                  <div className="section-label mt-16">CONTACT INFORMATION</div>
                  <div className="reason-box">
                    <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} color="#065f46" />
                        <span>{selectedResident.email || 'No email provided'}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone size={14} color="#065f46" />
                        <span>{selectedResident.phone || selectedResident.contact_number || 'No phone provided'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="section-label">ADDRESS & PROPERTY</div>
                  <div className="details-grid-card" style={{ fontSize: '0.8rem', lineHeight: '1.6' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '8px' }}>
                      <Home size={14} color="#065f46" style={{ marginTop: '2px' }} />
                      <div>
                        <strong>Address:</strong> {selectedResident.address || 'NIA Subdivision'}
                      </div>
                    </div>
                    <div><strong>Homeowner Type:</strong> {selectedResident.homeowner_type || 'Resident / Homeowner'}</div>
                    <div><strong>Registered Date:</strong> {new Date(selectedResident.created_at || Date.now()).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>

              <div className="dispute-modal-footer">
                <button 
                  className="approve-dispute-btn" 
                  onClick={() => setSelectedResident(null)}
                  style={{ width: '100%' }}
                >
                  CLOSE PROFILE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}