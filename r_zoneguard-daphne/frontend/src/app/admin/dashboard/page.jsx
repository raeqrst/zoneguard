'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import './style.css';

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
  { label: 'Tenant Management', href: '/admin/tenant_management', icon: Icons.tenant }
];

const EXACT_CATEGORY_MAP = {
  'SPORTS':           { label: 'Sport',            color: '#FFBAE0' },
  'SPORT':            { label: 'Sport',            color: '#FFBAE0' },
  'PUBLIC RELATIONS': { label: 'Public Relations', color: '#BAE3F5' },
  'BEAUTIFICATION':   { label: 'Beautification',   color: '#B6A7C8' },
  'FINANCIAL':        { label: 'Financial',        color: '#FBBF24' },
  'GRIEVANCES':       { label: 'Grievance',        color: '#FFDAD6' },
  'GRIEVANCE':        { label: 'Grievance',        color: '#FFDAD6' },
  'INFRASTRUCTURE':   { label: 'Infrastructure',   color: '#BAF5CA' }
};

function MetricCard({ icon, label, value, detail, tone }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      <div className="stat-icon-wrapper">{icon}</div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <span className="stat-value">{value}</span>
        <span className="stat-detail">{detail}</span>
      </div>
    </div>
  );
}

function PieChartCard({ issueCategories = [] }) {
  if (!issueCategories || issueCategories.length === 0) return null;

  const mappedCategories = issueCategories.map((item) => {
    const rawKey = (item.label || item.complaintCategory || '').toUpperCase().trim();
    const config = EXACT_CATEGORY_MAP[rawKey] || {
      label: item.label || item.complaintCategory || 'Other',
      color: item.color || '#cccccc'
    };
    return { ...item, ...config, value: item.value || 0 };
  });

  const total = mappedCategories.reduce((acc, curr) => acc + curr.value, 0);
  let cumulative = 0;
  const radius = 25;

  const slices = mappedCategories.map((item) => {
    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    const dashArray = `${(item.value / total) * 157} 157`; 
    const dashOffset = -((cumulative / total) * 157);
    cumulative += item.value;
    return { ...item, percentage, dashArray, dashOffset };
  });

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div>
          <h2>Issue Categorization</h2>
          <p>Monthly volume of recorded complaints by category classification.</p>
        </div>
        <Link 
          href="/admin/analytics" 
          className="ad-engine-badge" 
          style={{ textDecoration: 'none', cursor: 'pointer' }}
        >
          R Analytics
        </Link>
      </div>

      <div className="ad-pie-layout" style={{ display: 'flex', alignItems: 'center', gap: '28px', marginTop: '16px' }}>
        <div style={{ position: 'relative', width: '200px', height: '200px', flexShrink: 0 }}>
          <svg width="200" height="200" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {slices.map((item, i) => (
              <circle
                key={item.label || i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="22"
                strokeDasharray={item.dashArray}
                strokeDashoffset={item.dashOffset}
                style={{ cursor: 'pointer' }}
              >
                <title>{`Total ${item.label} complaints recorded this month: ${item.value} (${item.percentage}%)`}</title>
              </circle>
            ))}
          </svg>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            <span style={{ fontSize: '0.7rem', color: '#888', display: 'block', lineHeight: '1' }}>Total</span>
            <strong style={{ fontSize: '1.25rem', color: '#111', fontWeight: '700' }}>{total}</strong>
          </div>
        </div>

        <div className="ad-pie-legend" style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1, minWidth: '220px' }}>
          {slices.map((item, i) => (
            <div 
              key={item.label || i} 
              className="ad-legend-row"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: '12px', 
                cursor: 'pointer',
                padding: '4px 6px',
                borderRadius: '4px'
              }}
              title={`Total ${item.label} complaints recorded this month: ${item.value} (${item.percentage}%)`}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span 
                  className="ad-legend-swatch" 
                  style={{ backgroundColor: item.color, width: '10px', height: '10px', borderRadius: '2px', flexShrink: 0 }} 
                />
                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.label}
                </span>
              </div>
              <span style={{ fontSize: '0.82rem', color: '#666', flexShrink: 0, fontWeight: '600' }}>
                {item.value} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function PaidOverviewCard({ paidOverview = [] }) {
  if (!paidOverview || paidOverview.length === 0) return null;

  const maxValue = Math.max(...paidOverview.map((item) => item.value || 0));

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div>
          <h2>Paid Overview</h2>
          <p>Number of residents who completed payments per month.</p>
        </div>
        <Link href="/admin/analytics#paid-overview" className="ad-engine-badge" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          R Analytics
        </Link>
      </div>

      <div className="ad-overview-bars" aria-label="Paid residents by month">
        {paidOverview.map((item, i) => (
          <div 
            key={item.month || i} 
            className="ad-overview-row" 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
            title={`${item.month}: ${item.value || 0} completed payments`}
          >
            <span className="ad-overview-label" style={{ width: '40px', flexShrink: 0, fontWeight: '500', fontSize: '0.85rem' }}>
              {item.month}
            </span>
            <div className="ad-overview-track" style={{ flexGrow: 1 }}>
              <div
                className="ad-overview-fill"
                style={{ width: maxValue > 0 ? `${((item.value || 0) / maxValue) * 100}%` : '0%' }}
              />
            </div>
            <span style={{ width: '30px', fontSize: '0.85rem', color: '#666', textAlign: 'right' }}>
              {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TurnoverCard({ turnoverData = [] }) {
  if (!turnoverData || turnoverData.length === 0) return null;

  const maxValue = Math.max(...turnoverData.map((item) => Math.max(item.moveIn || 0, item.moveOut || 0)));

  return (
    <div className="dashboard-card full-width-card">
      <div className="card-header-row">
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
        {turnoverData.map((item, i) => (
          <div key={item.month || i} className="ad-bar-group">
            <div className="ad-bar-stack">
              <div 
                className="ad-bar movein" 
                style={{ height: maxValue > 0 ? `${((item.moveIn || 0) / maxValue) * 100}%` : '0%', cursor: 'pointer' }} 
                title={`${item.month} - Move In: ${item.moveIn || 0} tenants`}
              />
              <div 
                className="ad-bar moveout" 
                style={{ height: maxValue > 0 ? `${((item.moveOut || 0) / maxValue) * 100}%` : '0%', cursor: 'pointer' }} 
                title={`${item.month} - Move Out: ${item.moveOut || 0} tenants`}
              />
            </div>
            <span>{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState([]);
  const [issueCategories, setIssueCategories] = useState([]);
  const [paidOverview, setPaidOverview] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const token = localStorage.getItem('token'); 

        const res = await fetch("http://localhost:5000/api/dashboard", {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        });

        const raw = await res.json();
        const data = raw.data || raw;

        setIssueCategories(data.issueCategorization || data.issueCategories || []);
        setPaidOverview(data.paidOverview || data.complaintOverview || []);
        setTurnoverData(data.tenantTurnover || data.turnover || data.turnoverRate || data.tenant_turnover || []);

        if (data.metrics && Array.isArray(data.metrics)) {
          setMetrics(data.metrics);
        } else {
          setMetrics([
            { icon: Icons.tenant, label: 'Pending Tenants', value: data.pendingTenants ?? 0, detail: 'Awaiting approval', tone: 'amber' },
            { icon: Icons.complaints, label: 'Open Complaints', value: data.openComplaints ?? 0, detail: 'Requires action', tone: 'rose' },
            { icon: Icons.analytics, label: 'Collection Rate', value: `${data.collectionRate ?? 0}%`, detail: 'Verified payments', tone: 'emerald' },
            { icon: Icons.dashboard, label: 'Avg Resolution', value: data.avgResolution || '0 days', detail: 'Turnaround time', tone: 'indigo' },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    loadDashboard();
  }, []);

  return (
    <>
      <main className="ad-shell" style={{ height: '100vh', overflowY: 'auto' }}>
        <aside className="ad-sidebar">
          <div className="ad-brand">
            <div className="ad-brand-mark">ZG</div>
            <div>
              <strong>ZoneGuard</strong>
              <p>NIA VILLAGE SUBD.</p>
            </div>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-filter">Filter</button>
            <button type="button" className="btn-report">Generate Report</button>
          </div>
        </aside>

        <section className="ad-main" style={{ overflowY: 'visible', paddingBottom: '40px' }}>
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
            {metrics && metrics.length > 0 && metrics.map((metric, i) => (
              <MetricCard key={metric.label || i} {...metric} />
            ))}
          </section>

          <section className="ad-analytics-grid">
            <PieChartCard issueCategories={issueCategories} />
            <PaidOverviewCard paidOverview={paidOverview} />
          </section>

          <section className="ad-turnover-row">
            <TurnoverCard turnoverData={turnoverData} />
          </section>
        </section>
      </main>
    </>
  );
}