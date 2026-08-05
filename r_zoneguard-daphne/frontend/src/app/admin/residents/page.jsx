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
  { label: 'Residents', href: '/admin/residents', active: true, icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant_management', icon: Icons.tenant },
];

export default function AdminResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [stats, setStats] = useState({ totalTenants: 0, totalHomeowners: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('All Residents');
  const [selectedZone, setSelectedZone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedResident, setSelectedResident] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newResidentForm, setNewResidentForm] = useState({
    fullName: '',
    type: 'Homeowner',
    zone: 'ZONE 1',
    street: '',
    block: '',
    lot: '',
    houseNo: '',
    phone: '',
    email: ''
  });

  const fetchLiveResidents = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:5000/api/residents?page=${currentPage}&`;
      if (selectedType) url += `type=${encodeURIComponent(selectedType)}&`;
      if (selectedZone) url += `zone=${encodeURIComponent(selectedZone)}&`;
      if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setResidents(data.residents);
        setStats(data.stats);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to connect to database API:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(fetchLiveResidents, 300);
    return () => clearTimeout(debounceTimer);
  }, [selectedType, selectedZone, searchQuery, currentPage]);

  const handleCreateResident = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/residents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newResidentForm)
      });
      const data = await res.json();
      if (data.success) {
        setIsAddModalOpen(false);
        setNewResidentForm({
          fullName: '',
          type: 'Homeowner',
          zone: 'ZONE 1',
          street: '',
          block: '',
          lot: '',
          houseNo: '',
          phone: '',
          email: ''
        });
        fetchLiveResidents();
      } else {
        alert(data.message || 'Failed to save resident record.');
      }
    } catch (err) {
      console.error('Error submitting new resident:', err);
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
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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

          <div className="header-cards-row">
            <div className="page-title-section">
              <h1>Resident Master List</h1>
              <p>Central management for all registered residents properties and homeowners.</p>
            </div>

            <div className="stats-cards">
              <div className="stat-card">
                <div className="stat-icon light-green-bg">{Icons.residents}</div>
                <div className="stat-details">
                  <span>Total Tenants</span>
                  <h2>{stats.totalTenants.toLocaleString()}</h2>
                  <div className="stat-year"><span className="yellow-dot"></span> Year 2026</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon dark-green-bg">{Icons.residents}</div>
                <div className="stat-details">
                  <span>Total Homeowner</span>
                  <h2>{stats.totalHomeowners.toLocaleString()}</h2>
                  <div className="stat-year"><span className="yellow-dot"></span> Year 2026</div>
                </div>
              </div>
            </div>
          </div>

          <div className="filters-section">
            <div className="filter-group type-filters">
              {['All Residents', 'Tenants', 'Homeowners'].map((type) => (
                <button
                  key={type}
                  className={`pill ${selectedType === type ? 'active-pill' : 'light-pill'}`}
                  onClick={() => { setSelectedType(type); setCurrentPage(1); }}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="filter-group zone-filters">
              {['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'].map((zone) => (
                <button
                  key={zone}
                  className={`pill ${selectedZone === zone ? 'active-pill' : 'light-pill'}`}
                  onClick={() => { setSelectedZone(selectedZone === zone ? '' : zone); setCurrentPage(1); }}
                >
                  {zone}
                </button>
              ))}
            </div>

            <div className="action-group">
              <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>⊕ ADD AS RESIDENT</button>
              <div className="table-search">
                <input
                  type="text"
                  placeholder="Type a name here.."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
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
                  <th>ELECTION ELIGIBILITY</th>
                  <th>RISK STATUS</th>
                  <th>PERSONAL INFO</th>
                  <th>RESIDENT TYPE</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      Fetching records from database...
                    </td>
                  </tr>
                ) : residents.length === 0 ? (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                      No matching records found in the database.
                    </td>
                  </tr>
                ) : (
                  residents.map((res) => (
                    <tr key={res.id}>
                      <td>
                        <div className="resident-cell">
                          <div className="resident-avatar" style={{ backgroundColor: res.bgColor }}>{res.init}</div>
                          <div className="resident-info">
                            <strong>{res.name}</strong>
                            <span>{res.address}</span>
                          </div>
                        </div>
                      </td>
                      <td className={`text-${res.electionTone}`}>{res.election}</td>
                      <td>
                        {res.isAtRisk && (
                          <span className="risk-badge">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            AT RISK
                          </span>
                        )}
                      </td>
                      <td>
                        <button className="btn-view-details" onClick={() => setSelectedResident(res)}>
                          View Details 
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </button>
                      </td>
                      <td>
                        <span className={`type-pill pill-${res.typeTone}`}>{res.type}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            <div className="pagination">
              <button 
                className="page-btn" 
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
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
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                {'>'}
              </button>
            </div>
          </div>
        </main>
      </div>

      {selectedResident && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '520px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontFamily: 'inherit'
          }}>
            <h2 style={{ color: '#064E3B', fontSize: '18px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              PERSONAL INFORMATION PROFILE ({selectedResident.type.toUpperCase()})
            </h2>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>FULL NAME</label>
              <input type="text" readOnly value={selectedResident.fullNamedb} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '14px', fontWeight: '600', color: '#1F2937' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>CONTACT NUMBER</label>
                <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#F9FAFB' }}>
                  <span style={{ padding: '10px', backgroundColor: '#E5E7EB', color: '#374151', fontSize: '13px', borderRight: '1px solid #D1D5DB' }}>+63</span>
                  <input type="text" readOnly value={selectedResident.phone} style={{ width: '100%', padding: '10px', border: 'none', backgroundColor: 'transparent', fontSize: '14px', outline: 'none' }} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>EMAIL ADDRESS</label>
              <input type="text" readOnly value={selectedResident.email} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '14px', color: '#1F2937' }} />
            </div>

            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px', marginBottom: '20px' }}>
              <h3 style={{ color: '#064E3B', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>PROPERTY ADDRESS</h3>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>FULL FORMATTED ADDRESS</label>
                <input type="text" readOnly value={selectedResident.address || ''} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '14px', fontWeight: 'bold', color: '#1F2937' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>HOUSE NO.</label>
                  <input type="text" readOnly value={selectedResident.houseNo || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>BLOCK</label>
                  <input type="text" readOnly value={selectedResident.block || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>LOT</label>
                  <input type="text" readOnly value={selectedResident.lot || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>ZONE</label>
                  <input type="text" readOnly value={selectedResident.zone || ''} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>STREET</label>
                  <input type="text" readOnly value={selectedResident.street || ''} placeholder="-" style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', backgroundColor: '#F9FAFB', fontSize: '13px' }} />
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setSelectedResident(null)}
                style={{
                  width: '100%', padding: '12px', backgroundColor: '#064E3B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
                }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '520px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', fontFamily: 'inherit'
          }}>
            <h2 style={{ color: '#064E3B', fontSize: '18px', textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', letterSpacing: '0.5px' }}>
              REGISTER NEW RESIDENT
            </h2>

            <form onSubmit={handleCreateResident}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>FULL NAME</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter full name"
                  value={newResidentForm.fullName}
                  onChange={(e) => setNewResidentForm({...newResidentForm, fullName: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', color: '#1F2937' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>RESIDENT TYPE</label>
                  <select 
                    value={newResidentForm.type}
                    onChange={(e) => setNewResidentForm({...newResidentForm, type: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', backgroundColor: 'white' }}
                  >
                    <option value="Homeowner">Homeowner</option>
                    <option value="Tenant">Tenant</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>ZONE</label>
                  <select 
                    value={newResidentForm.zone}
                    onChange={(e) => setNewResidentForm({...newResidentForm, zone: e.target.value})}
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', backgroundColor: 'white' }}
                  >
                    <option value="ZONE 1">ZONE 1</option>
                    <option value="ZONE 2">ZONE 2</option>
                    <option value="ZONE 3">ZONE 3</option>
                    <option value="ZONE 4">ZONE 4</option>
                    <option value="ZONE 5">ZONE 5</option>
                    <option value="ZONE 6">ZONE 6</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>CONTACT NUMBER</label>
                  <div style={{ display: 'flex', border: '1px solid #D1D5DB', borderRadius: '6px', overflow: 'hidden' }}>
                    <span style={{ padding: '10px', backgroundColor: '#E5E7EB', color: '#374151', fontSize: '13px', borderRight: '1px solid #D1D5DB' }}>+63</span>
                    <input 
                      type="text" 
                      placeholder="9123456789"
                      value={newResidentForm.phone}
                      onChange={(e) => setNewResidentForm({...newResidentForm, phone: e.target.value})}
                      style={{ width: '100%', padding: '10px', border: 'none', fontSize: '14px', outline: 'none' }} 
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 'bold', color: '#4B5563', marginBottom: '5px' }}>EMAIL ADDRESS</label>
                <input 
                  type="email" 
                  placeholder="resident@email.com"
                  value={newResidentForm.email}
                  onChange={(e) => setNewResidentForm({...newResidentForm, email: e.target.value})}
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '14px', color: '#1F2937' }} 
                />
              </div>

              <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '15px', marginBottom: '20px' }}>
                <h3 style={{ color: '#064E3B', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>PROPERTY DETAILS</h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>HOUSE NO.</label>
                    <input 
                      type="text" 
                      placeholder="123"
                      value={newResidentForm.houseNo}
                      onChange={(e) => setNewResidentForm({...newResidentForm, houseNo: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>BLOCK</label>
                    <input 
                      type="text" 
                      placeholder="Blk 4"
                      value={newResidentForm.block}
                      onChange={(e) => setNewResidentForm({...newResidentForm, block: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }} 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>LOT</label>
                    <input 
                      type="text" 
                      placeholder="Lot 8"
                      value={newResidentForm.lot}
                      onChange={(e) => setNewResidentForm({...newResidentForm, lot: e.target.value})}
                      style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }} 
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#4B5563', marginBottom: '3px' }}>STREET</label>
                  <input 
                    type="text" 
                    placeholder="Rosal St."
                    value={newResidentForm.street}
                    onChange={(e) => setNewResidentForm({...newResidentForm, street: e.target.value})}
                    style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #D1D5DB', fontSize: '13px' }} 
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  style={{
                    flex: 1, padding: '12px', backgroundColor: '#E5E7EB', color: '#374151', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
                  }}
                >
                  CANCEL
                </button>
                <button 
                  type="submit"
                  style={{
                    flex: 1, padding: '12px', backgroundColor: '#064E3B', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px'
                  }}
                >
                  SAVE RESIDENT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}