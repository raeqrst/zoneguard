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
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
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

const complaintsData = [
  { ticket: 'F3-0009', init: 'CB', bgColor: '#8a6d3b', name: 'Charlie D. Balagtas', address: 'Zone 3, 25 Camiling St.', category: 'FINANCIAL', catTone: 'financial', status: 'Escalated', statusTone: 'escalated', priority: '10', prioTone: 'red', subject: 'Ledger Reversal' },
  { ticket: 'I3-0004', init: 'DP', bgColor: '#f0ad4e', name: 'Daisy C. Perez', address: 'Zone 3, 5 Jalaur St.', category: 'INFRASTRUCTURE', catTone: 'infrastructure', status: 'Investigating', statusTone: 'investigating', priority: '5', prioTone: 'yellow', subject: 'Broken Streetlights' },
  { ticket: 'B3-0032', init: 'MC', bgColor: '#778899', name: 'Mark Karl R. Cruz', address: 'Zone 3, 23 Pantabangan St.', category: 'BEAUTIFICATION', catTone: 'beautification', status: 'Investigating', statusTone: 'investigating', priority: '2', prioTone: 'green', subject: 'Unauthorized Tree Cut' },
  { ticket: 'P3-0031', init: 'ER', bgColor: '#d9534f', name: 'Earl V.Ramos', address: 'Zone 3, 4 Chico St.', category: 'PUBLIC RELATIONS', catTone: 'pr', status: 'Resolved', statusTone: 'resolved', priority: '5', prioTone: 'yellow', subject: 'Fake Memo Alert' },
  { ticket: 'F3-0015', init: 'DV', bgColor: '#555555', name: 'Darth C.Vader', address: 'Blk 8 Lot 61 01 Palico Lane St.', category: 'FINANCIAL', catTone: 'financial', status: 'Active', statusTone: 'active', priority: '5', prioTone: 'yellow', subject: 'Ledger Reversal' },
  { ticket: 'G3-0016', init: 'ED', bgColor: '#ea580c', name: 'Erlyn P. Dela Cruz', address: 'Zone 3, 10 Camiling St.', category: 'GRIEVANCE', catTone: 'grievance', status: 'Active', statusTone: 'active', priority: '8', prioTone: 'red', subject: 'Midnight Noise' },
  { ticket: 'G3-0014', init: 'MG', bgColor: '#d9534f', name: 'Mark Jason G. Garcia', address: 'Zone 3, 9 Jalaur St.', category: 'GRIEVANCE', catTone: 'grievance', status: 'Investigating', statusTone: 'investigating', priority: '8', prioTone: 'red', subject: 'Midnight Noise' },
  { ticket: 'I3-0011', init: 'DK', bgColor: '#a3e4d7', name: 'Donna K. Kamias', address: 'Zone 3, 21 Pantabangan St.', category: 'FINANCIAL', catTone: 'financial', status: 'Investigating', statusTone: 'investigating', priority: '5', prioTone: 'yellow', subject: 'Ledger Reversal' },
];

const filterCategories = [
  { label: 'All Complaints', active: true },
  { label: 'Infrastructure (3)' },
  { label: 'Public Relations (2)' },
  { label: 'Grievance (2)' },
  { label: 'Financial (1)' },
  { label: 'Beautification(1)' },
  { label: 'Sport (1)' },
  { label: 'Resolved (6)' },
];

const filterZones = ['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'];

export default function AdminComplaintsPage() {
  return (
    <main className="ad-shell">
      <aside className="ad-sidebar">
        <div className="ad-brand">
          <div className="ad-brand-mark">ZG</div>
          <div>
            <strong>ZoneGuard</strong>
            <p>NIA VILLAGE SUBD.</p>
          </div>
        </div>

        <nav className="ad-nav">
          {sidebarItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`ad-nav-item ${item.active ? 'is-active' : ''}`}
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="ad-sidebar-footer">
          <button type="button" className="ad-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            {Icons.settings}
            <span>Account Settings</span>
          </button>
          <button type="button" className="ad-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            {Icons.logout}
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <section className="ad-main">
        <header className="ad-topbar">
          <label className="ad-search">
            <span>⌕</span>
            <input type="text" placeholder="Search complaints..." aria-label="Search complaints" />
          </label>

          <div className="ad-user">
            <div>
              <strong>Admin</strong>
              <p>ADMINISTRATOR</p>
            </div>
            <span>AD</span>
          </div>
        </header>

        <section className="ad-hero-row">
          <div>
            <h1>Community Complaint Queue</h1>
            <p>Managing community wellness and reported environmental incidents.</p>
          </div>
        </section>

        <div className="filters-section" style={{ margin: '20px 0' }}>
          <div className="filter-group type-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
            {filterCategories.map((cat, idx) => (
              <button key={idx} className={`pill ${cat.active ? 'active-pill' : 'light-pill'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          <div className="filter-divider" style={{ height: '1px', background: 'rgba(0,0,0,0.06)', margin: '12px 0' }}></div>

          <div className="filter-group zone-filters" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {filterZones.map(zone => (
              <button key={zone} className="pill light-pill">{zone}</button>
            ))}
          </div>
        </div>

        <div className="info-banner" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', color: '#475569' }}>
           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg> Comprehensive tracking and administrative oversight for all neighborhood concerns.
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
              {complaintsData.map((row, idx) => (
                <tr key={idx}>
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
                    <span className={`cat-pill cat-${row.catTone}`}>{row.category}</span>
                  </td>
                  <td>
                    <span className={`status-pill stat-${row.statusTone}`}>{row.status}</span>
                  </td>
                  <td className={`prio-score prio-${row.prioTone}`}>{row.priority}</td>
                  <td>
                    <div className="subject-cell">
                      {row.subject} 
                      <svg className="eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-resolve">Resolve</button>
                      <button className="btn-map">
                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button className="page-btn">{'<'}</button>
            <button className="page-btn active">1</button>
            <button className="page-btn">2</button>
            <button className="page-btn">{'>'}</button>
          </div>
        </div>
      </section>
    </main>
  );
}