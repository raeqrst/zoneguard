'use client';

import { useState, useEffect } from 'react';
import './style.css';

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All Tenants');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      try {
        let url = `/api/tenant_management?`;
        if (selectedFilter) url += `filter=${encodeURIComponent(selectedFilter)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          setTenants(data.tenants);
        }
      } catch (err) {
        console.error('Failed to load tenants:', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchTenants, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedFilter, searchQuery]);

  const handleUpdateAction = async (tenantId, lotId) => {
    try {
      const res = await fetch('/api/tenant_management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenantId, lotId, status: 'APPROVED' })
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) =>
          prev.map((item) =>
            item.id === tenantId && item.lotId === lotId
              ? { ...item, status: 'Approved', statusTone: 'green', canUpdate: false }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Failed to update tenant status:', err);
    }
  };

  return (
    <div className="tenant-management-page">
      {/* PAGE HEADER */}
      <div className="page-title-section">
        <h1>Tenant Management</h1>
        <p>Manage property occupancy and authorize resident permissions.</p>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="filters-section">
        <div className="filter-group type-filters">
          {['All Tenants', 'Approved', 'Pending', 'Rejected'].map((filter) => (
            <button
              key={filter}
              className={`pill ${selectedFilter === filter ? 'active-pill' : 'light-pill'}`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="action-group">
          <div className="table-search">
            <input
              type="text"
              placeholder="Type a name here.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </span>
          </div>
        </div>
      </div>

      {/* TABLE AREA */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>RESIDENT</th>
              <th>TENANT</th>
              <th>DETAILS</th>
              <th>STATUS</th>
              <th>EXECUTIVE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  Fetching tenant records from database...
                </td>
              </tr>
            ) : tenants.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No tenant records found in the database.
                </td>
              </tr>
            ) : (
              tenants.map((row) => (
                <tr key={`${row.id}-${row.lotId}`}>
                  <td>
                    <div className="person-cell">
                      <div className="avatar" style={{ backgroundColor: row.resident.bgColor }}>
                        {row.resident.init}
                      </div>
                      <div className="person-info">
                        <strong>{row.resident.name}</strong>
                        <span>{row.resident.address}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="person-cell">
                      <div className="avatar" style={{ backgroundColor: row.tenant.bgColor }}>
                        {row.tenant.init}
                      </div>
                      <div className="person-info">
                        <strong>{row.tenant.name}</strong>
                        <span>{row.tenant.email}</span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <button className="btn-view-details">
                      View Details 
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                  </td>

                  <td>
                    <span className={`status-badge status-${row.statusTone}`}>
                      {row.status}
                    </span>
                  </td>

                  <td>
                    <button
                      className={`btn-action ${row.canUpdate ? 'btn-update-active' : 'btn-update-disabled'}`}
                      disabled={!row.canUpdate}
                      onClick={() => handleUpdateAction(row.id, row.lotId)}
                    >
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="pagination">
          <button className="page-btn">{'<'}</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">{'>'}</button>
        </div>
      </div>
    </div>
  );
}