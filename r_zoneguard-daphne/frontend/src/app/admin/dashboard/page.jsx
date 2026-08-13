'use client';

import Link from 'next/link';
<<<<<<< HEAD
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './style.css';

const Icons = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  analytics: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  complaints: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  tenant: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  refresh: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
};

const EXACT_CATEGORY_MAP = {
  'SPORTS':           { label: 'Sport',            color: '#FFBAE0' },
  'SPORT':            { label: 'Sport',            color: '#FFBAE0' },
  'PUBLIC RELATIONS': { label: 'Public Relations', color: '#BAE3F5' },
  'PUBLIC_RELATIONS': { label: 'Public Relations', color: '#BAE3F5' },
  'BEAUTIFICATION':   { label: 'Beautification',   color: '#B6A7C8' },
  'FINANCIAL':        { label: 'Financial',        color: '#FBBF24' },
  'GRIEVANCES':       { label: 'Grievance',        color: '#FFDAD6' },
  'GRIEVANCE':        { label: 'Grievance',        color: '#FFDAD6' },
  'INFRASTRUCTURE':   { label: 'Infrastructure',   color: '#BAF5CA' }
};

function MetricCard({ icon, label, value, detail }) {
  return (
    <article className="stat-card">
      <div className="stat-icon-wrapper">
        {icon}
      </div>
      <div className="stat-info">
        <span className="stat-label">{label}</span>
        <strong className="stat-value">{value}</strong>
        <span className="stat-detail">{detail}</span>
      </div>
    </article>
=======
import { useEffect, useState } from 'react';
import './style.css';

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
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  );
}

function PieChartCard({ issueCategories = [] }) {
  if (!issueCategories || issueCategories.length === 0) return null;

<<<<<<< HEAD
  const mappedCategories = issueCategories.map((item) => {
    const rawKey = (item.label || item.complaintCategory || '').toUpperCase().trim();
    const config = EXACT_CATEGORY_MAP[rawKey] || {
      label: item.label || item.complaintCategory || 'Other',
      color: item.color || '#cccccc'
    };
    return {
      label: config.label,
      value: item.value || 0,
      color: config.color
    };
  });

  const total = mappedCategories.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  const slices = mappedCategories.map((item) => {
    const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
    const proportion = total > 0 ? item.value / total : 0;
    const dashLength = proportion * circumference;
    const dashOffset = -accumulatedOffset;
    accumulatedOffset += dashLength;

    return {
      ...item,
      percentage,
      dashArray: `${dashLength} ${circumference - dashLength}`,
      dashOffset
    };
  });

  return (
    <article className="dashboard-card">
=======
  const total = issueCategories.reduce((sum, item) => sum + item.value, 0);
  let cumulative = 0;

  const gradients = issueCategories
    .map((item) => {
      const start = cumulative;
      cumulative += item.value;
      return `${item.color} ${((start / total) * 100).toFixed(2)}\%${((cumulative / total) * 100).toFixed(2)}%`;
    })
    .join(', ');

  return (
    <div className="dashboard-card">
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      <div className="card-header-row">
        <div>
          <h2>Issue Categorization</h2>
          <p>Monthly volume of recorded complaints by category classification.</p>
        </div>
<<<<<<< HEAD
        <Link href="/admin/analytics" className="engine-pill">
=======
        <Link href="/admin/analytics#issue-categorization" className="engine-pill">
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
          R Analytics
        </Link>
      </div>

<<<<<<< HEAD
      <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginTop: '16px' }}>
        <div style={{ position: 'relative', width: '160px', height: '160px', flexShrink: 0 }}>
          <svg width="160" height="160" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', overflow: 'visible' }}>
            {slices.map((item, i) => (
              <circle
                key={item.label || i}
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth="20"
                strokeDasharray={item.dashArray}
                strokeDashoffset={item.dashOffset}
              >
                <title>{`Total ${item.label} complaints recorded this month: ${item.value} (${item.percentage}%)`}</title>
              </circle>
            ))}
          </svg>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none' }}>
            <span style={{ fontSize: '0.65rem', color: '#888', display: 'block', lineHeight: '1' }}>Total</span>
            <strong style={{ fontSize: '1.1rem', color: '#111', fontWeight: '700' }}>{total}</strong>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}>
          {slices.map((item, i) => (
            <div key={item.label || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: item.color, width: '10px', height: '10px', borderRadius: '2px', flexShrink: 0 }} />
                <span style={{ fontSize: '0.8rem', fontWeight: '500', color: '#374151' }}>{item.label}</span>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#6b7280', fontWeight: '600' }}>{item.value} ({item.percentage}%)</span>
=======
      <div className="ad-pie-layout">
        <div className="ad-pie-chart" style={{ background: `conic-gradient(${gradients})` }} />
        <div className="ad-pie-legend">
          {issueCategories.map((item) => (
            <div key={item.label} className="ad-legend-row">
              <span className="ad-legend-swatch" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            </div>
          ))}
        </div>
      </div>
<<<<<<< HEAD
    </article>
  );
}

