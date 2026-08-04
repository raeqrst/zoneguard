"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Analytics', href: '/admin/analytics' },
  { label: 'Map', href: '#' },
  { label: 'Complaints', href: '/admin/complaints' },
  { label: 'Residents', href: '/admin/residents', active: true },
  { label: 'Tenant Management', href: '#' },
  { label: 'Registered Vehicle', href: '#' },
];

const GroupIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const zones = ['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'];

function ResidentAvatar({ initials, bg }) {
  return (
    <div className="ar-avatar" style={{ backgroundColor: bg }}>
      {initials}
    </div>
  );
}

function EligibilityBadge({ status }) {
  if (!status || status === 'N/A') {
    return <span className="ar-badge neutral">{status || 'N/A'}</span>;
  }
  if (status === 'Eligible') {
    return <span className="ar-badge eligible">{status}</span>;
  }
  return <span className="ar-badge ineligible">{status}</span>;
}

function RiskBadge({ status }) {
  if (!status) return null;
  return <span className="ar-risk-badge">{status}</span>;
}

export default function AdminResidentsPage() {
  const [selectedResident, setSelectedResident] = useState(null); // Tracks which resident to show in modal
  const [residents, setResidents] = useState([]); 
  const [totalTenants, setTotalTenants] = useState(0);
  const [totalHomeowners, setTotalHomeowners] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('All Residents'); 
  const [selectedZone, setSelectedZone] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const fetchResidents = async () => {
      try {
        let url = 'http://localhost:3000/api/residents';
        if (selectedZone) {
          url += `?zone=${encodeURIComponent(selectedZone)}`;
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();

        const dbUsers = Array.isArray(data) ? data : (data.residents || []);
        
        setTotalTenants(data.totalTenants ?? dbUsers.filter(u => u.system_role === 'TENANT').length);
        setTotalHomeowners(data.totalHomeowners ?? dbUsers.filter(u => u.system_role === 'HOMEOWNER').length);

        const formattedResidents = dbUsers.map((user) => ({
          initials: `${user.first_name?.[0] || 'U'}${user.last_name?.[0] || 'N'}`,
          name: `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`,
          zone: user.zone ? user.zone.zone_name : 'No Zone Assigned',
          stickerEligibility: 'Eligible', 
          electionEligibility: 'Not Eligible', 
          riskStatus: user.account_status === 'SUSPENDED' ? 'AT RISK' : null,
          personalInfo: 'View Details',
          residentType: user.system_role === 'HOMEOWNER' ? 'Homeowner' : 'Tenant',
          avatarBg: user.system_role === 'HOMEOWNER' ? '#f59e0b' : '#9d7749',
          email: user.email,
          phone_number: user.phone_number || 'N/A',
        }));

        setResidents(formattedResidents);
      } catch (error) {
        console.error("Error fetching residents:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResidents();
  }, [selectedZone]);

  const filteredResidents = residents.filter((resident) => {
    const matchesTab = 
      activeTab === 'All Residents' ? true :
      activeTab === 'Tenants' ? resident.residentType === 'Tenant' :
      activeTab === 'Homeowners' ? resident.residentType === 'Homeowner' : true;

    const matchesSearch = resident.name.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  const totalPages = Math.ceil(filteredResidents.length / itemsPerPage);
  const paginatedResidents = filteredResidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const residentStats = [
    {
      label: 'Total Tenants',
      value: totalTenants.toLocaleString(),
      year: 'Year 2026',
      icon: <GroupIcon />,
      tone: 'light',
    },
    {
      label: 'Total Homeowner',
      value: totalHomeowners.toLocaleString(),
      year: 'Year 2026',
      icon: <GroupIcon />,
      tone: 'dark',
    },
  ];

  return (
    <main className="ar-shell">
      <aside className="ar-sidebar">
        <div className="ar-brand">
          <div className="ar-brand-mark">ZG</div>
          <div>
            <strong>ZoneGuard</strong>
            <p>NIA VILLAGE SUBD.</p>
          </div>
        </div>

        <nav className="ar-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`ar-nav-item ${item.active ? 'is-active' : ''}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ar-sidebar-footer">
          <button type="button" className="ar-nav-item">Account Settings</button>
          <button type="button" className="ar-nav-item">Logout</button>
        </div>
      </aside>

      <section className="ar-main">
        <header className="ar-topbar">
          <div className="ar-user">
            <div>
              <strong>Admin</strong>
              <p>ADMINISTRATOR</p>
            </div>
            <span>AD</span>
          </div>
        </header>

        <section className="ar-hero-row">
          <div>
            <h1>Resident Master List</h1>
            <p>Central management for all registered residents properties and homeowners.</p>
          </div>
        </section>

        <div className="ar-stats-grid">
          {residentStats.map((stat) => (
            <article key={stat.label} className={`ar-stat-card tone-${stat.tone}`}>
              <div className="ar-stat-icon">{stat.icon}</div>
              <div>
                <p>{stat.label}</p>
                <strong>{stat.value}</strong>
                <span className="ar-year-label">
                  <span className="ar-yellow-dot"></span> {stat.year}
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="ar-controls">
          <div className="ar-filter-tabs">
            {['All Residents', 'Tenants', 'Homeowners'].map((tab) => (
              <button
                key={tab}
                className={`ar-tab ${activeTab === tab ? 'active' : ''}`}
                onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="ar-controls-row">
            <div className="ar-zone-filter">
              {zones.map((zone) => {
                const isSelected = selectedZone === zone;
                return (
                  <button
                    key={zone}
                    type="button"
                    className={`ar-zone-btn ${isSelected ? 'is-active' : ''}`}
                    onClick={() => {
                      setSelectedZone(isSelected ? '' : zone); 
                      setCurrentPage(1);
                    }}
                  >
                    {zone}
                  </button>
                );
              })}
              {selectedZone && (
                <button 
                  type="button" 
                  onClick={() => { setSelectedZone(''); setCurrentPage(1); }} 
                  style={{ background: 'none', border: 'none', color: '#0f3c2e', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px', textDecoration: 'underline' }}
                >
                  Clear Zone
                </button>
              )}
            </div>

            <Link href="/admin/residents/add" className="ar-add-btn">
              + ADD RESIDENT
            </Link>
            <label className="ar-search">
              <span>⌕</span>
              <input 
                type="text" 
                placeholder="Type name here..." 
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                aria-label="Search here..." 
              />
            </label>
          </div>
        </div>

        <div className="ar-table-wrapper">
          <table className="ar-residents-table">
            <thead>
              <tr>
                <th>RESIDENT</th>
                <th>STICKER ELIGIBILITY</th>
                <th>ELECTION ELIGIBILITY</th>
                <th>RISK STATUS</th>
                <th>PERSONAL INFO</th>
                <th>RESIDENT TYPE</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Loading residents...</td>
                </tr>
              ) : paginatedResidents.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#6b7280' }}>
                    No residents found matching your filters.
                  </td>
                </tr>
              ) : (
                paginatedResidents.map((resident, index) => (
                  <tr key={index}>
                    <td>
                      <div className="ar-resident-cell">
                        <ResidentAvatar initials={resident.initials} bg={resident.avatarBg} />
                        <div>
                          <strong>{resident.name}</strong>
                          <span className="ar-zone">{resident.zone}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <EligibilityBadge status={resident.stickerEligibility} />
                    </td>
                    <td>
                      <EligibilityBadge status={resident.electionEligibility} />
                    </td>
                    <td>
                      <RiskBadge status={resident.riskStatus} />
                    </td>
                    <td>
                      <div 
                        className="ar-view-details" 
                        onClick={() => setSelectedResident(resident)}
                        style={{ cursor: 'pointer' }}
                      >
                        {resident.personalInfo} 
                        <span className="ar-eye-icon" style={{ marginLeft: '8px' }}>
                          👁
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className={`ar-type-badge type-${resident.residentType.toLowerCase()}`}>
                        {resident.residentType}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="ar-pagination">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={currentPage === i + 1 ? 'active' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              ›
            </button>
          </div>
        )}
      </section>
      
      {/* --- PERSONAL INFO MODAL --- */}
      {selectedResident && (
        <div className="ar-modal-overlay">
          <div className="ar-modal-box" style={{ padding: '30px', maxWidth: '450px', width: '100%', background: '#fff', borderRadius: '12px' }}>
            <h2 className="ar-modal-title" style={{ fontSize: '18px', textAlign: 'center', color: '#0f3c2e', marginBottom: '20px' }}>
              PERSONAL INFORMATION PROFILE<br />
              <span style={{ fontSize: '14px', color: '#64748b' }}>({selectedResident.residentType.toUpperCase()})</span>
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: '#334155', marginBottom: '25px', background: '#f8fafc', padding: '15px', borderRadius: '8px' }}>
              <div><strong>Full Name:</strong> {selectedResident.name}</div>
              <div><strong>Email:</strong> {selectedResident.email}</div>
              <div><strong>Phone:</strong> {selectedResident.phone_number}</div>
              <div><strong>Zone:</strong> {selectedResident.zone}</div>
              <div><strong>Resident Type:</strong> {selectedResident.residentType}</div>
            </div>

            <button 
              className="ar-modal-close" 
              onClick={() => setSelectedResident(null)}
              style={{ width: '100%', padding: '10px', background: '#0f3c2e', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </main>
  );
}