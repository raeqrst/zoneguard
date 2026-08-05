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

const AVATAR_COLORS = [
  '#D97706', '#059669', '#2563EB', '#7C3AED', '#DB2777', '#EA580C', '#0891B2', '#4F46E5',
];

function getConsistentColor(str = '') {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatAddressEntry(addrObj) {
  if (!addrObj) return '';
  
  const houseNo = addrObj.houseNo || addrObj.house_no;
  const street = addrObj.street || addrObj.lot_number_street || '';
  const lotNumber = addrObj.lotNumber || addrObj.lot_number || addrObj.lot;

  // If there is a house number, use it directly without forcing the word "Lot"
  if (houseNo !== undefined && houseNo !== null && String(houseNo).trim() !== '') {
    return `${String(houseNo).trim()}${street ? ` ${street}` : ''}`;
  } 
  // Only prefix with "Lot" if the value isn't already a house number or explicitly prefixed
  else if (lotNumber !== undefined && lotNumber !== null && String(lotNumber).trim() !== '') {
    const rawLot = String(lotNumber).trim();
    const cleanLot = rawLot.replace(/^lot\s*/i, '').trim();
    // If it's labeled as a house number or doesn't look like a lot designation, don't force "Lot"
    const prefix = /^h|house/i.test(rawLot) ? '' : 'Lot ';
    return `${prefix}${cleanLot}${street ? ` ${street}` : ''}`;
  }
  
  return addrObj.address || '';
}

export default function TenantManagementPage() {
  const [tenants, setTenants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('All Tenants');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 6;

  const [activeView, setActiveView] = useState('list');
  const [selectedTenant, setSelectedTenant] = useState(null);

  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [updateStatusValue, setUpdateStatusValue] = useState('');
  const [statusDescription, setStatusDescription] = useState('');

  useEffect(() => {
    const fetchTenants = async () => {
      setIsLoading(true);
      try {
        let url = `http://localhost:5000/api/tenant_management?`;
        if (selectedFilter && selectedFilter !== 'All Tenants') url += `filter=${encodeURIComponent(selectedFilter)}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

        const res = await fetch(url);
        const data = await res.json();
        if (data.success) {
          const groupedMap = {};
          
          data.tenants.forEach(row => {
            const key = row.resident.name;
            const formattedAddr = formatAddressEntry(row.resident);

            if (!groupedMap[key]) {
              groupedMap[key] = {
                ...row,
                resident: {
                  ...row.resident,
                  bgColor: getConsistentColor(row.resident.name),
                  rawAddresses: [formattedAddr]
                },
                tenant: {
                  ...row.tenant,
                  bgColor: getConsistentColor(row.tenant.name)
                }
              };
            } else {
              if (!groupedMap[key].resident.rawAddresses.includes(formattedAddr)) {
                groupedMap[key].resident.rawAddresses.push(formattedAddr);
              }
            }
          });

          const formattedTenants = Object.values(groupedMap).map(item => {
            item.resident.rawAddresses.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));
            
            return {
              ...item,
              combinedAddress: item.resident.rawAddresses.join(', ')
            };
          });

          setTenants(formattedTenants);
          setCurrentPage(1);
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

  const totalPages = Math.ceil(tenants.length / rowsPerPage) || 1;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentTenants = tenants.slice(indexOfFirstRow, indexOfLastRow);

  const handleOpenDetails = (row) => {
    setIsUpdateModalOpen(false);
    setSelectedTenant(row);
    setActiveView('details');
  };

  const handleOpenUpdateModal = (row) => {
    setSelectedTenant(row);
    setUpdateStatusValue(row.status || '');
    setStatusDescription('');
    setIsUpdateModalOpen(true);
  };

  const handleExecuteStatusUpdate = async () => {
    if (!selectedTenant) return;
    try {
      const res = await fetch('http://localhost:5000/api/tenant_management', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tenantId: selectedTenant.id, 
          lotId: selectedTenant.lotId, 
          status: updateStatusValue,
          description: statusDescription 
        })
      });
      const data = await res.json();
      if (data.success) {
        setTenants((prev) =>
          prev.map((item) =>
            item.id === selectedTenant.id
              ? { ...item, status: updateStatusValue, statusTone: updateStatusValue.toLowerCase() === 'approved' ? 'green' : 'yellow' }
              : item
          )
        );
        setIsUpdateModalOpen(false);
        setIsSuccessModalOpen(true);
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
              <input 
                type="text" 
                placeholder="Search here..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">ADMINISTRATOR</span>
              </div>
              <div className="user-avatar">AD</div>
            </div>
          </header>

          {activeView === 'list' && (
            <>
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

              <div className="table-container" style={{ minHeight: '520px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
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
                    ) : currentTenants.length === 0 ? (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                          No tenant records found in the database.
                        </td>
                      </tr>
                    ) : (
                      currentTenants.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <div className="person-cell">
                              <div className="avatar" style={{ backgroundColor: row.resident.bgColor }}>
                                {row.resident.init}
                              </div>
                              <div className="person-info">
                                <strong>{row.resident.name}</strong>
                                <span>{row.combinedAddress}</span>
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
                            <button className="btn-view-details" onClick={() => handleOpenDetails(row)}>
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
                              className="btn-action btn-update-active"
                              onClick={() => handleOpenUpdateModal(row)}
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
                <div className="pagination" style={{ marginTop: '20px', paddingBottom: '10px' }}>
                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    {'<'}
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      className={`page-btn ${currentPage === num ? 'active' : ''}`}
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </button>
                  ))}

                  <button 
                    className="page-btn" 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    {'>'}
                  </button>
                </div>
              </div>
            </>
          )}

          {activeView === 'details' && selectedTenant && (
            <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
              <button 
                onClick={() => { setActiveView('list'); setSelectedTenant(null); }} 
                style={{ background: 'none', border: 'none', color: '#065F46', fontWeight: 'bold', cursor: 'pointer', fontSize: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                ← Return To Tenant Management
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '28px', color: '#065F46', fontWeight: 'bold' }}>View Details</h1>
                <span style={{ background: '#FEF08A', color: '#854D0E', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', fontSize: '13px' }}>
                  STATUS: {selectedTenant.status}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                  <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>HOMEOWNER INFORMATION</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                    <input type="text" readOnly value={selectedTenant.homeowner?.fullName || selectedTenant.resident.name} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                    <input type="text" readOnly value={selectedTenant.homeowner?.email || selectedTenant.resident.email} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                  <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>TENANT INFORMATION</h3>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>FULL NAME</label>
                    <input type="text" readOnly value={selectedTenant.tenant.name} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                    <input type="text" readOnly value={selectedTenant.tenant.email} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff' }}>
                  <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>PROPERTY ADDRESS</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '15px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>HOUSE NO.</label>
                      <input type="text" readOnly value={selectedTenant.propertyAddress?.houseNo || selectedTenant.propertyAddress?.house_no || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>BLOCK</label>
                      <input type="text" readOnly value={selectedTenant.propertyAddress?.block || selectedTenant.propertyAddress?.block_no || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>LOT</label>
                      <input type="text" readOnly value={selectedTenant.propertyAddress?.lot || selectedTenant.propertyAddress?.lot_number || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>ZONE</label>
                      <input type="text" readOnly value={selectedTenant.propertyAddress?.zone || selectedTenant.propertyAddress?.zone_id || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>STREET</label>
                      <input type="text" readOnly value={selectedTenant.propertyAddress?.street || selectedTenant.propertyAddress?.lot_number_street || 'n/a'} style={{ width: '100%', padding: '10px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '6px' }} />
                    </div>
                  </div>
                </div>

                <div style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', background: '#fff', display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '13px', color: '#065F46', fontWeight: 'bold', marginBottom: '15px' }}>PHOTO PERMIT</h3>
                  <div style={{ background: '#f3f4f6', flex: 1, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', minHeight: '120px' }}>
                    Permit Preview Placeholder
                  </div>
                </div>
              </div>

              <button 
                onClick={() => handleOpenUpdateModal(selectedTenant)}
                style={{ backgroundColor: '#065F46', color: 'white', padding: '12px 25px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
              >
                UPDATE STATUS
              </button>
            </div>
          )}
        </main>
      </div>

      {isUpdateModalOpen && selectedTenant && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FEF08A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#854D0E', fontWeight: 'bold' }}>
                ⚙️
              </div>
              <h3 style={{ fontSize: '20px', color: '#065F46', fontWeight: 'bold', margin: 0 }}>Update Tenant Status</h3>
            </div>

            <label style={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>UPDATE STATUS</label>
            <select 
              value={updateStatusValue} 
              onChange={(e) => setUpdateStatusValue(e.target.value)}
              style={{ width: '100%', padding: '12px', marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#fff', fontWeight: '500', color: '#1f2937' }}
            >
              <option value="">Select Status...</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            <label style={{ fontSize: '11px', color: '#374151', fontWeight: 'bold', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>DESCRIPTION OF STATUS</label>
            <textarea 
              placeholder="Document the findings or required next steps for this status change..."
              value={statusDescription}
              onChange={(e) => setStatusDescription(e.target.value)}
              style={{ width: '100%', padding: '12px', height: '110px', marginBottom: '20px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '13px', color: '#1f2937', resize: 'vertical' }}
            />

            <div style={{ background: '#FEFCE8', border: '1px solid #FEF08A', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '12px', color: '#854D0E', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '500' }}>
              <span>⚠️</span> Resident will be notified regarding the status update.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button 
                onClick={() => setIsCancelConfirmOpen(true)}
                style={{ backgroundColor: '#DC2626', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}
              >
                CANCEL UPDATE
              </button>
              <button 
                onClick={handleExecuteStatusUpdate}
                style={{ backgroundColor: '#065F46', color: 'white', padding: '10px 18px', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>✔</span> UPDATE STATUS
              </button>
            </div>

          </div>
        </div>
      )}

      {isCancelConfirmOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '400px', width: '100%' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '10px' }}>Are you sure you want to cancel?</h3>
            <p style={{ color: '#6b7280', fontSize: '13px', marginBottom: '20px' }}>You have unsaved changes that will be reverted.</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button 
                onClick={() => { setIsCancelConfirmOpen(false); setIsUpdateModalOpen(false); }}
                style={{ backgroundColor: '#065F46', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Confirm
              </button>
              <button 
                onClick={() => setIsCancelConfirmOpen(false)}
                style={{ backgroundColor: '#DC2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuccessModalOpen && selectedTenant && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000 }}>
          <div style={{ textAlign: 'center', background: '#fff', padding: '30px', borderRadius: '16px', maxWidth: '420px', width: '100%' }}>
            <h3 style={{ color: '#065F46', marginBottom: '10px' }}>Tenant Approved Successfully!</h3>
            <p style={{ color: '#4b5563', fontSize: '13px', marginBottom: '20px' }}>Tenant Account Approval Update has been sent to Homeowner <strong>{selectedTenant.resident.email}</strong></p>
            <button 
              onClick={() => setIsSuccessModalOpen(false)}
              style={{ backgroundColor: '#065F46', color: 'white', padding: '10px 30px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}