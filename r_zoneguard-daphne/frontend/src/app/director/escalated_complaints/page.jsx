'use client';
import React, { useState, useEffect } from 'react';
import './style.css';

const Icons = {
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  ),
  export: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  shield: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  close: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  calendar: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  trendingUp: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  fileText: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
};

const API_BASE = 'http://localhost:5000/api';
const normalize = (val) => (val || '').toString().trim().toLowerCase();

export default function EscalatedComplaintsPage() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All Pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);
<<<<<<< HEAD
=======
  const [currentDirector, setCurrentDirector] = useState({
    name: 'Dir. Del Rosario',
    role: 'ZONE 3 DIRECTOR',
    initials: 'DR'
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('zoneguard_user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const fName = parsed.first_name || parsed.firstName || '';
        const lName = parsed.last_name || parsed.lastName || 'Del Rosario';
        const formattedName = fName ? `${fName.charAt(0)}. ${lName}` : `Dir. ${lName}`;
        const initials = `${fName ? fName.charAt(0) : 'D'}${lName.charAt(0)}`.toUpperCase();

        setCurrentDirector({
          name: formattedName,
          role: parsed.role ? parsed.role.replace('_', ' ') : 'ZONE 3 DIRECTOR',
          initials: initials
        });
      }
    } catch (error) {
      console.error("Error loading director session:", error);
    }
  }, []);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

  const fetchComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/complaints`);
      const result = await response.json();
      
      const rawData = Array.isArray(result) ? result : (result.complaints || []);
      
      const formatted = rawData.map(item => {
        const fullName = item.user 
          ? `${item.user.firstName || ''} ${item.user.lastName || ''}`.trim() 
          : (item.name || 'Anonymous Resident');

        return {
          id: item.id || item.ticket_id,
          ticket: item.id || item.ticket_id,
          name: fullName,
          address: item.user?.zoneId ? `Zone ${item.user.zoneId}` : (item.address || 'Zone 3 NIA Village'),
          categoryRaw: item.category || item.complaintCategory || 'GENERAL',
          category: (item.category || item.complaintCategory || 'General').replace(/_/g, ' '),
          status: item.status || 'ACTIVE',
          subject: item.subject || item.complaintSubject || 'No Subject',
          description: item.description || item.complaintDesc || 'No description provided.',
          escalationReason: item.escalationReason || item.escalationRemarks || 'Standard administrative review.',
          evidenceImg: item.evidenceImg || item.evidence_img || null,
          createdAt: item.createdAt || item.created_at,
          bgColor: item.bgColor || '#064e3b'
        };
      });

      setComplaintsData(formatted);
    } catch (error) {
      console.error('Failed to load complaints from backend:', error);
      setComplaintsData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

<<<<<<< HEAD
  // Strict check: Only status === 'escalated' counts as pending for Director triage
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const pendingList = complaintsData.filter(item => normalize(item.status) === 'escalated');
  const resolvedList = complaintsData.filter(item => normalize(item.status) === 'resolved');

  const categoryCounts = complaintsData.reduce((acc, item) => {
    if (normalize(item.status) === 'escalated') {
      const cat = (item.categoryRaw || item.category || 'GENERAL').toUpperCase();
      acc[cat] = (acc[cat] || 0) + 1;
    }
    return acc;
  }, {});

  const dynamicCategoryFilters = [
    { label: `All Pending (${pendingList.length})`, key: 'All Pending' },
    ...Object.entries(categoryCounts).map(([catKey, count]) => ({
      label: `${catKey.charAt(0) + catKey.slice(1).toLowerCase().replace(/_/g, ' ')} (${count})`,
      key: catKey
    })),
    { label: `Resolved History (${resolvedList.length})`, key: 'Resolved History' }
  ];

<<<<<<< HEAD
  // Matches the CSS classes defined in your style.css (.badge-financial, .badge-infra, etc.)
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const getCategoryBadgeClass = (category) => {
    const val = normalize(category);
    if (val.includes('financial')) return 'badge-financial';
    if (val.includes('infra')) return 'badge-infra';
    if (val.includes('beautification')) return 'badge-beautification';
    if (val.includes('public') || val.includes('pr')) return 'badge-pr';
    if (val.includes('griev')) return 'badge-grievance';
    if (val.includes('sport')) return 'badge-sport';
    return 'badge-infra'; 
  };

  const filteredData = complaintsData.filter((item) => {
    const statusVal = normalize(item.status);
    const categoryVal = (item.categoryRaw || item.category || '').toUpperCase();
    
    let matchesStatus = false;
    if (activeFilter === 'All Pending') {
      matchesStatus = statusVal === 'escalated';
    } else if (activeFilter === 'Resolved History') {
      matchesStatus = statusVal === 'resolved';
    } else {
<<<<<<< HEAD
      // Robust comparison ignoring underscores, spacing, and casing
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      const cleanActive = activeFilter.replace(/\s+/g, '_').toUpperCase();
      const cleanItemCat = categoryVal.replace(/\s+/g, '_').toUpperCase();
      matchesStatus = statusVal === 'escalated' && cleanItemCat === cleanActive;
    }

    const searchStr = normalize(searchQuery);
    const matchesSearch = !searchStr || [
      item.ticket,
      item.name,
      item.address,
      item.subject,
      item.category
    ].filter(Boolean).join(' ').toLowerCase().includes(searchStr);

    return matchesStatus && matchesSearch;
  });

  const handleResolve = async (ticketId, dbId) => {
    try {
      const targetId = dbId || ticketId;
<<<<<<< HEAD
      const response = await fetch(`${API_BASE}/complaints/${targetId}/status`, { // <-- Add /status here
=======
      const response = await fetch(`${API_BASE}/complaints/${targetId}/status`, {
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'RESOLVED' })
      });

      if (!response.ok) throw new Error('Failed to update status');

      await fetchComplaints();
      if (selectedComplaint && (selectedComplaint.ticket === ticketId || selectedComplaint.id === dbId)) {
        setSelectedComplaint(null);
      }
      alert(`Complaint ${ticketId} marked as resolved successfully.`);
    } catch (error) {
      console.error('Error resolving complaint:', error);
      alert('Failed to update complaint status on the server.');
    }
  };

  const downloadCSV = (type) => {
    const dataToExport = type === 'pending' ? pendingList : resolvedList;

    if (!dataToExport || dataToExport.length === 0) {
      alert(`There are no ${type} complaints to export.`);
      return;
    }

    const headers = ["Ticket ID", "Resident Name", "Address", "Category", "Status", "Complaint Subject", "Date Filed", "Escalation Reason"];
    const escapeCSV = (str) => `"${(str || '').toString().replace(/"/g, '""')}"`;

    const csvRows = dataToExport.map(item => {
      const dateFiled = item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'N/A';
      return [
        escapeCSV(item.ticket),
        escapeCSV(item.name),
        escapeCSV(item.address),
        escapeCSV(item.categoryRaw || item.category),
        escapeCSV(item.status),
        escapeCSV(item.subject),
        escapeCSV(dateFiled),
        escapeCSV(item.escalationReason)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const currentDate = new Date().toISOString().split('T')[0];
    const filename = type === 'pending' 
      ? `Pending_Complaints_${currentDate}.csv` 
      : `Resolved_Complaints_History_${currentDate}.csv`;
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="main-content">
<<<<<<< HEAD
      <header className="top-header">
        <div className="search-bar">
          <span className="search-icon">{Icons.search}</span>
          <input 
            type="text" 
            placeholder="Search ticket id or residents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="user-profile">
          <div className="user-info">
            <div className="user-name">Dir. Del Rosario</div>
            <div className="user-role">ZONE 3 DIRECTOR</div>
          </div>
          <div className="avatar">DR</div>
        </div>
      </header>
=======
      {/* Absolute Top-Right Floating Profile Widget */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-24px', marginRight: '-12px', marginBottom: '8px' }}>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{currentDirector.name}</span>
            <span className="user-role">{currentDirector.role}</span>
          </div>
          <div className="user-avatar">{currentDirector.initials}</div>
        </div>
      </div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

      <div className="page-header">
        <div>
          <h1>Escalated Complaints Triage</h1>
          <p className="page-subtitle">
            Executive oversight for unresolved community grievances requiring Director-level finality.
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="export-btn" 
            onClick={() => downloadCSV('pending')}
            style={{ backgroundColor: '#ca8a04', color: '#fff' }}
          >
            {Icons.export} Export Pending
          </button>
          <button 
            className="export-btn" 
            onClick={() => downloadCSV('resolved')}
            style={{ backgroundColor: '#064e3b', color: '#fff' }}
          >
            {Icons.export} Export Resolved
          </button>
        </div>
      </div>

      <div className="top-section-grid">
        <div className="filters-container">
          <div className="pill-group">
            {dynamicCategoryFilters.map((cat) => {
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`pill-btn ${isActive ? 'active' : ''}`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
          <div className="info-text">
            ⓘ All pending represents the backlog of unresolved cases currently requiring executive oversight.
          </div>
        </div>

        <div className="protocol-card">
          <div className="protocol-title">
            <span className="protocol-icon">{Icons.shield}</span> Executive Protocols
          </div>
          <ul className="protocol-list">
            <li>
              <span className="check-icon">✓</span>
              Complaints escalated to the Director must be resolved within 48 hours.
            </li>
            <li>
              <span className="check-icon">✓</span>
              Provide a final resolution summary upon completing the triage.
            </li>
          </ul>
        </div>
      </div>

      <div className="table-card">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>TICKET ID</th>
              <th>RESIDENT</th>
              <th>CATEGORY</th>
              <th>STATUS</th>
              <th>COMPLAINT SUBJECT</th>
              <th className="align-right">EXECUTIVE ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                  Loading dynamic complaint database records...
                </td>
              </tr>
            ) : filteredData.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>
                  No complaints found for this category.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id || row.ticket}>
                  <td className="ticket-cell">{row.ticket}</td>
                  <td>
                    <div className="resident-cell">
                      <div className="res-avatar" style={{ backgroundColor: row.bgColor }}>
                        {row.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="res-name">{row.name}</div>
                        <div className="res-address">{row.address}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`cat-badge ${getCategoryBadgeClass(row.category)}`}>{row.category}</span>
                  </td>
                  <td>
                    <span className={`status-dot dot-${normalize(row.status)}`}></span>
                    <span className="status-text">{row.status}</span>
                  </td>
                  <td className="subject-cell">{row.subject}</td>
                  <td>
                    <div className="actions-cell">
                      <button 
                        className="view-btn" 
                        title="View details"
                        onClick={() => setSelectedComplaint(row)}
                      >
                        {Icons.eye}
                      </button>
                      {normalize(row.status) !== 'resolved' && (
                        <button 
                          className="action-btn resolve-btn"
                          onClick={() => handleResolve(row.ticket, row.id)}
                        >
                          Resolve
                        </button>
                      )}
                      <button className="action-btn icon-btn" title="View Location" onClick={() => alert(`Location: ${row.address}`)}>
                        {Icons.location}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="table-footer">
          <span className="footer-info">Showing {filteredData.length} active database records</span>
          <div className="pagination">
            <button className="page-nav">&lt;</button>
            <button className="page-num active">1</button>
            <button className="page-nav">&gt;</button>
          </div>
        </div>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setSelectedComplaint(null)}>
              {Icons.close}
            </button>
           
            <div className="modal-left">
              <div className="modal-subject-section">
                <span className="modal-section-label">SUBJECT</span>
                <h2>{selectedComplaint.subject}</h2>
              </div>
              <div className="modal-desc-section">
                <span className="modal-section-label">DESCRIPTION</span>
                <p>{selectedComplaint.description}</p>
              </div>
              <div className="modal-evidence-section">
                <span className="modal-section-label">PHOTO EVIDENCE</span>
                {selectedComplaint.evidenceImg ? (
                  <div style={{ marginTop: '10px' }}>
                    <img 
                      src={`${API_BASE.replace('/api', '')}/${selectedComplaint.evidenceImg}`} 
                      alt="Evidence" 
                      style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '8px' }}
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                ) : (
                  <div className="evidence-boxes">
                    <div className="evidence-box-placeholder" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#888' }}>No Image</div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-right">
              <div className="modal-right-header">
                <h3>CASE # {selectedComplaint.ticket}</h3>
              </div>
             
              <div className="modal-card-box">
                <span className="box-label">Uploaded by:</span>
                <div className="box-val font-semibold">{selectedComplaint.name}</div>
                <span className="box-label mt-2">Address:</span>
                <div className="box-val">{selectedComplaint.address}</div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.calendar}</span>
                <div>
                  <div className="tile-title">DATE FILED</div>
                  <div className="tile-sub">
                    {selectedComplaint.createdAt ? new Date(selectedComplaint.createdAt).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.trendingUp}</span>
                <div>
                  <div className="tile-title">ESCALATION REASON</div>
                  <div className="tile-sub">{selectedComplaint.escalationReason}</div>
                </div>
              </div>

              <div className="modal-info-tile">
                <span className="tile-icon">{Icons.fileText}</span>
                <div>
                  <div className="tile-title">CATEGORY</div>
                  <div className="tile-sub" style={{ textTransform: 'capitalize' }}>
                    {selectedComplaint.category}
                  </div>
                </div>
              </div>

              <button className="modal-download-btn" onClick={() => alert('Downloading evidence archive...')}>
                Download Evidence
              </button>
              {normalize(selectedComplaint.status) !== 'resolved' && (
                <button 
                  className="modal-resolve-btn"
                  onClick={() => handleResolve(selectedComplaint.ticket, selectedComplaint.id)}
                >
                  Confirm and Resolve
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}