"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import './style.css';

// Consistent icon set matching the dashboard layout
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
  { label: 'Complaints', href: '/admin/complaints', active: true, icon: Icons.complaints },
  { label: 'Residents', href: '/admin/residents', icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant_management', icon: Icons.tenant }
];

const filterZones = ['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'];

const API_BASE = 'http://localhost:5000/api';

const normalize = (value) => (value || '').toString().trim().toLowerCase();

const formatLabel = (value) => (value || '')
  .toString()
  .replace(/_/g, ' ')
  .toLowerCase()
  .replace(/\b\w/g, (letter) => letter.toUpperCase());

const getCategoryBadgeClass = (category) => {
  const val = normalize(category);
  if (val.includes('financial')) return 'cat-financial';
  if (val.includes('infra')) return 'cat-infrastructure';
  if (val.includes('beautification')) return 'cat-beautification';
  if (val.includes('public') || val.includes('pr')) return 'cat-pr';
  if (val.includes('griev')) return 'cat-grievance';
  if (val.includes('sport')) return 'cat-sport';
  return 'cat-infrastructure';
};

export default function AdminComplaintsPage() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedZone, setSelectedZone] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeModalComplaint, setActiveModalComplaint] = useState(null);

  const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
  const [escalationReason, setEscalationReason] = useState('');
  const [selectedDirector, setSelectedDirector] = useState('');
  const [isEscalationSuccessOpen, setIsEscalationSuccessOpen] = useState(false);
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false);
  const [updateStatusValue, setUpdateStatusValue] = useState('');
  const [updateStatusDescription, setUpdateStatusDescription] = useState('');
  const [isUpdateStatusSuccessOpen, setIsUpdateStatusSuccessOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [isResolveSuccessOpen, setIsResolveSuccessOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const pageSize = 8;

  const fetchComplaints = async () => {
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/complaints`);
      const data = await response.json();
      setComplaintsData(data.complaints || []);
    } catch (error) {
      console.error('Failed to load complaints:', error);
      setComplaintsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedZone]);

  const handleEscalateSubmit = async () => {
    if (!activeModalComplaint) return;
    if (!escalationReason.trim()) {
      alert('Please enter an escalation reason.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/complaints/${activeModalComplaint.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'ESCALATED',
          description: escalationReason,
          assigned_director_id: selectedDirector || 'DIR-2026-0001'
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to escalate complaint.');
      }

      await fetchComplaints();

      setIsEscalateModalOpen(false);
      setIsEscalationSuccessOpen(true);
    } catch (error) {
      console.error('Failed to escalate complaint:', error);
      alert(error.message || 'Failed to escalate complaint on the server.');
    }
  };

  const handleOpenEscalationModal = () => {
    setEscalationReason('');
    setSelectedDirector('');
    setIsEscalateModalOpen(true);
  };

  const handleOpenComplaintDetails = (complaint) => {
    setActiveModalComplaint(complaint);
    setIsDetailsModalOpen(true);
  };

  const handleOpenUpdateStatusModal = () => {
    setUpdateStatusValue(normalize(activeModalComplaint?.status || '').replace(/\s+/g, '_').toUpperCase());
    setUpdateStatusDescription(activeModalComplaint?.escalationRemarks || activeModalComplaint?.description || '');
    setIsUpdateStatusOpen(true);
  };

  const handleUpdateStatusSubmit = async () => {
    if (!activeModalComplaint) return;

    if (!updateStatusValue.trim()) {
      alert('Please select a status.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/complaints/${activeModalComplaint.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: updateStatusValue,
          description: updateStatusDescription,
          assigned_director_id: activeModalComplaint.assignedDirectorId || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update complaint status.');
      }

      await fetchComplaints();

      setIsUpdateStatusOpen(false);
      setIsUpdateStatusSuccessOpen(true);
    } catch (error) {
      console.error('Failed to update complaint status:', error);
      alert(error.message || 'Failed to update complaint status.');
    }
  };

  const handleOpenResolveModal = (complaint) => {
    setActiveModalComplaint(complaint);
    setResolutionNote(complaint?.escalationRemarks || complaint?.description || '');
    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async () => {
    if (!activeModalComplaint) return;

    if (!resolutionNote.trim()) {
      alert('Please enter a resolution note.');
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/complaints/${activeModalComplaint.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'RESOLVED',
          description: resolutionNote,
          assigned_director_id: activeModalComplaint.assignedDirectorId || null
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to resolve complaint.');
      }

      await fetchComplaints();

      setIsResolveModalOpen(false);
      setIsResolveSuccessOpen(true);
    } catch (error) {
      console.error('Failed to resolve complaint:', error);
      alert(error.message || 'Failed to resolve complaint.');
    }
  };

  // Separate active pending vs resolved items for filter chips
  const activePendingList = complaintsData.filter(item => normalize(item.status) !== 'resolved');
  const resolvedList = complaintsData.filter(item => normalize(item.status) === 'resolved');

  const categoryCounts = activePendingList.reduce((accumulator, complaint) => {
    const categoryKey = complaint.categoryRaw || complaint.category || 'GENERAL';
    accumulator[categoryKey] = (accumulator[categoryKey] || 0) + 1;
    return accumulator;
  }, {});

  const categoryFilters = [
    {
      key: 'ALL',
      label: `All Complaints (${activePendingList.length})`
    },
    ...Object.entries(categoryCounts).map(([key, count]) => ({
      key,
      label: `${formatLabel(key)} (${count})`
    })),
    {
      key: 'RESOLVED_HISTORY',
      label: `Resolved History (${resolvedList.length})`
    }
  ];

  const filteredComplaints = complaintsData.filter((complaint) => {
    const searchValue = normalize(searchQuery);
    const complaintZone = normalize(complaint.zone);
    const complaintCategory = normalize(complaint.categoryRaw || complaint.category);
    const statusVal = normalize(complaint.status);

    if (selectedCategory === 'RESOLVED_HISTORY') {
      const matchesResolvedStatus = statusVal === 'resolved';
      const matchesSearch = !searchValue || [
        complaint.ticket, complaint.name, complaint.address, complaint.subject, complaint.status, complaint.category
      ].filter(Boolean).join(' ').toLowerCase().includes(searchValue);
      const matchesZone = selectedZone === 'ALL' || complaintZone.includes(normalize(selectedZone));
      return matchesResolvedStatus && matchesSearch && matchesZone;
    }

    if (statusVal === 'resolved') return false;

    const complaintText = [
      complaint.ticket,
      complaint.name,
      complaint.address,
      complaint.subject,
      complaint.status,
      complaint.category
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();

    const matchesSearch = !searchValue || complaintText.includes(searchValue);
    const matchesCategory = selectedCategory === 'ALL' || complaintCategory === normalize(selectedCategory);
    const matchesZone = selectedZone === 'ALL' || complaintZone.includes(normalize(selectedZone));

    return matchesSearch && matchesCategory && matchesZone;
  });

  const totalPages = Math.max(1, Math.ceil(filteredComplaints.length / pageSize));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const pageStart = (safeCurrentPage - 1) * pageSize;
  const complaintsToShow = filteredComplaints.slice(pageStart, pageStart + pageSize);
  const paginationPages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <main className="layout-wrapper">
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
            <Link
              key={item.label}
              href={item.href}
              className={`nav-link ${item.active ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
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

        <section className="content-area">
          <header className="topbar">
            <div className="search-bar-large">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input
                type="text"
                placeholder="Search complaints..."
                aria-label="Search complaints"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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

          <div className="page-title-section">
            <h1>Community Complaint Queue</h1>
            <p>Managing community wellness and reported environmental incidents.</p>
          </div>

          <div className="filters-section">
            <div className="filter-group type-filters">
              {categoryFilters.map((category) => (
                <button
                  key={category.key}
                  className={`pill ${selectedCategory === category.key ? 'active-pill' : 'light-pill'}`}
                  onClick={() => setSelectedCategory(category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <div className="filter-group zone-filters">
              {filterZones.map((zone) => (
                <button
                  key={zone}
                  className={`pill ${selectedZone === zone ? 'active-pill' : 'light-pill'}`}
                  onClick={() => setSelectedZone(selectedZone === zone ? 'ALL' : zone)}
                >
                  {zone}
                </button>
              ))}
            </div>
          </div>

          <div className="info-banner">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            Comprehensive tracking and administrative oversight for all neighborhood concerns.
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>TICKET #</th>
                  <th>RESIDENT</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>PRIORITY SCORE</th>
                  <th>COMPLAINT SUBJECT</th>
                  <th>EXECUTIVE ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      Fetching complaint records from the database...
                    </td>
                  </tr>
                ) : complaintsToShow.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                      No matching complaints found.
                    </td>
                  </tr>
                ) : (
                  complaintsToShow.map((row) => (
                    <tr key={row.id}>
                      <td><strong>{row.ticket}</strong></td>
                      <td>
                        <div className="resident-cell">
                          <div className="resident-avatar" style={{ backgroundColor: row.bgColor }}>{row.init}</div>
                          <div className="resident-info">
                            <strong>{row.name}</strong>
                            <span>{row.address}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`cat-pill ${getCategoryBadgeClass(row.category)}`}>{row.category}</span>
                      </td>
                      <td>
                        <span className={`status-pill stat-${row.statusTone}`}>{row.status}</span>
                      </td>
                      <td className={`prio-score prio-${row.prioTone}`}>{row.priority}</td>
                      <td>
                        <div 
                          className="subject-cell" 
                          onClick={() => handleOpenComplaintDetails(row)}
                          style={{ cursor: 'pointer' }}
                          title="Click to view complaint details"
                        >
                          {row.subject}
                          <svg className="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        </div>
                      </td>
                      <td>
                        <div className="actions-cell">
                          <button type="button" className="btn-resolve" onClick={() => handleOpenResolveModal(row)}>Resolve</button>
                          <button className="btn-map">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {complaintsData.length > 0 && (
              <div className="pagination">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={safeCurrentPage === 1}
                  aria-label="Previous page"
                >
                  {'<'}
                </button>

                {paginationPages.map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${safeCurrentPage === page ? 'active' : ''}`}
                    onClick={() => setCurrentPage(page)}
                    aria-current={safeCurrentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={safeCurrentPage === totalPages}
                  aria-label="Next page"
                >
                  {'>'}
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Dynamic Complaint Details Modal Pop-up */}
      {isDetailsModalOpen && activeModalComplaint && (
        <div className="modal-backdrop" onClick={() => { setIsDetailsModalOpen(false); setActiveModalComplaint(null); }}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => { setIsDetailsModalOpen(false); setActiveModalComplaint(null); }}>×</button>
            <div className="modal-content-grid">
              <div className="modal-left-pane">
                <div className="modal-field-block">
                  <span className="modal-field-label">SUBJECT</span>
                  <h3>{activeModalComplaint.subject}</h3>
                </div>
                <div className="modal-field-block">
                  <span className="modal-field-label">DESCRIPTION</span>
                  <p>{activeModalComplaint.description || activeModalComplaint.complaintDesc || 'No description provided for this incident.'}</p>
                </div>
                <div className="modal-field-block">
                  <span className="modal-field-label">PHOTO EVIDENCE</span>
                  {activeModalComplaint.evidenceImg ? (
                    <div className="evidence-img-container">
                      <img 
                        src={`${API_BASE.replace('/api', '')}/${activeModalComplaint.evidenceImg}`} 
                        alt="Evidence" 
                        onError={(e) => {
                          e.target.style.display = 'none';
                          if (e.target.nextSibling) e.target.nextSibling.style.display = 'block';
                        }} 
                      />
                      <div className="evidence-fallback" style={{ display: 'none', padding: '20px', background: '#f3f4f6', borderRadius: '8px', fontSize: '13px', color: '#4b5563' }}>
                        Attachment reference: {activeModalComplaint.evidenceImg}
                      </div>
                    </div>
                  ) : (
                    <p className="no-evidence-text">No photo evidence attached.</p>
                  )}
                </div>
              </div>

              <div className="modal-right-pane">
                <div className="modal-ticket-header">
                  <h2>TICKET # {activeModalComplaint.ticket}</h2>
                </div>
                <div className="modal-resident-box">
                  <p><strong>Uploaded by:</strong> {activeModalComplaint.name}</p>
                  <p><strong>Address:</strong> {activeModalComplaint.address}</p>
                </div>
                <div className="modal-meta-grid">
                  <div className="modal-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                    <div>
                      <span className="meta-label">DATE FILLED</span>
                      <span className="meta-value">
                        {activeModalComplaint.createdAt ? new Date(activeModalComplaint.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div className="modal-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
                    <div>
                      <span className="meta-label">STATUS</span>
                      <span className="meta-value">{activeModalComplaint.status}</span>
                    </div>
                  </div>
                  <div className="modal-meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                    <div>
                      <span className="meta-label">CATEGORY</span>
                      <span className="meta-value">{activeModalComplaint.category}</span>
                    </div>
                  </div>
                </div>

                <div className="modal-actions">
                  <button className="btn-escalate" onClick={handleOpenEscalationModal}>
                    Escalate to Director
                  </button>
                  <button className="btn-update-status" onClick={handleOpenUpdateStatusModal}>
                    Update Status
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Escalation Sub-Modal */}
      {isEscalateModalOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1100 }}>
          <div className="escalate-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="escalate-header-row">
              <div className="escalate-icon-box">!</div>
              <div>
                <h2>Escalate to Director</h2>
                <span className="case-subtext">Case#{activeModalComplaint.ticket}</span>
              </div>
            </div>

            <div className="escalate-warning-box">
              <span className="warning-icon">ⓘ</span>
              <p>Escalate this complaint will immediately notify the Director of Operations. This action is intended for escalating cases that require institutional oversight.</p>
            </div>

            <div className="escalate-form-group">
              <label>ESCALATION REASON</label>
              <input
                type="text"
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                placeholder="Enter escalation reason..."
              />
            </div>

            <div className="escalate-form-group">
              <label>CHOOSE RESPECTIVE DIRECTOR</label>
              <select value={selectedDirector} onChange={(e) => setSelectedDirector(e.target.value)}>
                <option value="">Select a director...</option>
                <option value="DIR-2026-0001">Director Victorio (DIR-2026-0001)</option>
              </select>
            </div>

            <div className="escalate-button-row">
              <button className="btn-confirm-escalate" onClick={handleEscalateSubmit}>
                <span className="arrow-icon">➔</span> ESCALATE TO DIRECTOR
              </button>
              <button className="btn-cancel-escalate" onClick={() => setIsEscalateModalOpen(false)}>
                ✕ CANCEL ESCALATION
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateStatusOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1150 }} onClick={() => setIsUpdateStatusOpen(false)}>
          <div className="status-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close status-modal-close" onClick={() => setIsUpdateStatusOpen(false)}>×</button>
            <div className="status-header-row">
              <div className="status-icon-box">⟳</div>
              <div>
                <h2>Update Complaint Status</h2>
                <span className="case-subtext">TICKET # {activeModalComplaint.ticket}</span>
              </div>
            </div>

            <div className="escalate-form-group">
              <label>UPDATE STATUS</label>
              <select value={updateStatusValue} onChange={(e) => setUpdateStatusValue(e.target.value)}>
                <option value="">Select Status...</option>
                <option value="ACTIVE">Active</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="ESCALATED">Escalated</option>
                <option value="RESOLVED">Resolved</option>
              </select>
            </div>

            <div className="escalate-form-group">
              <label>DESCRIPTION OF STATUS</label>
              <textarea
                value={updateStatusDescription}
                onChange={(e) => setUpdateStatusDescription(e.target.value)}
                placeholder="Document the findings or required next steps for this status change..."
                rows={5}
              />
            </div>

            <div className="status-warning-box">
              <span className="warning-icon">ⓘ</span>
              <p>Resident will be notified regarding the status update.</p>
            </div>

            <div className="escalate-button-row">
              <button className="btn-confirm-escalate" onClick={handleUpdateStatusSubmit}>
                <span className="arrow-icon">➔</span> UPDATE STATUS
              </button>
              <button className="btn-cancel-escalate" onClick={() => setIsUpdateStatusOpen(false)}>
                ✕ CANCEL UPDATE
              </button>
            </div>
          </div>
        </div>
      )}

      {isUpdateStatusSuccessOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }} onClick={() => setIsUpdateStatusSuccessOpen(false)}>
          <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close success-modal-close" onClick={() => setIsUpdateStatusSuccessOpen(false)}>×</button>
            <div className="success-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="8 12.5 10.8 15.3 16 9"></polyline>
              </svg>
            </div>
            <h2>Complaint Successfully Updated!</h2>
            <p>Ticket #{activeModalComplaint.ticket} status has been updated to {formatLabel(updateStatusValue)}.</p>

            <div className="success-summary-table">
              <div className="summary-row">
                <span>Status</span>
                <strong>{formatLabel(updateStatusValue)}</strong>
              </div>
              <div className="summary-row">
                <span>Description</span>
                <strong>{updateStatusDescription || 'No status description provided.'}</strong>
              </div>
            </div>

            <button
              className="btn-return-dashboard"
              onClick={() => {
                setIsUpdateStatusSuccessOpen(false);
                setActiveModalComplaint(null);
              }}
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      )}

      {isResolveModalOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1175 }} onClick={() => setIsResolveModalOpen(false)}>
          <div className="resolve-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close resolve-modal-close" onClick={() => setIsResolveModalOpen(false)}>×</button>
            <div className="resolve-header-row">
              <div className="resolve-icon-box">✓</div>
              <div>
                <h2>Mark as Resolved</h2>
                <span className="case-subtext">Ticket # {activeModalComplaint.ticket}</span>
              </div>
            </div>

            <div className="escalate-form-group">
              <label>RESOLUTION NOTE</label>
              <textarea
                onChange={(e) => setResolutionNote(e.target.value)}
                placeholder="e.g. Issue has been resolved, or personnel team repaired fence as requested..."
                rows={5}
              />
            </div>

            <div className="status-warning-box">
              <span className="warning-icon">ⓘ</span>
              <p>Resident will be notified regarding the status update.</p>
            </div>

            <div className="escalate-button-row">
              <button className="btn-confirm-escalate" onClick={handleResolveSubmit}>
                <span className="arrow-icon">➔</span> MARK AS RESOLVED
              </button>
              <button className="btn-cancel-escalate" onClick={() => setIsResolveModalOpen(false)}>
                ✕ CANCEL RESOLUTION
              </button>
            </div>
          </div>
        </div>
      )}

      {isResolveSuccessOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }} onClick={() => setIsResolveSuccessOpen(false)}>
          <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close success-modal-close" onClick={() => setIsResolveSuccessOpen(false)}>×</button>
            <div className="success-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="8 12.5 10.8 15.3 16 9"></polyline>
              </svg>
            </div>
            <h2>Complaint Successfully Updated!</h2>
            <p>Ticket #{activeModalComplaint.ticket} status has been updated to Resolved.</p>

            <div className="success-summary-table">
              <div className="summary-row">
                <span>Status</span>
                <strong>Resolved</strong>
              </div>
              <div className="summary-row">
                <span>Description</span>
                <strong>{resolutionNote || 'No status description provided.'}</strong>
              </div>
            </div>

            <button
              className="btn-return-dashboard"
              onClick={() => {
                setIsResolveSuccessOpen(false);
                setActiveModalComplaint(null);
              }}
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      )}

      {isEscalationSuccessOpen && activeModalComplaint && (
        <div className="modal-backdrop" style={{ zIndex: 1200 }} onClick={() => setIsEscalationSuccessOpen(false)}>
          <div className="success-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close success-modal-close" onClick={() => setIsEscalationSuccessOpen(false)}>×</button>
            <div className="success-icon-box">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="8 12.5 10.8 15.3 16 9"></polyline>
              </svg>
            </div>
            <h2>Complaint Successfully Escalated!</h2>
            <p>Case #{activeModalComplaint.ticket} has been transferred to the respective Director.</p>

            <div className="success-summary-table">
              <div className="summary-row">
                <span>Director</span>
                <strong>Zone 3 Director</strong>
              </div>
              <div className="summary-row">
                <span>Escalation Reason</span>
                <strong>{escalationReason}</strong>
              </div>
            </div>

            <button
              className="btn-return-dashboard"
              onClick={() => {
                setIsEscalationSuccessOpen(false);
                setActiveModalComplaint(null);
              }}
            >
              RETURN TO DASHBOARD
            </button>
          </div>
        </div>
      )}
    </main>
  );
}