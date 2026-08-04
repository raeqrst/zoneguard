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
  chevronDown: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
};

const API_BASE = 'http://localhost:5000/api';

const formatCurrency = (amount) => {
  const isNegative = amount < 0;
  const formatted = Math.abs(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return isNegative ? `-₱${formatted}` : `₱${formatted}`;
};

// Strict actual records only (no future estimates)
const financialDataByRange = {
  Q1: {
    title: "Q1 2026 (January - March)",
    rows: [
      { cycle: 'January', gross: 90000, net: 81000, budget: 100000, variance: -10000 },
      { cycle: 'February', gross: 95000, net: 85500, budget: 100000, variance: -5000 },
      { cycle: 'March', gross: 95000, net: 85500, budget: 100000, variance: -5000 },
    ],
    total: { gross: 280000, net: 252000, budget: 300000, variance: -20000 }
  },
  Q2: {
    title: "Q2 2026 (April - June)",
    rows: [
      { cycle: 'April', gross: 100000, net: 90000, budget: 95000, variance: 5000 },
      { cycle: 'May', gross: 110000, net: 99000, budget: 100000, variance: 9000 },
      { cycle: 'June', gross: 100000, net: 90000, budget: 95000, variance: 5000 },
    ],
    total: { gross: 310000, net: 279000, budget: 290000, variance: 19000 }
  },
  Q3: {
    title: "Q3 2026 (July - August TD)",
    rows: [
      { cycle: 'July', gross: 65000, net: 58500, budget: 52000, variance: 6500 },
      { cycle: 'August (TD)', gross: 31000, net: 27900, budget: 25000, variance: 2900 },
    ],
    total: { gross: 96000, net: 86400, budget: 77000, variance: 9400 }
  },
  FULL_YEAR_YTD: {
    title: "Full Year 2026 YTD (Recorded Data)",
    rows: [
      { cycle: 'Q1 Total', gross: 280000, net: 252000, budget: 300000, variance: -20000 },
      { cycle: 'Q2 Total', gross: 310000, net: 279000, budget: 290000, variance: 19000 },
      { cycle: 'Q3 Total (TD)', gross: 96000, net: 86400, budget: 77000, variance: 9400 },
    ],
    total: { gross: 686000, net: 617400, budget: 667000, variance: 8400 }
  }
};

export default function ExecutiveReportsPage() {
  const [complaintsData, setComplaintsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRange, setActiveRange] = useState('Q3');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchReportsData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE}/complaints`);
        const data = await response.json();
        setComplaintsData(data.complaints || []);
      } catch (error) {
        console.error('Failed to load reports data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReportsData();
  }, []);

  const categoryStats = complaintsData.reduce((acc, item) => {
    const cat = (item.categoryRaw || item.category || 'General').toLowerCase();
    const formattedCat = cat.charAt(0).toUpperCase() + cat.slice(1);
    const status = (item.status || '').toLowerCase();
    const isEscalated = status === 'escalated' || item.assignedDirectorId || item.assigned_director_id;

    if (isEscalated) {
      if (!acc[formattedCat]) {
        acc[formattedCat] = { total: 0, resolved: 0, active: 0 };
      }
      acc[formattedCat].total += 1;
      if (status === 'resolved') {
        acc[formattedCat].resolved += 1;
      } else {
        acc[formattedCat].active += 1;
      }
    }
    return acc;
  }, {});

  const categoriesList = Object.keys(categoryStats).length > 0 
    ? Object.entries(categoryStats).map(([name, stats]) => ({ name, ...stats }))
    : [
        { name: 'Financial', total: 3, resolved: 2, active: 1 },
        { name: 'Public Relations', total: 4, resolved: 1, active: 3 },
        { name: 'Beautification', total: 4, resolved: 3, active: 1 },
        { name: 'Infrastructure', total: 2, resolved: 2, active: 0 },
        { name: 'Sports', total: 3, resolved: 2, active: 1 },
      ];

  const currentFinancialData = financialDataByRange[activeRange];

  const handleDownloadCSV = () => {
    const rangeLabels = {
      Q1: 'Q1 2026 (January - March)',
      Q2: 'Q2 2026 (April - June)',
      Q3: 'Q3 2026 (July - August TD)',
      FULL_YEAR_YTD: 'Full Year 2026 YTD Recorded Data'
    };

    let csvContent = `Executive Financial Report - ${rangeLabels[activeRange]}\n\n`;

    csvContent += "CONSOLIDATED FINANCIALS\n";
    csvContent += "Billing Cycle,Gross Collections (PHP),Net Collectible (After 10%),Total Allocated Budget (PHP),Net Variance (PHP)\n";

    currentFinancialData.rows.forEach(row => {
      csvContent += `"${row.cycle}",${row.gross.toFixed(2)},${row.net.toFixed(2)},${row.budget.toFixed(2)},${row.variance.toFixed(2)}\n`;
    });
    
    csvContent += `"Total",${currentFinancialData.total.gross.toFixed(2)},${currentFinancialData.total.net.toFixed(2)},${currentFinancialData.total.budget.toFixed(2)},${currentFinancialData.total.variance.toFixed(2)}\n`;

    csvContent += "\nESCALATED ISSUES BY CATEGORY\n";
    csvContent += "Complaint Category,Total Escalated,Resolved,Currently Active\n";
    categoriesList.forEach(cat => {
      csvContent += `"${cat.name}",${cat.total},${cat.resolved},${cat.active}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Executive_Financial_Report_${activeRange}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="main-content">
      <header className="top-header">
        <div className="search-bar">
          <span className="search-icon">{Icons.search}</span>
          <input 
            type="text" 
            placeholder="Search reports..." 
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

      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1>Executive Reports</h1>
          <p className="page-subtitle">
            Strategic performance metrics and high-level financial health monitoring for 2026.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ 
                backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', padding: '10px 16px', 
                borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', color: '#334155',
                display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' 
              }}
            >
              <span>{currentFinancialData.title}</span>
              {Icons.chevronDown}
            </button>

            {isDropdownOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: '6px', backgroundColor: '#fff',
                border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                zIndex: 100, minWidth: '240px', overflow: 'hidden'
              }}>
                {[
                  { key: 'Q1', label: 'Q1 2026 (January - March)' },
                  { key: 'Q2', label: 'Q2 2026 (April - June)' },
                  { key: 'Q3', label: 'Q3 2026 (July - August TD)' },
                  { key: 'FULL_YEAR_YTD', label: 'Full Year 2026 YTD Recorded Data' }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => {
                      setActiveRange(item.key);
                      setIsDropdownOpen(false);
                    }}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 16px', background: activeRange === item.key ? '#f0fdf4' : 'transparent',
                      border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.85rem',
                      fontWeight: activeRange === item.key ? '700' : '500', color: activeRange === item.key ? '#064e3b' : '#334155'
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button 
            className="export-btn" 
            onClick={handleDownloadCSV} 
            style={{ 
              backgroundColor: '#064e3b', color: '#fff', display: 'flex', alignItems: 'center', 
              gap: '8px', padding: '10px 16px', borderRadius: '8px', border: 'none', fontWeight: '700', cursor: 'pointer' 
            }}
          >
            {Icons.export} Generate CSV File
          </button>
        </div>
      </div>

      <div className="table-card" style={{ marginBottom: '32px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#064e3b', fontWeight: '700' }}>
            Consolidated Financials ({activeRange === 'FULL_YEAR_YTD' ? 'Full Year YTD' : `${activeRange} 2026`})
          </h3>
        </div>
        <table className="complaints-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px' }}>BILLING CYCLE</th>
              <th style={{ padding: '16px 24px' }}>GROSS COLLECTIONS</th>
              <th style={{ padding: '16px 24px' }}>NET COLLECTIBLE (AFTER 10% INCENTIVE)</th>
              <th style={{ padding: '16px 24px' }}>TOTAL ALLOCATED BUDGET</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>NET VARIANCE</th>
            </tr>
          </thead>
          <tbody>
            {currentFinancialData.rows.map((row, idx) => (
              <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '16px 24px', fontWeight: '500', color: '#334155' }}>{row.cycle}</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(row.gross)}</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(row.net)}</td>
                <td style={{ padding: '16px 24px' }}>{formatCurrency(row.budget)}</td>
                <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '600', color: row.variance >= 0 ? '#166534' : '#991b1b' }}>
                  {row.variance >= 0 ? `+${formatCurrency(row.variance)}` : formatCurrency(row.variance)}
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f0fdf4', fontWeight: '700' }}>
              <td style={{ padding: '16px 24px', color: '#064e3b' }}>
                {activeRange === 'FULL_YEAR_YTD' ? 'YTD Total' : 'Quarterly Total'}
              </td>
              <td style={{ padding: '16px 24px', color: '#064e3b' }}>{formatCurrency(currentFinancialData.total.gross)}</td>
              <td style={{ padding: '16px 24px', color: '#064e3b' }}>{formatCurrency(currentFinancialData.total.net)}</td>
              <td style={{ padding: '16px 24px', color: '#064e3b' }}>{formatCurrency(currentFinancialData.total.budget)}</td>
              <td style={{ padding: '16px 24px', textAlign: 'right', color: currentFinancialData.total.variance >= 0 ? '#166534' : '#991b1b' }}>
                {currentFinancialData.total.variance >= 0 ? `+${formatCurrency(currentFinancialData.total.variance)}` : formatCurrency(currentFinancialData.total.variance)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="table-card" style={{ backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
          <h3 style={{ margin: 0, fontSize: '1rem', color: '#064e3b', fontWeight: '700' }}>Escalated Issues by Category</h3>
        </div>
        <table className="complaints-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', fontSize: '0.75rem', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '16px 24px' }}>COMPLAINT CATEGORY</th>
              <th style={{ padding: '16px 24px' }}>TOTAL ESCALATED</th>
              <th style={{ padding: '16px 24px' }}>RESOLVED (REVERTED TO ADMIN WITH STATUS NOW RESOLVED)</th>
              <th style={{ padding: '16px 24px', textAlign: 'right' }}>CURRENTLY ACTIVE</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#666' }}>Loading category analytics...</td>
              </tr>
            ) : (
              categoriesList.map((cat, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 24px', fontWeight: '600', color: '#334155' }}>{cat.name}</td>
                  <td style={{ padding: '16px 24px' }}>{cat.total}</td>
                  <td style={{ padding: '16px 24px' }}>{cat.resolved}</td>
                  <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: '700', color: cat.active > 0 ? '#d97706' : '#166534' }}>
                    {cat.active}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}