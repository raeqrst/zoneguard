"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import './style.css';

const sidebarItems = [
  { 
    label: 'Dashboard', 
    href: '/admin/dashboard',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  },
  { 
    label: 'Analytics', 
    href: '/admin/analytics', 
    active: true,
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>
  },
  { 
    label: 'Map', 
    href: '#',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon><line x1="8" y1="2" x2="8" y2="18"></line><line x1="16" y1="6" x2="16" y2="22"></line></svg>
  },
  { 
    label: 'Complaints', 
    href: '/admin/complaints',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  },
  { 
    label: 'Residents', 
    href: '/admin/residents',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
  },
  { 
    label: 'Tenant Management', 
    href: '#',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  },
];

function MetricCard({ icon, label, value, detail, tone }) {
  return (
    <article className={`aa-metric-card tone-${tone}`}>
      <div className="aa-metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

function StatusPill({ tone, children }) {
  return <span className={`aa-status-pill tone-${tone}`}>{children}</span>;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  
  const [operationalRows, setOperationalRows] = useState([
    { category: 'Infrastructure', status: 'Stable', metric: '4.2 Hours', insight: 'Predicted spike in 3 days', statusTone: 'green' },
    { category: 'Monthly Dues', status: 'At-Risk', metric: '81.7% Paid', insight: 'High probability of delinquency', statusTone: 'red' },
    { category: 'Security', status: 'Optimal', metric: '15 Minutes', insight: 'Decreasing trend', statusTone: 'green' },
  ]);

  const [forecast, setForecast] = useState({
    historical: [22, 28, 31],
    projected: [35],
    labels: ["May", "Jun", "Jul", "Aug (F)"]
  });

  const [finForecast, setFinForecast] = useState({
    historical: [21500, 23200, 22000, 26500, 27600],
    projected: [28100, 26500, 29000],
    labels: ["MAR", "APR", "MAY", "JUN", "JUL (cur.)", "AUG (F)", "SEP (F)", "OCT (F)"]
  });

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics')
      .then((res) => res.json())
      .then((data) => {
        setAnalytics(data);
        if (data && data.operational_status) {
          setOperationalRows(data.operational_status);
        }
      })
      .catch((err) => console.error("Error fetching analytics:", err));

    fetch('http://localhost:5000/api/forecast')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.historical) setForecast(data);
      })
      .catch((err) => console.log("Using default complaint forecast dataset."));

    fetch('http://localhost:5000/api/financial-forecast')
      .then((res) => res.json())
      .then((data) => {
        if (data && data.historical) setFinForecast(data);
      })
      .catch((err) => console.log("Using default financial forecast dataset."));
  }, []);

  const totalHouseholdsCount = analytics?.summary_stats?.total_resolved ?? '169';

  const generatePoints = (dataArray, startIndex = 0, totalPoints = 8) => {
    if (!dataArray || dataArray.length === 0) return "";
    const maxVal = Math.ceil(Math.max(...(forecast?.historical || []), ...(forecast?.projected || []), 40) / 10) * 10;
    const minVal = 0;
    const range = maxVal - minVal || 1;
    
    return dataArray.map((val, index) => {
      const actualIndex = startIndex + index;
      const x = 50 + (actualIndex * (460 / Math.max(totalPoints - 1, 1)));
      const y = 220 - ((val - minVal) / range) * 160;
      return `${x},${y}`;
    }).join(" ");
  };

  const histData = forecast?.historical || [];
  const projData = forecast?.projected || [];
  const combinedProj = histData.length > 0 ? [histData[histData.length - 1], ...projData] : [];
  const totalSteps = (forecast?.labels?.length) || (histData.length + projData.length);

  const historicalPoints = generatePoints(histData, 0, totalSteps);
  const projectedPoints = generatePoints(combinedProj, histData.length - 1, totalSteps);
  const labels = forecast?.labels || [];

  const finHistData = finForecast?.historical || [];
  const finProjData = finForecast?.projected || [];
  const finCombinedProj = finHistData.length > 0 ? [finHistData[finHistData.length - 1], ...finProjData] : [];
  const finTotalSteps = (finForecast?.labels?.length) || (finHistData.length + finProjData.length);
  const finAllVals = [...finHistData, ...finProjData];

  const finMaxVal = Math.ceil(Math.max(...finAllVals, 30000) / 2000) * 2000;
  const finMinVal = Math.floor(Math.max(0, Math.min(...finAllVals, 15000) - 2000) / 2000) * 2000;
  const finRange = finMaxVal - finMinVal || 1;

  const generateFinPoints = (dataArray, startIndex = 0) => {
    if (!dataArray || dataArray.length === 0) return "";
    return dataArray.map((val, index) => {
      const actualIndex = startIndex + index;
      const x = 50 + actualIndex * (530 / Math.max(finTotalSteps - 1, 1)); 
      const y = 190 - ((val - finMinVal) / finRange) * 150; 
      return `${x},${y}`;
    }).join(" ");
  };

  const finHistoricalPoints = generateFinPoints(finHistData, 0);
  const finProjectedPoints = generateFinPoints(finCombinedProj, Math.max(0, finHistData.length - 1));

  const barData = finHistData.slice(-5); 
  const barLabels = (finForecast?.labels?.slice(0, finHistData.length) || []).slice(-5);
  const maxBarVal = Math.max(...barData, 10000); 

  const currentRev = finHistData[finHistData.length - 1] || 0;
  const prevRev = finHistData[finHistData.length - 2] || 0;
  let revChangePct = 0;
  
  if (prevRev > 0) {
    revChangePct = (((currentRev - prevRev) / prevRev) * 100).toFixed(1);
  }
  
  const isRevPositive = revChangePct >= 0;
  const formattedCurrentRev = `₱${(currentRev / 1000).toFixed(1)}k`;

  const parsedTotalHouseholds = parseInt(totalHouseholdsCount) || 169;
  const duesPerHousehold = 200;
  const expectedRevenue = parsedTotalHouseholds * duesPerHousehold;
  const collectedRev = currentRev;
  const outstandingRev = Math.max(0, expectedRevenue - collectedRev);

  const collectedPct = ((collectedRev / expectedRevenue) * 100).toFixed(1);
  const outstandingPct = ((outstandingRev / expectedRevenue) * 100).toFixed(1);

  const paidUnits = Math.floor(collectedRev / duesPerHousehold);
  const unpaidUnits = Math.max(0, parsedTotalHouseholds - paidUnits);
  
  const pendingUnits = Math.ceil(unpaidUnits * 0.67);
  const overdueUnits = unpaidUnits - pendingUnits;

  const paidUnitsPct = ((paidUnits / parsedTotalHouseholds) * 100).toFixed(1);
  const pendingUnitsPct = ((pendingUnits / parsedTotalHouseholds) * 100).toFixed(1);
  const overdueUnitsPct = ((overdueUnits / parsedTotalHouseholds) * 100).toFixed(1);

  const circ = 251.2; 
  const paidDash = (paidUnits / parsedTotalHouseholds) * circ;
  const overdueDash = (overdueUnits / parsedTotalHouseholds) * circ;
  const paidAngle = -90;
  const overdueAngle = -90 + ((paidUnits / parsedTotalHouseholds) * 360);

  const nextMonthProjRev = finProjData[0] || currentRev;
  const revTrendMultiplier = currentRev > 0 ? (currentRev / nextMonthProjRev) : 1; 
  const dynamicRiskIndex = Math.min(100, (parseFloat(outstandingPct) * revTrendMultiplier)).toFixed(1);

  const avgHistoricalComplaints = histData.length ? (histData.reduce((a, b) => a + b, 0) / histData.length) : 20;
  const nextMonthComplaints = projData[0] || avgHistoricalComplaints;
  const complaintLoadFactor = nextMonthComplaints / avgHistoricalComplaints;
  const dynamicResponseTime = (1.2 * complaintLoadFactor).toFixed(1);

  const metrics = [
    { 
      label: 'Total Households', 
      value: String(parsedTotalHouseholds), 
      detail: 'active registered homes', 
      tone: 'green', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> 
    },
    { 
      label: 'Collection Rate', 
      value: `${collectedPct}%`, 
      detail: 'monthly dues paid', 
      tone: 'purple', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg> 
    },
    { 
      label: 'Risk Index', 
      value: `${dynamicRiskIndex}%`, 
      detail: 'likely to default', 
      tone: 'red', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cb5448" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg> 
    },
    { 
      label: 'Avg. Response Time', 
      value: `${dynamicResponseTime} Hrs`, 
      detail: 'mean + forecast trend', 
      tone: 'blue', 
      icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e6f9b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> 
    },
  ];

  return (
    <main className="aa-shell">
      <aside className="aa-sidebar">
        <div className="aa-brand">
          <div className="aa-brand-mark">ZG</div>
          <div>
            <strong>ZoneGuard</strong>
            <p>NIA VILLAGE SUBD.</p>
          </div>
        </div>
        <nav className="aa-nav">
          {sidebarItems.map((item) => (
            <Link key={item.label} href={item.href} className={`aa-nav-item ${item.active ? 'is-active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div className="aa-sidebar-footer">
          <button type="button" className="aa-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            <span>Account Settings</span>
          </button>
          <button type="button" className="aa-nav-item" style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <section className="aa-main">
        <header className="aa-topbar">
          <label className="aa-search">
            <span>⌕</span>
            <input type="text" placeholder="Search here..." aria-label="Search" />
          </label>
          <div className="aa-user">
            <div>
              <strong>Admin</strong>
              <p>ADMINISTRATOR</p>
            </div>
            <span>AD</span>
          </div>
        </header>

        <section className="aa-hero-row">
          <div>
            <h1>Analytics Report</h1>
          </div>
          <div className="aa-actions">
            <button type="button" className="aa-secondary-button">Filter</button>
            <button type="button" className="aa-primary-button">Generate New Report</button>
          </div>
        </section>

        <section className="aa-metrics-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="aa-table-card aa-card">
          <div className="aa-section-heading">
            <div>
              <h2>Zone Operational Status</h2>
              <p>Real-time tracking across key infrastructure and service metrics.</p>
            </div>
          </div>
          <div className="aa-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Metric (Avg. Resolve)</th>
                  <th>R-Driven Insight</th>
                </tr>
              </thead>
              <tbody>
                {operationalRows.map((row) => (
                  <tr key={row.category}>
                    <td>{row.category}</td>
                    <td><StatusPill tone={row.statusTone}>{row.status}</StatusPill></td>
                    <td>{row.metric}</td>
                    <td className="aa-insight">{row.insight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="aa-bottom-grid">
          <article className="aa-card aa-chart-card">
            <div className="aa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>Complaint Forecast</h3>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#555', alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '3px', background: '#4e6f9b', display: 'inline-block', borderRadius: '2px' }}></span> Historical Data
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '0px', borderTop: '3px dashed #67d4c0', display: 'inline-block' }}></span> 30-Day Forecast
                  </span>
                </div>
              </div>
              <span className="aa-engine" style={{ marginTop: '2px' }}>Engine: forecast::auto.arima()</span>
            </div>

            <div className="aa-chart-box" style={{ minHeight: '260px', position: 'relative', marginTop: '16px' }}>
              <svg viewBox="0 0 540 280" role="img" aria-label="Complaint forecast line chart" style={{ width: '100%', height: '100%' }}>
                {(() => {
                  const maxVal = Math.ceil(Math.max(...histData, ...projData, 40) / 10) * 10;
                  const steps = [0.25, 0.5, 0.75, 1.0];
                  
                  return steps.map((pct, idx) => {
                    const yCoord = 220 - (pct * 160);
                    const labelVal = Math.round(pct * maxVal);
                    return (
                      <g key={idx}>
                        <text x="35" y={yCoord} fontSize="11" fill="#888" textAnchor="end" dominantBaseline="middle">{labelVal}</text>
                        <line x1="45" y1={yCoord} x2="510" y2={yCoord} stroke="#eef2f0" strokeWidth="1" />
                      </g>
                    );
                  });
                })()}
                
                <text x="35" y="220" fontSize="11" fill="#888" textAnchor="end" dominantBaseline="middle">0</text>
                <line x1="45" y1="220" x2="510" y2="220" stroke="#eef2f0" strokeWidth="1" />

                <polyline fill="none" stroke="#4e6f9b" strokeWidth="3.5" points={historicalPoints} strokeLinecap="round" strokeLinejoin="round" />
                <polyline fill="none" stroke="#67d4c0" strokeWidth="3.5" strokeDasharray="7,5" points={projectedPoints} strokeLinecap="round" strokeLinejoin="round" />
                
                <g className="x-axis-labels">
                  {labels.map((lbl, idx) => {
                    const x = 50 + (idx * (460 / Math.max(totalSteps - 1, 1)));
                    return (
                      <text key={idx} x={x} y="245" fontSize="11" fill="#666" textAnchor="middle">{lbl}</text>
                    );
                  })}
                </g>
              </svg>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <p className="aa-caption">Complaint Volume Projection (Next 30 Days)</p>
            </div>
            <div className="aa-footer-actions" style={{ marginTop: '16px' }}>
              <button type="button">Preview PDF</button>
              <button type="button">Download PDF</button>
            </div>
          </article>

          <article className="aa-card aa-heatmap-card">
            <div className="aa-card-header">
              <h3>Zone Heatmap</h3>
              <span className="aa-engine">Engine: geom_density2d()</span>
            </div>
            <div className="aa-heatmap-box" aria-hidden="true">
              <div className="aa-heat-glow glow-a" />
              <div className="aa-heat-glow glow-b" />
              <div className="aa-heat-glow glow-c" />
              <div className="aa-map-overlay" />
            </div>
            <p className="aa-caption">Service Demand Hotspots</p>
          </article>
        </section>

        <div className="fm-divider"></div>

        <section className="fm-section">
          <h2 className="fm-title">Financial Monitoring</h2>
          <div className="fm-kpi-grid">
            <article className="fm-card fm-kpi-item">
              <div className="fm-kpi-header">
                <span className="fm-kpi-dots">•••</span>
                <span className="fm-kpi-label">Paid This Month</span>
              </div>
              <div className="fm-kpi-body">
                <div className="fm-icon-box bg-green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <div className="fm-kpi-value">
                  <strong>{paidUnits}</strong>
                  <span className="fm-trend trend-up">{isRevPositive ? '+' : '-'}{Math.abs(revChangePct)}%</span>
                </div>
              </div>
            </article>

            <article className="fm-card fm-kpi-item">
              <div className="fm-kpi-header">
                <span className="fm-kpi-dots">•••</span>
                <span className="fm-kpi-label">Pending</span>
              </div>
              <div className="fm-kpi-body">
                <div className="fm-icon-box bg-purple" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></svg>
                </div>
                <div className="fm-kpi-value">
                  <strong>{pendingUnits}</strong>
                  <span className="fm-trend trend-neutral">Avg. 3 Days</span>
                </div>
              </div>
            </article>

            <article className="fm-card fm-kpi-item">
              <div className="fm-kpi-header">
                <span className="fm-kpi-label centered">Overdue</span>
              </div>
              <div className="fm-kpi-body centered-body">
                <div className="fm-icon-box bg-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <div className="fm-kpi-value">
                  <strong>{overdueUnits}</strong>
                  <span className="fm-trend trend-down">{overdueUnitsPct}% Total</span>
                </div>
              </div>
            </article>

            <article className="fm-card fm-kpi-item fm-kpi-dark">
              <div className="fm-kpi-header">
                <span className="fm-kpi-dots text-white">•••</span>
                <span className="fm-kpi-label text-white">Collection Rate</span>
              </div>
              <div className="fm-kpi-body">
                <div className="fm-icon-box bg-dark-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                </div>
                <div className="fm-kpi-value">
                  <strong className="text-white">{collectedPct}%</strong>
                </div>
              </div>
            </article>
          </div>

          <div className="fm-charts-grid">
            <article className="fm-card fm-chart-card">
              <div className="fm-chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0' }}>Financial Forecasting Projections</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>ARIMA Time-Series Logic (H2 2026 Forecast)</p>
                </div>
                
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#555', alignItems: 'center', marginTop: '6px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '3px', background: '#0e5f43', display: 'inline-block', borderRadius: '2px' }}></span> Historical Data
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '16px', height: '0px', borderTop: '3px dashed #0e5f43', display: 'inline-block' }}></span> ARIMA Forecast
                  </span>
                </div>
              </div>
              
              <div className="fm-line-chart-box" style={{ minHeight: '280px', position: 'relative', marginTop: '16px' }}>
                <svg viewBox="0 0 600 240" role="img" aria-label="Financial forecast line chart" style={{ width: '100%', height: '100%' }}>
                  {(() => {
                    const steps = [0, 0.25, 0.5, 0.75, 1.0];
                    return steps.map((pct, idx) => {
                      const yCoord = 190 - (pct * 150);
                      const labelVal = finMinVal + (pct * finRange);
                      const formattedLabel = `₱${(labelVal / 1000).toFixed(1)}k`; 
                      return (
                        <g key={idx}>
                          <text x="40" y={yCoord} fontSize="11" fill="#888" textAnchor="end" dominantBaseline="middle">{formattedLabel}</text>
                          <line x1="50" y1={yCoord} x2="580" y2={yCoord} stroke="#eef2f0" strokeWidth="1" />
                        </g>
                      );
                    });
                  })()}
                  <polyline fill="none" stroke="#0e5f43" strokeWidth="3.5" points={finHistoricalPoints} strokeLinejoin="round" strokeLinecap="round" />
                  <polyline fill="none" stroke="#0e5f43" strokeWidth="3.5" strokeDasharray="7,5" points={finProjectedPoints} strokeLinejoin="round" strokeLinecap="round" />
                  <g className="fm-x-axis-labels">
                    {finForecast.labels.map((lbl, idx) => {
                      const x = 50 + (idx * (530 / Math.max(finTotalSteps - 1, 1)));
                      return (
                        <text key={idx} x={x} y="220" fontSize="9" fill="#666" textAnchor="middle" fontWeight="500">{lbl}</text>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </article>

            <article className="fm-card fm-bar-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="fm-revenue-header">
                <h4>Monthly Collection Trend</h4>
              </div>
              <div className="fm-chart-header text-center" style={{ marginTop: '4px' }}>
                <h3 className="fm-huge-text" style={{ fontSize: '46px', fontWeight: '800', marginBottom: '4px', color: '#0e5f43' }}>
                  {formattedCurrentRev}
                </h3>
                <span className="fm-trend-bold" style={{ color: isRevPositive ? '#0f7050' : '#cb5448', fontSize: '14px' }}>
                  {isRevPositive ? '↑' : '↓'} {Math.abs(revChangePct)}% VS Last Month
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, minHeight: '180px', marginTop: 'auto', padding: '0 10px' }}>
                {barData.map((val, idx) => {
                  const isLastBar = idx === barData.length - 1;
                  const heightPct = Math.max((val / maxBarVal) * 100, 5); 
                  const label = barLabels[idx] ? barLabels[idx].replace(' (cur.)', '') : '';
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '16%', height: '100%' }}>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', width: '100%', marginBottom: '12px' }}>
                        <div className={`fm-bar ${isLastBar ? 'bg-dark' : 'bg-light'}`} style={{ height: `${heightPct}%`, width: '100%', borderRadius: '6px', transition: 'height 0.4s ease' }} title={`₱${val.toLocaleString()}`}></div>
                      </div>
                      <span style={{ fontSize: '11px', color: '#888', fontWeight: 'bold' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="fm-charts-grid" style={{ marginTop: '8px', paddingBottom: '24px' }}>
            <article className="fm-card fm-revenue-card">
              <div className="fm-revenue-header">
                <h4>Revenue Monitoring Detail</h4>
              </div>
              <div className="fm-expected-box">
                <div className="fm-icon-box-small bg-green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#4a2e72">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
                  </svg>
                </div>
                <div className="fm-expected-text">
                  <span>EXPECTED REVENUE</span>
                  <p>{parsedTotalHouseholds} households x ₱200</p>
                </div>
                <div className="fm-expected-total">₱{expectedRevenue.toLocaleString()}</div>
              </div>
              <div className="fm-split-progress">
                <div className="fm-progress-block">
                  <span className="fm-prog-label">COLLECTED</span>
                  <strong className="fm-prog-val">₱{collectedRev.toLocaleString()}</strong>
                  <div className="fm-progress-track"><div className="fm-prog-fill bg-dark" style={{width: `${collectedPct}%`}}></div></div>
                </div>
                <div className="fm-progress-divider"></div>
                <div className="fm-progress-block">
                  <span className="fm-prog-label text-red">OUTSTANDING</span>
                  <strong className="fm-prog-val text-red">₱{outstandingRev.toLocaleString()}</strong>
                  <div className="fm-progress-track"><div className="fm-prog-fill bg-red" style={{width: `${outstandingPct}%`}}></div></div>
                </div>
              </div>
            </article>

            <article className="fm-card fm-donut-card">
              <div className="fm-revenue-header">
                <h4>Payment Distribution</h4>
              </div>
              <div className="fm-donut-wrapper">
                <div className="fm-donut-chart">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#eef2f0" strokeWidth="12" />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#cb5448" strokeWidth="12" strokeDasharray={`${overdueDash} ${circ - overdueDash}`} strokeDashoffset="0" transform={`rotate(${overdueAngle} 50 50)`} />
                    <circle cx="50" cy="50" r="40" fill="none" stroke="#0f7050" strokeWidth="12" strokeDasharray={`${paidDash} ${circ - paidDash}`} strokeDashoffset="0" transform={`rotate(${paidAngle} 50 50)`} />
                  </svg>
                  <div className="fm-donut-center">
                    <strong>{parsedTotalHouseholds}</strong>
                    <span>TOTAL UNITS</span>
                  </div>
                </div>
                <div className="fm-donut-legend">
                  <div className="fm-legend-item">
                    <span className="fm-dot bg-dark"></span>
                    <div><strong>Paid</strong><span>{paidUnits} units ({paidUnitsPct}%)</span></div>
                  </div>
                  <div className="fm-legend-item">
                    <span className="fm-dot bg-green"></span>
                    <div><strong>Pending</strong><span>{pendingUnits} units ({pendingUnitsPct}%)</span></div>
                  </div>
                  <div className="fm-legend-item">
                    <span className="fm-dot bg-red"></span>
                    <div><strong>Overdue</strong><span>{overdueUnits} units ({overdueUnitsPct}%)</span></div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>
      </section>
    </main>
  );
}