function PaidOverviewCard({ paidOverview = [] }) {
  if (!paidOverview || paidOverview.length === 0) return null;
  const maxValue = Math.max(...paidOverview.map((item) => item.value || 0));

  return (
    <article className="dashboard-card">
      <div className="card-header-row">
        <div>
          <h2>Paid Overview</h2>
          <p>Number of residents who completed payments per month.</p>
        </div>
        <Link href="/admin/analytics#paid-overview" className="engine-pill">
=======
    </div>
  );
}

function ComplaintsOverviewCard({ complaintOverview = [] }) {
  if (!complaintOverview || complaintOverview.length === 0) return null;

  const maxValue = Math.max(...complaintOverview.map((item) => item.value));

  return (
    <div className="dashboard-card">
      <div className="card-header-row">
        <div>
          <h2>Complaints Overview</h2>
          <p>Monthly volume complaints by zone classification.</p>
        </div>
        <Link href="/admin/analytics#complaints-overview" className="engine-pill">
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
          R Analytics
        </Link>
      </div>

<<<<<<< HEAD
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '16px' }}>
        {paidOverview.map((item, i) => (
          <div key={item.month || i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '36px', flexShrink: 0, fontWeight: '500', fontSize: '0.8rem', color: '#4b5563' }}>{item.month}</span>
            <div style={{ flexGrow: 1, height: '8px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: '#10b981', width: maxValue > 0 ? `${((item.value || 0) / maxValue) * 100}%` : '0%' }} />
            </div>
            <span style={{ width: '24px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'right' }}>{item.value}</span>
          </div>
        ))}
      </div>
    </article>
=======
      <div className="ad-overview-bars">
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
    </div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  );
}

function TurnoverCard({ turnoverData = [] }) {
  if (!turnoverData || turnoverData.length === 0) return null;

<<<<<<< HEAD
  const chartMax = 30;
  const yAxisSteps = [30, 25, 20, 15, 10, 5, 0];

  return (
    <article className="dashboard-card" style={{ marginTop: '20px' }}>
      <div className="card-header-row" style={{ marginBottom: '16px' }}>
        <div>
          <h2 style={{ color: '#064e3b', fontSize: '1.4rem' }}>Tenant Turnover Rate</h2>
=======
  const maxValue = Math.max(...turnoverData.map((item) => Math.max(item.moveIn, item.moveOut)));

  return (
    <div className="dashboard-card full-width-card">
      <div className="card-header-row">
        <div>
          <h2>Tenant Turnover Rate</h2>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
          <p>Total moves per month</p>
        </div>
      </div>

<<<<<<< HEAD
      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', marginBottom: '16px', fontSize: '0.8rem', color: '#4b5563', fontWeight: '500' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i style={{ width: '10px', height: '10px', background: '#4285F4', borderRadius: '50%' }} /> Move In
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i style={{ width: '10px', height: '10px', background: '#B48EED', borderRadius: '50%' }} /> Move Out
        </span>
      </div>

      <div style={{ position: 'relative', height: '280px', marginLeft: '32px', marginTop: '16px' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          {yAxisSteps.map((step, i) => (
            <div key={i} style={{ position: 'relative', width: '100%', borderBottom: step === 0 ? '2px solid #e5e7eb' : '1px solid #f3f4f6', height: 0 }}>
              <span style={{ position: 'absolute', left: '-32px', top: '-7px', fontSize: '0.75rem', color: '#6b7280', width: '24px', textAlign: 'right' }}>
                {step}
              </span>
            </div>
          ))}
        </div>

        <div style={{ position: 'absolute', top: 0, left: '12px', right: 0, bottom: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          {turnoverData.map((item, i) => (
            <div key={item.month || i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, height: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: '4px', width: '100%', height: 'calc(100% - 24px)', paddingBottom: '2px' }}>
                <div 
                  style={{ 
                    width: '40%', 
                    maxWidth: '18px', 
                    background: '#4285F4', 
                    height: `${Math.min(100, ((item.moveIn || 0) / chartMax) * 100)}%`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} 
                  title={`Move In: ${item.moveIn || 0}`} 
                />
                <div 
                  style={{ 
                    width: '40%', 
                    maxWidth: '18px', 
                    background: '#B48EED', 
                    height: `${Math.min(100, ((item.moveOut || 0) / chartMax) * 100)}%`,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.3s ease'
                  }} 
                  title={`Move Out: ${item.moveOut || 0}`} 
                />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginTop: '8px', height: '16px' }}>{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q')?.toLowerCase() || '';

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
            { icon: Icons.tenant, label: 'Pending Tenants', value: data.pendingTenants ?? 0, detail: 'Awaiting approval' },
            { icon: Icons.complaints, label: 'Open Complaints', value: data.openComplaints ?? 0, detail: 'Requires action' },
            { icon: Icons.analytics, label: 'Collection Rate', value: `${data.collectionRate ?? 0}%`, detail: 'Verified payments' },
            { icon: Icons.dashboard, label: 'Avg Resolution', value: data.avgResolution || '0 days', detail: 'Turnaround time' },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      }
    }

    loadDashboard();
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const displayedMetrics = metrics.filter(metric => 
    searchQuery === '' || 
    (metric.label && metric.label.toLowerCase().includes(searchQuery)) ||
    (metric.detail && metric.detail.toLowerCase().includes(searchQuery)) ||
    (String(metric.value).toLowerCase().includes(searchQuery))
  );

  const matchesIssueCard = searchQuery === '' || 'issue categorization complaints complaint'.includes(searchQuery);
  const filteredIssueCategories = issueCategories.filter(item => 
    matchesIssueCard || (item.label || item.complaintCategory || '').toLowerCase().includes(searchQuery)
  );
  const showIssueCard = matchesIssueCard || filteredIssueCategories.length > 0;

  const matchesPaidCard = searchQuery === '' || 'paid overview payment residents collection'.includes(searchQuery);
  const filteredPaidOverview = paidOverview.filter(item => 
    matchesPaidCard || (item.month || '').toLowerCase().includes(searchQuery) || String(item.value).includes(searchQuery)
  );
  const showPaidCard = matchesPaidCard || filteredPaidOverview.length > 0;

  const matchesTurnoverCard = searchQuery === '' || 'tenant turnover rate move in move out moves'.includes(searchQuery);
  const filteredTurnoverData = turnoverData.filter(item => 
    matchesTurnoverCard || (item.month || '').toLowerCase().includes(searchQuery)
  );
  const showTurnoverCard = matchesTurnoverCard || filteredTurnoverData.length > 0;

  return (
    <div style={{ paddingBottom: '40px' }}>
      <section className="page-header-container">
=======
      <div className="ad-turnover-legend">
        <span><i className="legend movein" /> Move In</span>
        <span><i className="legend moveout" /> Move Out</span>
      </div>

      <div className="ad-bar-chart">
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
    </div>
  );
}

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState([]);
  const [issueCategories, setIssueCategories] = useState([]);
  const [complaintOverview, setComplaintOverview] = useState([]);
  const [turnoverData, setTurnoverData] = useState([]);

  // RESTORED BACKEND CONNECTION
  useEffect(() => {
    async function loadDashboard() {
      try {
        const res = await fetch("http://localhost:5000/api/dashboard");
        const data = await res.json();
        
        setMetrics(data.metrics || []);
        setIssueCategories(data.issueCategories || []);
        setComplaintOverview(data.complaintOverview || []);
        setTurnoverData(data.turnover || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    }
    
    loadDashboard();
  }, []);

  return (
    <>
      <div className="page-header-container">
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        <div className="page-title-section">
          <h1>Admin Dashboard</h1>
          <p>Operational overview for approvals, complaints, payments, and resident activity.</p>
        </div>

        <div className="action-buttons">
<<<<<<< HEAD
          <button 
            type="button" 
            className="btn-report" 
            onClick={handleRefresh} 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            {Icons.refresh}
            Refresh Data
          </button>
        </div>
      </section>

      {displayedMetrics.length > 0 && (
        <section className="stats-cards">
          {displayedMetrics.map((metric, i) => (
            <MetricCard key={metric.label || i} {...metric} />
          ))}
        </section>
      )}

      {(showIssueCard || showPaidCard) && (
        <section className="dashboard-grid">
          {showIssueCard && <PieChartCard issueCategories={filteredIssueCategories} />}
          {showPaidCard && <PaidOverviewCard paidOverview={filteredPaidOverview} />}
        </section>
      )}

      {showTurnoverCard && (
        <section>
          <TurnoverCard turnoverData={filteredTurnoverData} />
        </section>
      )}

      {displayedMetrics.length === 0 && !showIssueCard && !showPaidCard && !showTurnoverCard && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6b7280' }}>
          <h3>No results found for "{searchQuery}"</h3>
          <p style={{ fontSize: '0.85rem', marginTop: '6px' }}>Try searching for another keyword like "tenant", "complaints", or a specific month.</p>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <DashboardContent />
    </Suspense>
=======
          <button type="button" className="btn-filter">Filter</button>
          <button type="button" className="btn-report">Generate Report</button>
        </div>
      </div>

      {/* DYNAMIC METRICS FROM BACKEND */}
      <section className="stats-cards">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      {/* DYNAMIC CHARTS FROM BACKEND */}
      <div className="dashboard-grid">
        <PieChartCard issueCategories={issueCategories} />
        <ComplaintsOverviewCard complaintOverview={complaintOverview} />
      </div>

      {/* DYNAMIC TURNOVER BAR CHART */}
      <div className="turnover-row">
        <TurnoverCard turnoverData={turnoverData} />
      </div>
    </>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  );
}