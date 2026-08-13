"use client";
<<<<<<< HEAD
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import './style.css';

function MetricCard({ icon, label, value, detail, tone }) {
  return (
    <article className={`aa-metric-card tone-${tone}`} style={{ padding: '24px' }}>
      <div className="aa-metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong style={{ fontSize: '1.75rem', margin: '4px 0' }}>{value}</strong>
=======

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
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        <span>{detail}</span>
      </div>
    </article>
  );
}

function StatusPill({ tone, children }) {
  return <span className={`aa-status-pill tone-${tone}`}>{children}</span>;
<<<<<<< HEAD
} 

const getNum = (val) => {
  if (typeof val === 'number') return val;
  if (val && typeof val === 'object') {
    return Number(val.value || val.y || val.count || val.amount || val.total || 0);
  }
  return Number(val) || 0;
};

function AnalyticsContent() {
  const searchParams = useSearchParams();
  const rawSearchQuery = searchParams.get('q') || '';
  const searchQuery = rawSearchQuery.toLowerCase();

  const [analytics, setAnalytics] = useState(null);
  const [operationalRows, setOperationalRows] = useState([]);
  const [forecast, setForecast] = useState({ historical: [], projected: [], labels: [] });
  const [finForecast, setFinForecast] = useState({ historical: [], projected: [], labels: [] });
  const [heatmapData, setHeatmapData] = useState([]);
  
  const [revenueDetail, setRevenueDetail] = useState({ householdsCount: 148, baseAmount: 200, expectedRevenue: 29600, collectedRevenue: 0, outstandingRevenue: 29600 });
  const [paymentDist, setPaymentDist] = useState({ paidPercentage: 0, pendingPercentage: 0, overduePercentage: 100, paidCount: 0, pendingCount: 0, overdueCount: 148 });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [dateRangeFilter, setDateRangeFilter] = useState('this_month');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    Promise.all([
      fetch(`http://localhost:5000/api/analytics/summary?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/complaint-forecast?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/financial-forecast?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/operational-status?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/heatmap?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/revenue-detail?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
      fetch(`http://localhost:5000/api/analytics/payment-distribution?range=${dateRangeFilter}`).then(res => res.json()).catch(() => null),
    ]).then(([summaryRes, complaintRes, finRes, operationalRes, heatmapRes, revDetailRes, payDistRes]) => {
      if (summaryRes) setAnalytics(summaryRes.data || summaryRes);
      if (complaintRes) {
        const cData = complaintRes.data || complaintRes;
        if (cData.historical || cData.projected) setForecast(cData);
      }
      if (finRes) setFinForecast(finRes.data || finRes);
      if (revDetailRes) setRevenueDetail(revDetailRes.data || revDetailRes);
      if (payDistRes) setPaymentDist(payDistRes.data || payDistRes);
      
      const opData = operationalRes?.data || operationalRes?.rows || operationalRes;
      if (Array.isArray(opData)) setOperationalRows(opData);

      const heatResData = heatmapRes?.data || heatmapRes?.hotspots || heatmapRes;
      if (Array.isArray(heatResData)) setHeatmapData(heatResData);
    }).catch((err) => console.error("Analytics fetch error:", err));
  }, [dateRangeFilter]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setReportGenerated(false);
    setTimeout(() => {
      const reportContent = `ZoneGuard Analytics Report\nGenerated: ${new Date().toLocaleString()}\nDate Scope: ${dateRangeFilter}\nCategory Scope: ${categoryFilter}\nTotal Households: ${parsedTotalHouseholds}\nCollection Rate: ${collectedPct}%\nRisk Index: ${dynamicRiskIndex}%\nAvg Response Time: ${dynamicResponseTime}\n`;
      const blob = new Blob([reportContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `ZoneGuard_Analytics_Report_${dateRangeFilter}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsGenerating(false);
      setReportGenerated(true);
      setTimeout(() => setReportGenerated(false), 4000);
    }, 1200);
  };

  const summary = analytics || {};
  const parsedTotalHouseholds = getNum(summary.totalHouseholds ?? summary.totalResidents ?? 148) || 148;

  const histData = (forecast?.historical || [8, 7, 11, 11, 9, 10, 0, 9]).map(getNum);
  const projData = (forecast?.projected || [15, 12, 10, 9]).map(getNum);
  const combinedProj = histData.length > 0 ? [histData[histData.length - 1], ...projData] : [];
  const totalSteps = histData.length + projData.length;
  
  const labels = (forecast?.labels && forecast.labels.length > 0) 
    ? forecast.labels 
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const generatePoints = (dataArray, startIndex = 0, totalPoints = 12) => {
    if (!dataArray || dataArray.length === 0) return "";
    const maxVal = Math.max(...histData, ...projData, 1);
    const range = maxVal || 1;
    return dataArray.map((val, index) => { 
      const actualIndex = startIndex + index;
      const x = 50 + (actualIndex * (460 / Math.max(totalPoints - 1, 1)));
      const y = 220 - (val / range) * 160;
=======
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
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      return `${x},${y}`;
    }).join(" ");
  };

<<<<<<< HEAD
  const historicalPoints = generatePoints(histData, 0, totalSteps);
  const projectedPoints = generatePoints(combinedProj, Math.max(0, histData.length - 1), totalSteps);

  const defaultMonths = finForecast?.labels?.length > 0 ? finForecast.labels : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const rawFinHist = (finForecast?.historical || []).map(getNum);
  const rawFinProj = (finForecast?.projected || []).map(getNum);
  const fullFinData = [...rawFinHist, ...rawFinProj];
  const splitIndex = Math.min(rawFinHist.length || 8, 12);
  const annualHistorical = fullFinData.slice(0, splitIndex);
  const annualProjectedCombined = annualHistorical.length > 0 ? [annualHistorical[annualHistorical.length - 1], ...fullFinData.slice(splitIndex - 1)] : [];
  
  const finTotalSteps = defaultMonths.length;
  const finAllVals = fullFinData.length > 0 ? fullFinData : [0];
  const finMaxVal = Math.max(...finAllVals, 1);
  const finMinVal = 0;
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
  
  const barData = annualHistorical.length > 0 ? annualHistorical.slice(0, 8) : [16800, 14200, 13500, 12000, 15500, 17000, 16800, 16000]; 
  const barLabels = defaultMonths.slice(0, 8);
  const maxBarVal = barData.length > 0 ? Math.max(...barData, 1) : 1; 

  const currentRev = getNum(summary.currentRevenue ?? (barData.length > 0 ? barData[barData.length - 1] : 16800));
  const prevRev = getNum(barData.length > 1 ? barData[barData.length - 2] : 17000);
  
  let revChangePct = 0;
  if (prevRev > 0) {
    revChangePct = (((currentRev - prevRev) / prevRev) * 100).toFixed(1);
  }
  const isRevPositive = revChangePct >= 0;
  const formattedCurrentRev = `₱${(currentRev / 1000).toFixed(1)}k`;

  const collectedPct = summary.collectionRate !== undefined ? Number(summary.collectionRate).toFixed(1) : '0.0';
  const paidUnits = getNum(summary.paidThisMonth ?? summary.paid ?? 0);
  const pendingUnits = getNum(summary.pending ?? 0);
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

  const sourceRows = operationalRows.length > 0 ? operationalRows : [
    { category: 'Infrastructure SLA', status: 'Stable', metric: '1.8 Hours Avg', insight: 'Model: stats::glm() - Resolution efficiency optimal', statusTone: 'green' },
    { category: 'Unpaid Dues', status: 'Optimal', metric: `${overdueUnitsPct}% Unpaid`, insight: 'Model: rpart::rpart() - Default risk classification tree', statusTone: 'green' },
    { category: 'Security & Incident Response', status: 'Optimal', metric: '15 Minutes', insight: 'Model: cluster::kmeans() - Incident hotspot tracking', statusTone: 'green' }
  ];

  const filteredRows = sourceRows.filter(row => {
    const matchesSearch = row.category.toLowerCase().includes(searchQuery) ||
      row.status.toLowerCase().includes(searchQuery) ||
      row.insight.toLowerCase().includes(searchQuery) ||
      row.metric.toLowerCase().includes(searchQuery);

    const catLower = row.category.toLowerCase();
    const matchesCategoryFilter = categoryFilter === 'all' || 
      catLower.includes(categoryFilter) ||
      (categoryFilter === 'unpaid share' && (catLower.includes('unpaid share') || catLower.includes('unpaid dues') || catLower.includes('payment') || catLower.includes('delinquency')));

    return matchesSearch && matchesCategoryFilter;
  });

  const checkMatch = (keywords) => {
    if (!searchQuery) return true;
    return keywords.some(kw => kw.toLowerCase().includes(searchQuery) || searchQuery.includes(kw.toLowerCase()));
  };

  const showMetrics = checkMatch(['resident', 'households', 'collection', 'rate', 'risk', 'response', 'time', 'metrics', 'financial', 'analytics']);
  const showOperational = checkMatch(['operational', 'status', 'infrastructure', 'unpaid share', 'unpaid dues', 'security', 'table', 'metrics', 'financial']);
  const showComplaintForecast = checkMatch(['complaint', 'forecast', 'spike', 'analysis', 'arima', '30-day', 'metrics', 'financial']);
  const showHeatmap = checkMatch(['heatmap', 'zone', 'hotspots', 'demand', 'density', 'metrics', 'financial']);
  const showFinancialSection = checkMatch(['financial', 'monitoring', 'revenue', 'payment', 'paid', 'pending', 'overdue', 'forecasting', 'collection', 'metrics']);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden w-full">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <main className="p-8 md:p-10 space-y-8 max-w-7xl mx-auto w-full pb-16">
          <style dangerouslySetInnerHTML={{ __html: `
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
            *, body, html, div, span, h1, h2, h3, h4, h5, h6, p, a, button, input, select, textarea, th, td {
              font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
            }
          `}} />

          {/* Header */}
          <section className="flex justify-between items-center" style={{ marginBottom: '32px' }}>
            <div>
              <h1 className="text-2xl font-bold text-gray-900" style={{ marginBottom: '6px' }}>Analytics Report</h1>
              <p className="text-sm text-gray-500">Operational overview for approvals, complaints, payments, and resident activity.</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="aa-secondary-button"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                style={{ padding: '10px 18px' }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                Filter {isFilterOpen ? '▲' : '▼'}
              </button>
              <button 
                type="button" 
                className="aa-primary-button"
                onClick={handleGenerateReport}
                disabled={isGenerating}
                style={{ padding: '10px 20px' }}
              >
                {isGenerating ? (
                  <>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"></path></svg>
                    Generating...
                  </>
                ) : (
                  <>Generate New Report</>
                )}
              </button>
            </div>
          </section>

          {reportGenerated && (
            <div className="aa-toast" style={{ marginBottom: '24px' }}>
              <span>🎉 Report downloaded successfully as CSV and ready for review!</span>
              <button onClick={() => setReportGenerated(false)}>×</button>
            </div>
          )}

          {isFilterOpen && (
            <div className="aa-filter-panel" style={{ padding: '20px', marginBottom: '32px', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Date Range Scope</label>
                <select value={dateRangeFilter} onChange={(e) => setDateRangeFilter(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="this_month">This Month (August 2026)</option>
                  <option value="last_month">Last Month</option>
                  <option value="last_3_months">Last 3 Months</option>
                  <option value="next_month">Next Month (September 2026)</option>
                  <option value="next_3_months">Next 3 Months (Sep - Nov 2026)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Category Scope</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="all">All Categories</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="unpaid share">Unpaid Dues</option>
                  <option value="security">Security</option>
                </select>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button 
                  type="button" 
                  className="aa-primary-button" 
                  style={{ width: '100%', padding: '10px 16px' }}
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filter
                </button>
              </div>
            </div>
          )}
          
          {showMetrics && (
            <section className="aa-metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '36px' }}>
              {metrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </section>
          )}
          
          {showOperational && (
            <section className="aa-table-card aa-card" style={{ padding: '24px', marginBottom: '36px' }}>
              <div className="aa-section-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: '0 0 4px 0' }}>Zone Operational Status & R-Analytics</h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Database-driven metrics analyzed via R statistical modeling.</p>
                </div>
                <span className="aa-engine">Engine: stats::glm() + rpart::rpart()</span>
              </div>
              <div className="aa-table-wrap">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
                      <th style={{ padding: '12px 16px' }}>Category</th>
                      <th style={{ padding: '12px 16px' }}>Status</th>
                      <th style={{ padding: '12px 16px' }}>Metric (Database)</th>
                      <th style={{ padding: '12px 16px' }}>R-Driven Predictive Insight</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.length > 0 ? (
                      filteredRows.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f5f5f5' }}>
                          <td style={{ padding: '16px' }}>{row.category}</td>
                          <td style={{ padding: '16px' }}><StatusPill tone={row.statusTone}>{row.status}</StatusPill></td>
                          <td style={{ padding: '16px' }}>{row.metric}</td>
                          <td style={{ padding: '16px' }} className="aa-insight">{row.insight}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#7a8a83' }}>
                          No matching operational metrics found for the selected filter combination.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table> 
              </div>
            </section>
          )}
          
          {(showComplaintForecast || showHeatmap) && (
            <section className="aa-bottom-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px', marginBottom: '36px' }}>
              {showComplaintForecast && (
                <article className="aa-card aa-chart-card" style={{ padding: '24px' }}>
                  <div className="aa-card-header" style={{ marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '0 0 6px 0', fontSize: '1.1rem' }}>Complaint Forecast (Spike Analysis)</h3>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#555', alignItems: 'center' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '14px', height: '3px', background: '#4e6f9b', display: 'inline-block', borderRadius: '2px' }}></span> Historical Data
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '14px', height: '0px', borderTop: '3px dashed #67d4c0', display: 'inline-block' }}></span> 30-Day Forecast
                        </span>
                      </div>
                    </div>
                    <span className="aa-engine">Engine: forecast::auto.arima()</span>
                  </div>
                  
                  <div className="aa-chart-box" style={{ minHeight: '260px', position: 'relative', marginTop: '12px' }}>
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
                          const isAugust = lbl === 'Aug';
                          return (
                            <g key={idx}>
                              {isAugust && <circle cx={x} cy={220 - ((histData[7] || 0) / Math.max(...histData, ...projData, 1)) * 160} r="4" fill="#cb5448" />}
                              <text x={x} y="250" fontSize="11" fill={isAugust ? "#cb5448" : "#666"} fontWeight={isAugust ? "bold" : "normal"} textAnchor="middle">{lbl}</text>
                            </g>
                          );
                        })} 
                      </g>
                    </svg>
                  </div>
                  <p className="aa-caption" style={{ marginTop: '16px' }}>Complaint Volume Projection & Spike Tracking (Next 30 Days)</p>
                </article>
              )}
              
              {showHeatmap && (
                <article className="aa-card aa-heatmap-card" style={{ padding: '24px' }}>
                  <div className="aa-card-header" style={{ marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Zone Heatmap</h3>
                    <span className="aa-engine">Engine: geom_density2d()</span>
                  </div>
                  <div className="aa-heatmap-box" aria-hidden="true" style={{ position: 'relative', minHeight: '260px' }}>
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
                  <p className="aa-caption" style={{ marginTop: '16px' }}>Service Demand Hotspots</p>
                </article>
              )}
            </section>
          )}
          
          {showFinancialSection && (
            <div style={{ marginTop: '40px' }}>
              <div className="fm-divider" style={{ margin: '32px 0' }}></div> 
              
              <section className="fm-section">
                <h2 className="fm-title" style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '24px' }}>Financial Monitoring</h2>
                <div className="fm-kpi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '20px', marginBottom: '28px' }}>
                  <article className="fm-card fm-kpi-item" style={{ padding: '20px' }}>
                    <div className="fm-kpi-header">
                      <span className="fm-kpi-dots">•••</span>
                      <span className="fm-kpi-label">Paid This Period</span>
                    </div>
                    <div className="fm-kpi-body" style={{ marginTop: '12px' }}>
                      <div className="fm-icon-box bg-green" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                      </div>
                      <div className="fm-kpi-value">
                        <strong style={{ fontSize: '1.5rem' }}>{paidUnits}</strong>
                        <span className={`fm-trend ${isRevPositive ? 'trend-up' : 'trend-down'}`}>{isRevPositive ? '+' : '-'}{Math.abs(revChangePct)}%</span>
                      </div>
                    </div>
                  </article>
                  
                  <article className="fm-card fm-kpi-item" style={{ padding: '20px' }}>
                    <div className="fm-kpi-header">
                      <span className="fm-kpi-dots">•••</span>
                      <span className="fm-kpi-label">Pending (Unverified)</span>
                    </div>
                    <div className="fm-kpi-body" style={{ marginTop: '12px' }}> 
                      <div className="fm-icon-box bg-purple" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 15 15"></polyline></svg>
                      </div>
                      <div className="fm-kpi-value">
                        <strong style={{ fontSize: '1.5rem' }}>{pendingUnits}</strong>
                        <span className="fm-trend trend-neutral">Awaiting Review</span>
                      </div>
                    </div>
                  </article>
                  
                  <article className="fm-card fm-kpi-item" style={{ padding: '20px' }}>
                    <div className="fm-kpi-header">
                      <span className="fm-kpi-label centered">Overdue</span>
                    </div>
                    <div className="fm-kpi-body centered-body" style={{ marginTop: '12px' }}>
                      <div className="fm-icon-box bg-red" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                      </div>
                      <div className="fm-kpi-value">
                        <strong style={{ fontSize: '1.5rem' }}>{overdueUnits}</strong>
                        <span className="fm-trend trend-down">{overdueUnitsPct}% Total</span>
                      </div>
                    </div>
                  </article> 
                  
                  <article className="fm-card fm-kpi-item fm-kpi-dark" style={{ padding: '20px' }}>
                    <div className="fm-kpi-header">
                      <span className="fm-kpi-dots text-white">•••</span>
                      <span className="fm-kpi-label text-white">Collection Rate</span>
                    </div>
                    <div className="fm-kpi-body" style={{ marginTop: '12px' }}>
                      <div className="fm-icon-box bg-dark-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7"></line><polyline points="7 7 17 7 17 17"></polyline></svg>
                      </div>
                      <div className="fm-kpi-value">
                        <strong className="text-white" style={{ fontSize: '1.5rem' }}>{collectedPct}%</strong>
                      </div>
                    </div>
                  </article>
                </div>
                
                <div className="fm-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '24px', marginBottom: '28px' }}>
                  <article className="fm-card fm-chart-card" style={{ padding: '24px' }}>
                    <div className="fm-chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '1.1rem' }}>Financial Forecasting Projections (Full Year)</h3>
                        <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>ARIMA Time-Series Logic (Historical Jan-Aug & 12-Month R-Analysis Predictions)</p>
                      </div> 
                      <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#555', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '14px', height: '3px', background: '#0e5f43', display: 'inline-block', borderRadius: '2px' }}></span> Historical Data
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ width: '14px', height: '0px', borderTop: '3px dashed #0e5f43', display: 'inline-block' }}></span> ARIMA Forecast
                        </span>
                      </div>
                    </div>
                    
                    <div className="fm-line-chart-box" style={{ minHeight: '260px', position: 'relative', marginTop: '16px' }}>
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
                  
                  <article className="fm-card fm-bar-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
                    <div className="fm-chart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Monthly Collection Trend</h3>
                      <span className="aa-engine">Revenue Monitoring (Jan–Aug)</span>
                    </div>
                    <div className="fm-chart-header text-center" style={{ marginTop: '2px', marginBottom: '16px' }}>
                      <h3 className="fm-huge-text" style={{ fontSize: '36px', fontWeight: '800', marginBottom: '2px', color: '#0e5f43' }}>
                        {formattedCurrentRev}
                      </h3>
                      <span className="fm-trend-bold" style={{ color: isRevPositive ? '#0f7050' : '#cb5448', fontSize: '13px' }}>
                        {isRevPositive ? '↑' : '↓'} {Math.abs(revChangePct)}% VS Previous Period
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flex: 1, minHeight: '160px', marginTop: 'auto', padding: '0 4px' }}>
                      {barData.map((val, idx) => {
                        const isLastBar = idx === barData.length - 1;
                        const heightPct = maxBarVal > 0 ? Math.max((val / maxBarVal) * 100, 5) : 5; 
                        const label = barLabels[idx] ? String(barLabels[idx]) : `M${idx + 1}`;
                        
                        return (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '11%', height: '100%' }}>
                            <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                              <div 
                                style={{ 
                                  width: '100%', 
                                  height: `${heightPct}%`, 
                                  background: isLastBar ? '#0e5f43' : '#b8d8cc', 
                                  borderRadius: '4px 4px 0 0'
                                }}
                                title={`₱${val}`}
                              />
                            </div>
                            <span style={{ fontSize: '10px', color: '#666', marginTop: '6px' }}>{label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </article>
                </div>

                <div className="fm-charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <article className="fm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#203d32' }}>Revenue Monitoring Detail</h3>
                      <div style={{ background: '#f8faf9', padding: '16px 20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', border: '1px solid #eef2f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{ background: '#e2f0ea', padding: '10px', borderRadius: '8px', color: '#0e5f43', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                          </div>
                          <div>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#0e5f43', letterSpacing: '0.5px' }}>EXPECTED REVENUE</span>
                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#555' }}>{revenueDetail.householdsCount || 148} households x ₱{revenueDetail.baseAmount || 200}</p>
                          </div>
                        </div>
                        <strong style={{ fontSize: '20px', fontWeight: '800', color: '#111' }}>₱{(revenueDetail.expectedRevenue || 29600).toLocaleString()}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                        <span style={{ fontSize: '11px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' }}>COLLECTED</span>
                        <h4 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#0e5f43' }}>₱{(revenueDetail.collectedRevenue || 0).toLocaleString()}</h4>
                      </div>
                      <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                        <span style={{ fontSize: '11px', color: '#cb5448', fontWeight: '700', letterSpacing: '0.5px' }}>OUTSTANDING</span>
                        <h4 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#cb5448' }}>₱{(revenueDetail.outstandingRevenue || 29600).toLocaleString()}</h4>
                      </div>
                    </div>
                  </article>

                  <article className="fm-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', color: '#203d32' }}>Payment Distribution</h3>
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
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  return (
    <Suspense fallback={<div>Loading analytics...</div>}>
      <AnalyticsContent />
    </Suspense>
=======
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
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  );
}