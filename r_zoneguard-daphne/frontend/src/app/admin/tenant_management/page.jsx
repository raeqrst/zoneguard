'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

const Icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  map: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  complaints: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  residents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  tenant: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Icons.dashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Icons.analytics },
  { label: 'Map', href: '/admin/map', icon: Icons.map },
  { label: 'Complaints', href: '/admin/complaints', icon: Icons.complaints },
  { label: 'Residents', href: '/admin/residents', icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant_management', active: true, icon: Icons.tenant },
];

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
    <div className="layout-wrapper">
      <div className="main-container">
        <aside className="sidebar">
          <div className="brand-header">
            <svg className="official-brand-logo" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L4 10V20C4 29.5 10.8 38.1 20 40C29.2 38.1 36 29.5 36 20V10L20 2Z" fill="#065F46"/>
              <path d="M20 8L8 14V20C8 27.2 13.1 33.8 20 35.5C26.9 33.8 32 27.2 32 20V14L20 8Z" fill="#10B981"/>
              <path d="M14 20L18 24L26 16" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className="brand-text">
              <strong>ZoneGuard</strong>
              <span>NIA VILLAGE SUBD.</span>
            </div>
          </div>

          <nav className="nav-menu">
            {sidebarItems.map((item) => (
              <Link key={item.label} href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-divider"></div>
            <Link href="/admin/settings" className="nav-link">
              <span className="nav-icon">{Icons.settings}</span>
              Account Settings
            </Link>
            <button className="nav-link btn-logout">
              <span className="nav-icon">{Icons.logout}</span>
              Logout
            </button>
          </div>
        </aside>

        <main className="content-area">
          <header className="topbar">
            <div className="search-bar-large">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" placeholder="Search here..." />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">ADMINISTRATOR</span>
              </div>
              <div className="user-avatar">AD</div>
            </div>
          </header>

          <div className="page-title-section">
            <h1>Tenant Management</h1>
            <p>Manage property occupancy and authorize resident permissions.</p>
          </div>

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

            <div className="pagination">
              <button className="page-btn">{'<'}</button>
              <button className="page-btn active">1</button>
              <button className="page-btn">2</button>
              <button className="page-btn">{'>'}</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}