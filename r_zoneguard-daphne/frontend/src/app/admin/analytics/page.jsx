// app/admin/analytics/page.jsx
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
  }
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

const getNum = (val) => {
  if (typeof val === 'number') return val;
  if (val && typeof val === 'object') {
    return Number(val.value || val.y || val.count || val.amount || val.total || 0);
  }
  return Number(val) || 0;
};

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [operationalRows, setOperationalRows] = useState([]);
  const [forecast, setForecast] = useState({ historical: [5, 9, 14, 18], projected: [15, 12, 10], labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'] });
  const [finForecast, setFinForecast] = useState({ historical: [], projected: [], labels: [] });
  const [heatmapData, setHeatmapData] = useState([]);
  
  const [revenueDetail, setRevenueDetail] = useState({ householdsCount: 148, baseAmount: 200, expectedRevenue: 29600, collectedRevenue: 0, outstandingRevenue: 29600 });
  const [paymentDist, setPaymentDist] = useState({ paidPercentage: 0, pendingPercentage: 0, overduePercentage: 100, paidCount: 0, pendingCount: 0, overdueCount: 148 });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('http://localhost:5000/api/analytics/summary').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/complaint-forecast').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/financial-forecast').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/operational-status').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/heatmap').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/revenue-detail').then(res => res.json()).catch(() => null),
      fetch('http://localhost:5000/api/analytics/payment-distribution').then(res => res.json()).catch(() => null),
    ]).then(([summaryRes, complaintRes, finRes, operationalRes, heatmapRes, revDetailRes, payDistRes]) => {
      if (summaryRes) setAnalytics(summaryRes.data || summaryRes);
      
      if (complaintRes) {
        const cData = complaintRes.data || complaintRes;
        if (cData.historical || cData.projected) {
          setForecast(cData);
        }
      }
      
      if (finRes) setFinForecast(finRes.data || finRes);
      if (revDetailRes) setRevenueDetail(revDetailRes.data || revDetailRes);
      if (payDistRes) setPaymentDist(payDistRes.data || payDistRes);
      
      const opData = operationalRes?.data || operationalRes?.rows || operationalRes;
      if (Array.isArray(opData)) setOperationalRows(opData);

      const heatResData = heatmapRes?.data || heatmapRes?.hotspots || heatmapRes;
      if (Array.isArray(heatResData)) setHeatmapData(heatResData);

      setIsLoading(false);
    }).catch((err) => {
      console.error("API fetch error:", err);
      setIsLoading(false);
    });
  }, []);

  const summary = analytics || {};
  // Forced fallback to 148 as requested for your dataset
  const parsedTotalHouseholds = getNum(summary.totalHouseholds ?? summary.totalResidents ?? 148) || 148;

  // Complaint Forecast Processing
  const histData = (forecast?.historical || [5, 9, 14, 18]).map(getNum);
  const projData = (forecast?.projected || forecast?.forecast || [15, 12, 10]).map(getNum);
  const combinedProj = histData.length > 0 ? [histData[histData.length - 1], ...projData] : [];
  const totalSteps = histData.length + projData.length;
  
  const labels = (forecast?.labels && forecast.labels.length > 0) 
    ? forecast.labels 
    : ['May', 'Jun', 'Jul', 'Aug (Peak)', 'Sep', 'Oct', 'Nov'];

  const generatePoints = (dataArray, startIndex = 0, totalPoints = 7) => {
    if (!dataArray || dataArray.length === 0) return "";
    const maxVal = Math.max(...histData, ...projData, 1);
    const minVal = 0;
    const range = maxVal - minVal || 1;
    return dataArray.map((val, index) => { 
      const actualIndex = startIndex + index;
      const x = 50 + (actualIndex * (460 / Math.max(totalPoints - 1, 1)));
      const y = 220 - ((val - minVal) / range) * 160;
      return `${x},${y}`;
    }).join(" ");
  };

  const historicalPoints = generatePoints(histData, 0, totalSteps);
  const projectedPoints = generatePoints(combinedProj, Math.max(0, histData.length - 1), totalSteps);

  // Financial Forecast setup
  const defaultMonths = finForecast?.labels?.length > 0 ? finForecast.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rawFinHist = (finForecast?.historical || [12000, 13500, 14200, 16000, 15500, 17000, 16800]).map(getNum);
  const rawFinProj = (finForecast?.projected || finForecast?.forecast || []).map(getNum);
  const fullFinData = [...rawFinHist, ...rawFinProj];
  const splitIndex = Math.min(rawFinHist.length, 12);
  const annualHistorical = fullFinData.slice(0, splitIndex);
  const annualProjectedCombined = annualHistorical.length > 0 ? [annualHistorical[annualHistorical.length - 1], ...fullFinData.slice(splitIndex - 1)] : [];
  
  const finTotalSteps = defaultMonths.length;
  const finAllVals = fullFinData.length > 0 ? fullFinData : [0];
  const finMaxVal = Math.max(...finAllVals, 1);
  const finMinVal = Math.min(...finAllVals, 0);
  const finRange = finMaxVal - finMinVal || 1;

  const generateFinPoints = (dataArray, startIndex = 0, count = 12) => {
    if (!dataArray || dataArray.length === 0) return "";
    return dataArray.map((val, index) => {
      const actualIndex = Math.min(startIndex + index, count - 1);
      const x = 50 + actualIndex * (530 / Math.max(count - 1, 1)); 
      const y = 190 - ((val - finMinVal) / finRange) * 150; 
      return `${x},${y}`;
    }).join(" "); 
  };

  const finHistoricalPoints = generateFinPoints(annualHistorical, 0, finTotalSteps);
  const finProjectedPoints = generateFinPoints(annualProjectedCombined, Math.max(0, annualHistorical.length - 1), finTotalSteps);
  
  // Fixed bar chart slicing to look at past active months (Jan-Jul) instead of future empty months (Aug-Dec)
  const barData = annualHistorical.length > 0 ? annualHistorical.slice(0, 7) : [12000, 13500, 14200, 16000, 15500, 17000, 16800]; 
  const barLabels = defaultMonths.slice(0, 7);
  const maxBarVal = barData.length > 0 ? Math.max(...barData, 1) : 1; 

  const currentRev = getNum(summary.currentRevenue ?? (annualHistorical.length > 0 ? annualHistorical[annualHistorical.length - 1] : 16800));
  const prevRev = getNum(annualHistorical.length > 1 ? annualHistorical[annualHistorical.length - 2] : 17000);
  
  let revChangePct = 0;
  if (prevRev > 0) {
    revChangePct = (((currentRev - prevRev) / prevRev) * 100).toFixed(1);
  }
  const isRevPositive = revChangePct >= 0;
  const formattedCurrentRev = `₱${(currentRev / 1000).toFixed(1)}k`;

  const collectedPct = summary.collectionRate !== undefined ? Number(summary.collectionRate).toFixed(1) : '0.0';
  const paidUnits = getNum(summary.paidThisMonth ?? summary.paid ?? 0);
  const pendingUnits = getNum(summary.pending ?? summary.pendingVerification ?? 0);
  const overdueUnits = getNum(summary.overdue ?? parsedTotalHouseholds);
  const overdueUnitsPct = parsedTotalHouseholds > 0 ? ((overdueUnits / parsedTotalHouseholds) * 100).toFixed(1) : '100.0';
  
  const dynamicRiskIndex = summary.riskIndex !== undefined ? summary.riskIndex : overdueUnitsPct;
  const dynamicResponseTime = summary.avgResponseTime !== undefined ? summary.avgResponseTime : '2.4 Hrs';

  const metrics = [
    { label: 'Total Registered Residents', value: String(parsedTotalHouseholds), detail: 'active paying households', tone: 'green', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg> },
    { label: 'Collection Rate', value: `${collectedPct}%`, detail: 'registered residents paid', tone: 'purple', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle></svg> },
    { label: 'Risk Index', value: `${dynamicRiskIndex}%`, detail: 'likely to default', tone: 'red', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#cb5448" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path></svg> },
    { label: 'Avg. Response Time', value: dynamicResponseTime, detail: 'mean + forecast trend', tone: 'blue', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e6f9b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
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
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
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
                {operationalRows.length > 0 ? (
                  operationalRows.map((row, idx) => (
                    <tr key={idx}>
                      <td>{row.category}</td>
                      <td><StatusPill tone={row.statusTone}>{row.status}</StatusPill></td>
                      <td>{row.metric}</td>
                      <td className="aa-insight">{row.insight}</td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td>Infrastructure</td>
                      <td><StatusPill tone="green">Stable</StatusPill></td>
                      <td>1.8 Hours</td>
                      <td className="aa-insight">Resolution rate optimal</td>
                    </tr>
                    <tr>
                      <td>Monthly Dues</td>
                      <td><StatusPill tone="red">At-Risk</StatusPill></td>
                      <td>{collectedPct === '0.0' ? '100% Unpaid (Current Month)' : `${(100 - Number(collectedPct)).toFixed(1)}% Unpaid`}</td>
                      <td className="aa-insight">High delinquency probability</td>
                    </tr>
                    <tr>
                      <td>Security</td>
                      <td><StatusPill tone="green">Optimal</StatusPill></td>
                      <td>15 Minutes</td>
                      <td className="aa-insight">Decreasing incident trend</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table> 
          </div>
        </section>
        
        <section className="aa-bottom-grid">
          <article className="aa-card aa-chart-card">
            <div className="aa-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0' }}>Complaint Forecast (Spike Analysis)</h3>
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
                  const maxVal = Math.max(...histData, ...projData, 10);
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
                    const isPeak = lbl.includes('Peak') || idx === 3;
                    return (
                      <g key={idx}>
                        {isPeak && <circle cx={x} cy="225" r="4" fill="#cb5448" />}
                        <text x={x} y="250" fontSize="11" fill={isPeak ? "#cb5448" : "#666"} fontWeight={isPeak ? "bold" : "normal"} textAnchor="middle">{lbl}</text>
                      </g>
                    );
                  })} 
                </g>
              </svg>
            </div>
            <div style={{ textAlign: 'center', marginTop: '4px' }}>
              <p className="aa-caption">Complaint Volume Projection & Spike Tracking (Next 30 Days)</p>
            </div>
          </article>
          
          <article className="aa-card aa-heatmap-card">
            <div className="aa-card-header">
              <h3>Zone Heatmap</h3>
              <span className="aa-engine">Engine: geom_density2d()</span>
            </div>
            <div className="aa-heatmap-box" aria-hidden="true" style={{ position: 'relative' }}>
              <div className="aa-heat-glow glow-a" />
              <div className="aa-heat-glow glow-b" />
              <div className="aa-heat-glow glow-c" />
              <div className="aa-map-overlay" />
              {heatmapData.map((spot, idx) => (
                <div 
                  key={idx} 
                  style={{
                    position: 'absolute',
                    left: `${spot.x}%`,
                    top: `${spot.y}%`,
                    width: '12px',
                    height: '12px',
                    background: '#cb5448',
                    borderRadius: '50%',
                    boxShadow: '0 0 10px #cb5448',
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={spot.label || `Hotspot ${idx + 1}`}
                />
              ))}
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
                  <span className={`fm-trend ${isRevPositive ? 'trend-up' : 'trend-down'}`}>{isRevPositive ? '+' : '-'}{Math.abs(revChangePct)}%</span>
                </div>
              </div>
            </article>
            
            <article className="fm-card fm-kpi-item">
              <div className="fm-kpi-header">
                <span className="fm-kpi-dots">•••</span>
                <span className="fm-kpi-label">Pending (Unverified)</span>
              </div>
              <div className="fm-kpi-body"> 
                <div className="fm-icon-box bg-purple" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></svg>
                </div>
                <div className="fm-kpi-value">
                  <strong>{pendingUnits}</strong>
                  <span className="fm-trend trend-neutral">Awaiting Review</span>
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
                  <h3 style={{ margin: '0 0 4px 0' }}>Financial Forecasting Projections (Full Year)</h3>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>ARIMA Time-Series Logic (Historical & 12-Month R-Analysis Predictions)</p>
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
                    {defaultMonths.map((lbl, idx) => {
                      const x = 50 + (idx * (530 / Math.max(finTotalSteps - 1, 1)));
                      return (
                        <text key={idx} x={x} y="220" fontSize="10" fill="#666" textAnchor="middle" fontWeight="500">{lbl}</text>
                      );
                    })}
                  </g>
                </svg>
              </div>
            </article>
            
            <article className="fm-card fm-bar-card" style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="fm-revenue-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Monthly Collection Trend</h4>
                <span className="aa-engine" style={{ fontSize: '11px' }}>Revenue Monitoring Details</span>
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
                  const heightPct = maxBarVal > 0 ? Math.max((val / maxBarVal) * 100, 5) : 5; 
                  const label = barLabels[idx] ? String(barLabels[idx]) : `M${idx + 1}`;
                  
                  return (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '13%', height: '100%' }}>
                      <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                        <div 
                          style={{ 
                            width: '100%', 
                            height: `${heightPct}%`, 
                            background: isLastBar ? '#0e5f43' : '#b8d8cc', 
                            borderRadius: '4px 4px 0 0',
                            transition: 'height 0.3s ease'
                          }}
                          title={`₱${val}`}
                        />
                      </div>
                      <span style={{ fontSize: '11px', color: '#666', marginTop: '8px' }}>{label}</span>
                    </div>
                  );
                })}
              </div>
            </article>
          </div>

          <div className="fm-charts-grid" style={{ marginTop: '24px' }}>
            
            <article className="fm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Revenue Monitoring Detail</h3>
                <div style={{ background: '#f8faf9', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', border: '1px solid #eef2f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ background: '#e2f0ea', padding: '10px', borderRadius: '8px', color: '#0e5f43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0e5f43', letterSpacing: '0.5px' }}>EXPECTED REVENUE</span>
                      <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#555' }}>{parsedTotalHouseholds} households x ₱{revenueDetail.baseAmount || 200}</p>
                    </div>
                  </div>
                  <strong style={{ fontSize: '22px', fontWeight: '800', color: '#111' }}>₱{(parsedTotalHouseholds * (revenueDetail.baseAmount || 200)).toLocaleString()}</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                  <span style={{ fontSize: '11px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' }}>COLLECTED</span>
                  <h4 style={{ margin: '8px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#0e5f43' }}>₱{(revenueDetail.collectedRevenue || 0).toLocaleString()}</h4>
                </div>
                <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                  <span style={{ fontSize: '11px', color: '#cb5448', fontWeight: '700', letterSpacing: '0.5px' }}>OUTSTANDING</span>
                  <h4 style={{ margin: '8px 0 0 0', fontSize: '22px', fontWeight: '800', color: '#cb5448' }}>₱{(revenueDetail.outstandingRevenue || (parsedTotalHouseholds * 200)).toLocaleString()}</h4>
                </div>
              </div>
            </article>

            <article className="fm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Payment Distribution</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '10px 0' }}>
                <div style={{ position: 'relative', width: '130px', height: '130px' }}>
                  <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="4" />
                    <path strokeDasharray={`${paymentDist.overduePercentage || 100}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#cb5448" strokeWidth="4" />
                    <path strokeDasharray={`${paymentDist.pendingPercentage || 0}, 100`} strokeDashoffset={`-${paymentDist.overduePercentage || 100}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#9b51e0" strokeWidth="4" />
                    <path strokeDasharray={`${paymentDist.paidPercentage || 0}, 100`} strokeDashoffset={`-${(paymentDist.overduePercentage || 100) + (paymentDist.pendingPercentage || 0)}`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#0e5f43" strokeWidth="4" />
                  </svg>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', background: '#0e5f43', borderRadius: '3px' }}></span>
                    <span style={{ color: '#444' }}>Paid ({paymentDist.paidPercentage || 0}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', background: '#9b51e0', borderRadius: '3px' }}></span>
                    <span style={{ color: '#444' }}>Pending ({paymentDist.pendingPercentage || 0}%)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ width: '12px', height: '12px', background: '#cb5448', borderRadius: '3px' }}></span>
                    <span style={{ color: '#444' }}>Overdue ({paymentDist.overduePercentage || 100}%)</span>
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