'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './style.css';

// Exact same icons for consistency
const Icons = {
  dashboard: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  analytics: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  map: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>,
  complaints: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  residents: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  tenant: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  settings: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  logout: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', active: true, icon: Icons.dashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Icons.analytics },
  { label: 'Map', href: '#', icon: Icons.map },
  { label: 'Complaints', href: '/admin/complaints', icon: Icons.complaints },
  { label: 'Residents', href: '/admin/residents', icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant_management', icon: Icons.tenant },
];

function MetricCard({ icon, label, value, detail, tone }) {
  return (
    <article className={`ad-metric-card tone-${tone}`}>
      <div className="ad-metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

// Added issueCategories as a prop so it receives data from the main page
function PieChartCard({ issueCategories = [] }) {
  // Prevent crash while data is loading
  if (!issueCategories || issueCategories.length === 0) return null;

  const total = issueCategories.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  const gradients = issueCategories
    .map((item) => {
      const start = cumulative;
      cumulative += item.value;
      return `${item.color} ${((start / total) * 100).toFixed(2)}% ${((cumulative / total) * 100).toFixed(2)}%`;
    })
    .join(', ');

  return (
    <article className="ad-card ad-pie-card">
      <div className="ad-card-header">
        <div>
          <h2>Issue Categorization</h2>
          <p>Monthly volume of recorded complaints by category classification.</p>
        </div>
        <Link href="/admin/analytics#issue-categorization" className="ad-engine-badge" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          R Analytics
        </Link>
      </div>

      <div className="ad-pie-layout">
        <div className="ad-pie-chart" style={{ background: `conic-gradient(${gradients})` }} aria-label="Issue categorization pie chart" />
        <div className="ad-pie-legend">
          {issueCategories.map((item) => (
            <div key={item.label} className="ad-legend-row">
              <span className="ad-legend-swatch" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

// Added complaintOverview as a prop
function ComplaintsOverviewCard({ complaintOverview = [] }) {
  // Prevent crash while data is loading
  if (!complaintOverview || complaintOverview.length === 0) return null;

  const maxValue = Math.max(...complaintOverview.map((item) => item.value));

  return (
    <article className="ad-card ad-overview-card">
      <div className="ad-card-header">
        <div>
          <h2>Complaints Overview</h2>
          <p>Monthly volume complaints by zone classification.</p>
        </div>
        <Link href="/admin/analytics#complaints-overview" className="ad-engine-badge" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          R Analytics
        </Link>
      </div>

      <div className="ad-overview-bars" aria-label="Complaints by zone">
        {complaintOverview.map((item) => (
          <div key={item.zone} className="ad-overview-row">
            <span className="ad-overview-label">{item.zone}</span>
            <div className="ad-overview-track">
              <div
                className="ad-overview-fill"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  );
}

// Added turnoverData as a prop
function TurnoverCard({ turnoverData = [] }) {
  // Prevent crash while data is loading
  if (!turnoverData || turnoverData.length === 0) return null;

  const maxValue = Math.max(...turnoverData.map((item) => Math.max(item.moveIn, item.moveOut)));

  return (
    <article className="ad-card ad-turnover-card">
      <div className="ad-card-header">
        <div>
          <h2>Tenant Turnover Rate</h2>
          <p>Total moves per month</p>
        </div>
      </div>

      <div className="ad-turnover-legend">
        <span><i className="legend movein" /> Move In</span>
        <span><i className="legend moveout" /> Move Out</span>
      </div>

      <div className="ad-bar-chart" aria-label="Tenant turnover bar chart">
        {turnoverData.map((item) => (
          <div key={item.month} className="ad-bar-group">
            <div className="ad-bar-stack">
              <div className="ad-bar movein" style={{ height: `${(item.moveIn / maxValue) * 100}%` }} />
              <div className="ad-bar moveout" style={{ height: `${(item.moveOut / maxValue) * 100}%` }} />
            </div>
            <span>{item.month}</span>
          </div>
        ))}
      </div>
    </article>
  );
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState([]);
  const [issueCategories, setIssueCategories] = useState([]);
  const [complaintOverview, setComplaintOverview] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard");
        const data = await res.json();
        
        // Use fallbacks to prevent undefined errors if the database misses a key
        setMetrics(data.metrics || []);
        setIssueCategories(data.issueCategories || []);
        setComplaintOverview(data.complaintOverview || []);
        setTurnoverData(data.turnover || []);
      } catch (err) {
        console.log(err);
      }
    }
    
    loadDashboard();
  }, []);

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
            <input type="text" placeholder="Search dashboard..." aria-label="Search dashboard" />
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
            <h1>Admin Dashboard</h1>
            <p>Operational overview for approvals, complaints, payments, and resident activity.</p>
          </div>
          
          <div className="ad-actions">
            <button type="button" className="ad-secondary-button">Filter</button>
            <button type="button" className="ad-primary-button">Generate Report</button>
          </div>
        </section>

        <section className="ad-metrics-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="ad-analytics-grid">
          {/* Passing the fetched states down as props to the components */}
          <PieChartCard issueCategories={issueCategories} />
          <ComplaintsOverviewCard complaintOverview={complaintOverview} />
        </section>

        <section className="ad-turnover-row">
          <TurnoverCard turnoverData={turnoverData} />
        </section>

      </section>
    </main>
  );
}