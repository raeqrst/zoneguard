"use client";
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
    }).catch(() => {});
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

  // Complaint Forecast Data Preparation
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
      return `${x},${y}`;
    }).join(" ");
  };

  const historicalPoints = generatePoints(histData, 0, totalSteps);
  const projectedPoints = generatePoints(combinedProj, Math.max(0, histData.length - 1), totalSteps);

  // Financial Forecasting Full Year & Monthly Collection Trend Preparation
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
  
  // Monthly Collection Trend: strictly up to August (8 bars)
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
    { category: 'Unpaid Share', status: 'Optimal', metric: `${overdueUnitsPct}% Unpaid`, insight: 'Model: rpart::rpart() - Default risk classification tree', statusTone: 'green' },
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
      (categoryFilter === 'unpaid share' && (catLower.includes('unpaid share') || catLower.includes('payment') || catLower.includes('delinquency')));

    return matchesSearch && matchesCategoryFilter;
  });

  const checkMatch = (keywords) => {
    if (!searchQuery) return true;
    return keywords.some(kw => kw.toLowerCase().includes(searchQuery) || searchQuery.includes(kw.toLowerCase()));
  };

  const showMetrics = checkMatch(['resident', 'households', 'collection', 'rate', 'risk', 'response', 'time', 'metrics', 'financial', 'analytics']);
  const showOperational = checkMatch(['operational', 'status', 'infrastructure', 'unpaid share', 'security', 'table', 'metrics', 'financial']);
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
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '13px' }}>Category Scope</label>
                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }}>
                  <option value="all">All Categories</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="unpaid share">Unpaid Share</option>
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
                            <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#555' }}>{parsedTotalHouseholds} households x ₱{revenueDetail.baseAmount || 200}</p>
                          </div>
                        </div>
                        <strong style={{ fontSize: '20px', fontWeight: '800', color: '#111' }}>₱{(parsedTotalHouseholds * (revenueDetail.baseAmount || 200)).toLocaleString()}</strong>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                        <span style={{ fontSize: '11px', color: '#666', fontWeight: '700', letterSpacing: '0.5px' }}>COLLECTED</span>
                        <h4 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#0e5f43' }}>₱{(revenueDetail.collectedRevenue || 0).toLocaleString()}</h4>
                      </div>
                      <div style={{ border: '1px solid #eee', padding: '16px', borderRadius: '8px', background: '#fff' }}>
                        <span style={{ fontSize: '11px', color: '#cb5448', fontWeight: '700', letterSpacing: '0.5px' }}>OUTSTANDING</span>
                        <h4 style={{ margin: '6px 0 0 0', fontSize: '20px', fontWeight: '800', color: '#cb5448' }}>₱{(revenueDetail.outstandingRevenue || (parsedTotalHouseholds * 200)).toLocaleString()}</h4>
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
  );
}