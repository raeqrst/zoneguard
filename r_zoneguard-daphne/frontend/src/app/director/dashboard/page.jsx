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
  lock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  ),
  unlock: (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 3.999-3.999V7" />
    </svg>
  ),
  x: (
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
  chart: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  history: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </svg>
  ),
  download: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
};

const formatRelativeTime = (dateInput) => {
  if (!dateInput) return 'Unknown time';
  const date = new Date(dateInput);
  const now = new Date();
  
  const diffInSeconds = Math.floor((now - date) / 1000);
  if (diffInSeconds < 60) return 'Just now'; 
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mins ago`;

  const isToday = date.getDate() === now.getDate() && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = date.getDate() === yesterday.getDate() && date.getMonth() === yesterday.getMonth() && date.getFullYear() === yesterday.getFullYear();

  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

  if (isToday) return `Today, ${timeStr}`;
  if (isYesterday) return `Yesterday, ${timeStr}`;
  return date.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) + `, ${timeStr}`;
};

<<<<<<< HEAD
const chartData = [
  { month: 'FEB', budget: 65, varianceNode: '50%' },
  { month: 'MAR', budget: 75, varianceNode: '40%' },
  { month: 'APR', budget: 55, varianceNode: '60%' },
  { month: 'MAY', budget: 88, varianceNode: '20%' },
  { month: 'JUN', budget: 72, varianceNode: '45%' },
];

=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
const API_BASE = 'http://localhost:5000/api';

function MetricCard({ icon, label, value, detail, tone }) {
  return (
    <article className={`dg-metric-card tone-${tone}`}>
      <div className="dg-metric-icon">{icon}</div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <span>{detail}</span>
      </div>
    </article>
  );
}

export default function DirectorPage() {
  const currentDateFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

<<<<<<< HEAD
=======
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);
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

  const [chartData, setChartData] = useState([
    { month: 'FEB', budget: 0, varianceNode: '0' },
    { month: 'MAR', budget: 0, varianceNode: '0' },
    { month: 'APR', budget: 0, varianceNode: '0' },
    { month: 'MAY', budget: 0, varianceNode: '0' },
    { month: 'JUN', budget: 0, varianceNode: '0' },
  ]);

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const [dashboardMetrics, setDashboardMetrics] = useState([
    { label: 'Total Zone Residents', value: '...', detail: 'Loading...', tone: 'green', icon: '◔' },
    { label: 'Active Escalated Complaints', value: '...', detail: 'Loading...', tone: 'blue', icon: '⚠' },
    { label: 'Total Gross Collection', value: '...', detail: 'Loading...', tone: 'amber', icon: '₱' },
    { label: 'Budget Utilization', value: '...', detail: 'Target: 75%', tone: 'purple', icon: '◫' },
  ]);

<<<<<<< HEAD
  const [financialOverview, setFinancialOverview] = useState({ allocated: 74500, spent: 46890 });
=======
  const [financialOverview, setFinancialOverview] = useState({ allocated: 0, spent: 0 });
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  
  const [isLocked, setIsLocked] = useState(true);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
<<<<<<< HEAD
  const [tempBudget, setTempBudget] = useState(74500);
  
  const [hoveredChartIndex, setHoveredChartIndex] = useState(null);

  // Modal States
=======
  const [tempBudget, setTempBudget] = useState(0);

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState('2026-01-31');
  
  const [reportScopes, setReportScopes] = useState({
    gross: true,
    collector: false,
    mandatory: false,
    net: false
  });

  const [activityLogs, setActivityLogs] = useState([]);
  const [categories, setCategories] = useState([
    { name: 'Infrastructure', percent: 47, color: '#92e0ad' },
    { name: 'Grievance', percent: 22, color: '#f6b4ad' },
    { name: 'Public Relations', percent: 16, color: '#9ad0ea' },
    { name: 'Beautification', percent: 8, color: '#c7b7e7' },
    { name: 'Financial', percent: 5, color: '#f0d48c' },
    { name: 'Sport', percent: 2, color: '#f4a5cf' },
  ]);

<<<<<<< HEAD
  // HELPER: Safely push new logs to state and local storage so they persist
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
  const addActivityLog = (title, tone) => {
    const newLog = {
      title,
      rawTime: new Date().toISOString(),
      tone
    };

    setActivityLogs(prevLogs => {
<<<<<<< HEAD
      // Re-format times just in case
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      const allLogs = [newLog, ...prevLogs].map(log => ({
        ...log,
        time: formatRelativeTime(log.rawTime)
      }));
      
<<<<<<< HEAD
      const slicedLogs = allLogs.slice(0, 4); // Keep recent 4
      
      // Save newly appended action to localStorage
=======
      const slicedLogs = allLogs.slice(0, 4);
      
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      const rawStorageLogs = JSON.parse(localStorage.getItem('zone3_local_logs') || '[]');
      localStorage.setItem('zone3_local_logs', JSON.stringify([newLog, ...rawStorageLogs]));
      
      return slicedLogs;
    });
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const safeFetch = async (endpoint) => {
          try {
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (!res.ok) return {};
            return await res.json();
          } catch (err) {
            return {};
          }
        };

<<<<<<< HEAD
        const [compData, transData, resData, auditData] = await Promise.all([
          safeFetch('/complaints'),
          safeFetch('/transactions'),
          safeFetch('/residents'),
          safeFetch('/audit-logs')
=======
        const token = localStorage.getItem('token');
        const safeFetchAuth = async (endpoint) => {
          try {
            const res = await fetch(`${API_BASE}${endpoint}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) return {};
            return await res.json();
          } catch (err) {
            return {};
          }
        };

        const [compData, transData, resData, auditData, finData] = await Promise.all([
          safeFetch('/complaints'),
          safeFetch('/transactions'),
          safeFetch('/residents'),
          safeFetch('/audit-logs'),
          safeFetchAuth('/financials') 
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        ]);

        const complaints = Array.isArray(compData?.complaints) ? compData.complaints : (Array.isArray(compData) ? compData : []);
        const transactions = Array.isArray(transData?.transactions) ? transData.transactions : (Array.isArray(transData) ? transData : []);
        const residents = Array.isArray(resData?.residents) ? resData.residents : (Array.isArray(resData?.users) ? resData.users : (Array.isArray(resData) ? resData : []));
        const rawLogs = Array.isArray(auditData?.logs) ? auditData.logs : (Array.isArray(auditData) ? auditData : []);

        const totalResidents = residents.length > 0 ? residents.length : 187;

        let activeEscalated = 0;
        let totalEscalatedForPie = 0;
        const categoryCounts = {};

        complaints.forEach((c) => {
          const status = (c.status || '').toLowerCase();
          const isEscalated = status === 'escalated' || c.assignedDirectorId || c.assigned_director_id;

          if (isEscalated) {
            if (status !== 'resolved') activeEscalated++;
            let catName = c.categoryRaw || c.category || 'General';
            catName = catName.replace(/_/g, ' ').toLowerCase();
            catName = catName.charAt(0).toUpperCase() + catName.slice(1);
            categoryCounts[catName] = (categoryCounts[catName] || 0) + 1;
            totalEscalatedForPie++;
          }
        });

        let grossCollection = 0;
<<<<<<< HEAD
        let actualSpend = 0;

=======
        if (finData && finData.success && finData.monthlyTotals) {
          grossCollection = finData.monthlyTotals.reduce((sum, val) => sum + Number(val || 0), 0);
        } else if (transactions.length > 0) {
          transactions.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (t.type !== 'expense' && amt >= 0) grossCollection += amt;
          });
        }

        const currentMonthIndex = new Date().getMonth();
        const initialDbBudget = (finData?.monthlyBudgets || Array(12).fill(0))[currentMonthIndex] || 70000;
        const savedBudget = localStorage.getItem('zone3_budget');
        const budgetAllocated = savedBudget ? Number(savedBudget) : initialDbBudget;
        
        let actualSpend = budgetAllocated * 0.65; 
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        if (transactions.length > 0) {
          transactions.forEach(t => {
            const amt = Number(t.amount) || 0;
            if (t.type === 'expense' || amt < 0) {
              actualSpend += Math.abs(amt);
<<<<<<< HEAD
            } else {
              grossCollection += amt;
            }
          });
        } else {
          grossCollection = 94000;
          actualSpend = 66890; 
        }

        const savedBudget = localStorage.getItem('zone3_budget');
        const budgetAllocated = savedBudget ? Number(savedBudget) : 75000;
        
        setFinancialOverview({ allocated: budgetAllocated, spent: actualSpend });
        setTempBudget(budgetAllocated);

        const budgetUtil = ((actualSpend / budgetAllocated) * 100).toFixed(1);
=======
            }
          });
        }

        setFinancialOverview({ allocated: budgetAllocated, spent: actualSpend });
        setTempBudget(budgetAllocated);

        const budgetUtil = budgetAllocated > 0 ? ((actualSpend / budgetAllocated) * 100).toFixed(1) : '0.0';
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

        setDashboardMetrics([
          { label: 'Total Zone Residents', value: totalResidents.toString(), detail: residents.length > 0 ? 'Live database count' : '↑ 8 escalations', tone: 'green', icon: '◔' },
          { label: 'Active Escalated Complaints', value: activeEscalated.toString(), detail: 'Requires director review', tone: 'blue', icon: '⚠' },
          { label: 'Total Gross Collection', value: `₱${grossCollection.toLocaleString('en-US', { minimumFractionDigits: 0 })}`, detail: 'Aggregated from transactions', tone: 'amber', icon: '₱' },
          { label: 'Budget Utilization', value: `${budgetUtil}%`, detail: 'Target: 75%', tone: 'purple', icon: '◫' }
        ]);

        if (totalEscalatedForPie > 0) {
          const colorMap = { 'Infrastructure': '#92e0ad', 'Grievance': '#f6b4ad', 'Public relations': '#9ad0ea', 'Beautification': '#c7b7e7', 'Financial': '#f0d48c', 'Sport': '#f4a5cf', 'General': '#cbd5e1' };
          const dynamicCategories = Object.entries(categoryCounts).map(([name, count]) => {
            let assignedColor = '#cbd5e1';
            Object.keys(colorMap).forEach(key => { if (name.toLowerCase().includes(key.toLowerCase())) assignedColor = colorMap[key]; });
            return { name, percent: Math.round((count / totalEscalatedForPie) * 100), color: assignedColor };
          }).sort((a, b) => b.percent - a.percent);
          setCategories(dynamicCategories);
        }

<<<<<<< HEAD
        // Generate a fallback time (1 day ago) so missing DB dates don't constantly show up as "Just now"
=======
        if (finData && finData.success) {
          const monthsLabel = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
          const dynamicChartData = [];
          
          const relevantBudgets = (finData.monthlyBudgets || Array(12).fill(0)).slice(1, 6);
          const highestBudget = Math.max(...relevantBudgets, 10000);

          for (let i = 1; i <= 5; i++) {
            const gross = (finData.monthlyTotals || Array(12).fill(0))[i] || 0;
            const allocated = (finData.monthlyBudgets || Array(12).fill(0))[i] || 0;
            const net = gross * 0.90;
            const variance = net - allocated;

            const barHeight = allocated > 0 ? Math.min(Math.round((allocated / highestBudget) * 100), 100) : 0;

            dynamicChartData.push({
              month: monthsLabel[i],
              budget: barHeight,
              varianceNode: variance >= 0 
                ? `+₱${variance.toLocaleString('en-US', { minimumFractionDigits: 0 })}` 
                : `-₱${Math.abs(variance).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
            });
          }
          setChartData(dynamicChartData);

          const dbAllocatedBudget = (finData.monthlyBudgets || Array(12).fill(0))[currentMonthIndex];
          if (dbAllocatedBudget > 0 && !savedBudget) {
            setFinancialOverview(prev => ({ ...prev, allocated: dbAllocatedBudget, spent: dbAllocatedBudget * 0.65 }));
            setTempBudget(dbAllocatedBudget);
          }
        } 

>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
        const fakePastDate = new Date();
        fakePastDate.setDate(fakePastDate.getDate() - 1); 

        const complaintLogs = complaints
          .filter(c => {
            const status = (c.status || '').toLowerCase();
            return status === 'escalated' || status === 'resolved';
          })
          .map((c, index) => {
            const isEscalated = (c.status || '').toLowerCase() === 'escalated';
            const caseId = c.id || c.trackingId || 'N/A';
            
<<<<<<< HEAD
            // Stagger missing timestamps backwards so they don't block recent actions
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            const staggeredDate = new Date(fakePastDate);
            staggeredDate.setMinutes(staggeredDate.getMinutes() - (index * 30));

            return {
              title: isEscalated ? `New Escalation: Case ${caseId} transferred from Admin for Director Review` : `Resolved Case ${caseId}`,
              rawTime: c.updated_at || c.created_at || staggeredDate.toISOString(),
              tone: isEscalated ? 'danger' : 'neutral'
            };
          });

        const backendAuditLogs = rawLogs.map((log, index) => {
          const logAction = (log.action || log.description || '').toLowerCase();
          let assignedTone = 'neutral';
          if (logAction.includes('escalat') || logAction.includes('transfer') || logAction.includes('error')) assignedTone = 'danger';
          
          const staggeredDate = new Date(fakePastDate);
          staggeredDate.setMinutes(staggeredDate.getMinutes() - (index * 30));
          
          return { 
            title: log.action || log.description || 'System Activity Recorded', 
            rawTime: log.created_at || log.timestamp || staggeredDate.toISOString(), 
            tone: assignedTone 
          };
        });

        const localLogsData = localStorage.getItem('zone3_local_logs');
        const localLogs = localLogsData ? JSON.parse(localLogsData) : [];

        let combinedLogs = [...localLogs, ...backendAuditLogs, ...complaintLogs]
          .sort((a, b) => new Date(b.rawTime) - new Date(a.rawTime));

        if (combinedLogs.length === 0) {
          combinedLogs = [
<<<<<<< HEAD
            { title: 'Budget allocation successfully updated to ₱75,000 by Director.', rawTime: new Date(Date.now() - 300000).toISOString(), tone: 'neutral' },
=======
            { title: 'Budget allocation successfully updated by Director.', rawTime: new Date(Date.now() - 300000).toISOString(), tone: 'neutral' },
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
            { title: 'Resolved Case F3-0060', rawTime: new Date(Date.now() - 360000).toISOString(), tone: 'neutral' },
            { title: 'Resolved Case P3-0059', rawTime: new Date(Date.now() - 420000).toISOString(), tone: 'neutral' },
            { title: 'Resolved Case S3-0058', rawTime: new Date(Date.now() - 480000).toISOString(), tone: 'neutral' }
          ];
        }

        const finalLogs = combinedLogs.slice(0, 4).map(log => ({
          ...log,
          time: formatRelativeTime(log.rawTime)
        }));

        setActivityLogs(finalLogs);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      }
    };

    fetchDashboardData();
<<<<<<< HEAD
  }, []); 
=======
  }, []);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

  const generateConicGradient = () => {
    let cumulative = 0;
    const gradientStops = categories.map((cat) => {
      const start = cumulative;
      cumulative += cat.percent;
      return `${cat.color} ${start}% ${cumulative}%`;
    });
    if (cumulative < 100 && gradientStops.length > 0) {
      const lastCat = categories[categories.length - 1];
      gradientStops[gradientStops.length - 1] = `${lastCat.color} ${cumulative - lastCat.percent}% 100%`;
    }
    return `conic-gradient(${gradientStops.join(', ')})`;
  };

  const handleLockToggle = async () => {
    if (isLocked) {
      setShowPasswordPrompt(true);
    } else {
      const newBudget = Number(tempBudget);
      setFinancialOverview(prev => ({ ...prev, allocated: newBudget }));
      setIsLocked(true);
      
      localStorage.setItem('zone3_budget', newBudget.toString());
      
<<<<<<< HEAD
      // Utilize helper function to correctly append the log
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
      addActivityLog(`Budget allocation successfully updated to ₱${newBudget.toLocaleString('en-US')} by Director.`, 'neutral');
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === '123zone3dir@zoneguard') {
      setIsLocked(false);
      setShowPasswordPrompt(false);
      setPasswordInput('');
    } else {
      alert('Incorrect password. Please try again.');
    }
  };

  const handleScopeToggle = (scopeKey) => {
    setReportScopes(prev => ({ ...prev, [scopeKey]: !prev[scopeKey] }));
  };

  const handleDownloadCSV = () => {
    let csvContent = "Date,Description,Category,Type,Amount (PHP)\n";
    const rows = [];
    
    const reportDate = startDate || new Date().toISOString().split('T')[0];
<<<<<<< HEAD

    if (reportScopes.gross) {
      rows.push(`${reportDate},Monthly Association Dues,Collection,Income,54000.00`);
      rows.push(`${reportDate},Arrears Recovery Payments,Collection,Income,40000.00`);
    }
    if (reportScopes.collector) {
      rows.push(`${reportDate},Collector Incentive Audit (10% of Gross),Incentive,Expense,-9400.00`);
    }
    if (reportScopes.mandatory) {
      rows.push(`${reportDate},Security Agency Guard Fees,Mandatory,Expense,-30000.00`);
      rows.push(`${reportDate},Garbage Collection Retainer,Mandatory,Expense,-12000.00`);
      rows.push(`${reportDate},Street Light Bulb Replacement,Discretionary,Expense,-4890.00`);
    }
    if (reportScopes.net) {
      rows.push(`${reportDate},Net Zonal Operational Fund Variance,Summary,Net Balance,47110.00`);
=======
    const formattedGross = financialOverview.allocated ? (financialOverview.allocated * 1.1).toFixed(2) : "0.00";
    const formattedIncentive = financialOverview.allocated ? (financialOverview.allocated * 0.1).toFixed(2) : "0.00";
    const formattedSpend = financialOverview.spent.toFixed(2);
    const netVariance = (Number(formattedGross) - Number(formattedIncentive) - Number(formattedSpend)).toFixed(2);

    if (reportScopes.gross) {
      rows.push(`${reportDate},Aggregated Zonal Gross Collections,Collection,Income,${formattedGross}`);
    }
    if (reportScopes.collector) {
      rows.push(`${reportDate},Collector Incentive Audit (10% Deduction),Incentive,Expense,-${formattedIncentive}`);
    }
    if (reportScopes.mandatory) {
      rows.push(`${reportDate},Recorded Zonal Operational Spend,Operational,Expense,-${formattedSpend}`);
    }
    if (reportScopes.net) {
      rows.push(`${reportDate},Net Zonal Operational Fund Variance,Summary,Net Balance,${netVariance}`);
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    }
    if (rows.length === 0) {
      rows.push(`${reportDate},No report scope selected,N/A,N/A,0.00`);
    }

    csvContent += rows.join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    
<<<<<<< HEAD
    // Convert 'six_months' to 'Six Months' for the file name
=======
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
    const prettyPeriod = selectedPeriod.replace('_', ' '); 
    link.setAttribute("download", `Zonal_Financial_Audit_${prettyPeriod}_Zone3.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

<<<<<<< HEAD
    // Save Download Action to Logs
    addActivityLog(`Generated and downloaded Financial CSV Report (${prettyPeriod}).`, 'neutral');
=======
    addActivityLog(`Generated and downloaded dynamic Financial CSV Report (${prettyPeriod}).`, 'neutral');
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

    setIsReportModalOpen(false);
  };

  const assumedMaxBudgetTarget = 100000; 
  const allocatedPercent = Math.min((financialOverview.allocated / assumedMaxBudgetTarget) * 100, 100);
  const spentPercent = Math.min((financialOverview.spent / assumedMaxBudgetTarget) * 100, 100);

  return (
    <main className="dg-shell">
      <section className="dg-main">
<<<<<<< HEAD
        <header className="dg-topbar">
          <div>
            <h1>Zonal Command Center</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span className="dg-zone-pill">ZONE 3</span>
              <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{currentDateFormatted}</span>
            </div>
          </div>

          <div className="dg-topbar-right">
            <label className="dg-search">
              <span>⌕</span>
              <input type="text" placeholder="Search here..." aria-label="Search" />
            </label>
            <div className="dg-user">
              <div>
                <strong>Dir. Del Rosario</strong>
                <p>ZONE 3 DIRECTOR</p>
              </div>
              <span>DR</span>
            </div>
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

        {/* Page Title & Sub-header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: '#064e3b', margin: '0 0 6px 0' }}>Zonal Command Center</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="dg-zone-pill" style={{ backgroundColor: '#064e3b', color: '#fff', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '700' }}>ZONE 3</span>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>{currentDateFormatted}</span>
          </div>
        </div>
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f

        <section className="dg-metrics-grid">
          {dashboardMetrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="dg-content-grid">
          <div className="dg-primary-column">
            
            <article className="dg-card dg-chart-card">
              <div className="dg-card-heading" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px' }}>
                <div>
                  <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>
                    Budget Allocation vs. Net Variance Trend
                  </h2>
                  <p>5-Month Comparative Analysis (Q1-Q2 2026)</p>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', fontWeight: '600', color: '#374151' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '12px', height: '12px', background: '#bbf7d0', borderRadius: '3px', display: 'inline-block' }}></span>
                    Allocated Budget
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '16px', height: '2px', background: '#166534', display: 'inline-block', position: 'relative' }}>
                      <span style={{ width: '6px', height: '6px', background: '#166534', borderRadius: '50%', position: 'absolute', top: '-2px', left: '5px' }}></span>
                    </span>
                    Net Variance
                  </div>
                </div>
              </div>

              <div style={{ position: 'relative', height: '220px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', padding: '10px 0', borderBottom: '1px solid #e2e8f0', marginTop: '8px' }}>
                
                <div style={{ position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', pointerEvents: 'none', padding: '10px 0', zIndex: 1 }}>
                  <div style={{ borderBottom: '1px dashed #e2e8f0', width: '100%', height: '100%' }}></div>
                  <div style={{ borderBottom: '1px dashed #e2e8f0', width: '100%', height: '100%' }}></div>
                  <div style={{ borderBottom: '1px dashed #e2e8f0', width: '100%', height: '100%' }}></div>
                </div>

                <svg style={{ position: 'absolute', inset: '0', width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 5 }} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="#166534"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                    points="10,50 30,40 50,60 70,20 90,45"
                  />
                </svg>

                <div style={{ position: 'absolute', inset: '0', zIndex: 20, display: 'flex' }}>
                  {chartData.map((item, index) => (
                    <div 
                      key={`hover-zone-${index}`}
                      style={{ flex: 1, position: 'relative', cursor: 'crosshair' }}
                      onMouseEnter={() => setHoveredChartIndex(index)}
                      onMouseLeave={() => setHoveredChartIndex(null)}
                    >
                      {hoveredChartIndex === index && (
                        <div style={{
                          position: 'absolute', top: '10px', left: '50%', transform: 'translateX(-50%)',
                          backgroundColor: '#1e293b', color: '#f8fafc', padding: '8px 12px',
                          borderRadius: '8px', fontSize: '0.75rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
                          zIndex: 50, pointerEvents: 'none', display: 'flex', flexDirection: 'column',
                          gap: '6px', minWidth: '110px'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ color: '#94a3b8' }}>Budget:</span>
                            <span style={{ fontWeight: 'bold' }}>{item.budget}%</span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                            <span style={{ color: '#94a3b8' }}>Variance:</span>
                            <span style={{ fontWeight: 'bold', color: '#86efac' }}>{item.varianceNode}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {[
                  { x: '10%', y: '50%' },
                  { x: '30%', y: '40%' },
                  { x: '50%', y: '60%' },
                  { x: '70%', y: '20%' },
                  { x: '90%', y: '45%' },
                ].map((pt, index) => {
                  const isHovered = hoveredChartIndex === index;
                  return (
                    <div key={`dot-${index}`} style={{ 
                      position: 'absolute', left: pt.x, top: pt.y, 
                      width: isHovered ? '14px' : '10px', height: isHovered ? '14px' : '10px', 
                      background: '#166534', border: '2px solid #fff', borderRadius: '50%', 
                      transform: 'translate(-50%, -50%)', zIndex: 10, transition: 'all 0.2s ease',
                      boxShadow: isHovered ? '0 0 0 4px rgba(22, 101, 52, 0.2)' : 'none'
                    }}></div>
                  );
                })}

                {chartData.map((item, index) => {
                  const isHovered = hoveredChartIndex === index;
                  return (
                    <div key={`bar-${index}`} style={{ width: '10%', height: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 2, pointerEvents: 'none' }}>
                      <div 
                        style={{ 
                          width: '38px', height: `${item.budget}%`, 
                          backgroundColor: isHovered ? '#86efac' : '#bbf7d0', 
                          borderRadius: '4px 4px 0 0', transition: 'all 0.2s ease'
                        }} 
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '12px', fontSize: '0.75rem', fontWeight: '700', color: '#64748b' }}>
                {chartData.map((item, index) => (
                  <span key={index} style={{ width: '10%', textAlign: 'center' }}>{item.month}</span>
                ))}
              </div>
            </article>

            <article className="dg-card dg-category-card">
              <div className="dg-card-heading compact">
                <div>
                  <h2>Issue Categorization</h2>
                  <p>Monthly volume of recorded escalated complaints by category classification.</p>
                </div>
              </div>
              <div className="dg-pie-layout" aria-label="Issue categorization pie chart">
                <div className="dg-pie-chart" style={{ background: generateConicGradient() }} />
                
                <div className="dg-pie-legend">
                  {categories.map((category) => (
                    <div key={category.name} className="dg-pie-legend-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="dg-pie-swatch" style={{ backgroundColor: category.color }} />
                        <span>{category.name}</span>
                      </div>
                      <strong style={{ fontSize: '0.9rem', color: '#374151' }}>{category.percent}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <aside className="dg-side-column">
            
            <article className="dg-card" style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#064e3b', fontSize: '1.1rem', fontWeight: '700' }}>Financial Overview</h3>
                
                <button 
                  onClick={handleLockToggle}
                  style={{ 
                    backgroundColor: isLocked ? '#064e3b' : '#ca8a04', 
                    color: '#fff', fontSize: '0.75rem', fontWeight: '700', padding: '4px 10px', 
                    borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '4px',
                    border: 'none', cursor: 'pointer', transition: 'background 0.2s'
                  }}
                >
                  {isLocked ? Icons.lock : Icons.unlock}
                  {isLocked ? 'LOCKED' : 'SAVE BUDGET'}
                </button>
              </div>

              {showPasswordPrompt && (
                <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '20px', padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <input 
                    type="password" 
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="Enter director pass..."
                    autoFocus
                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #94a3b8', fontSize: '0.85rem' }}
                  />
                  <button type="submit" style={{ padding: '8px 12px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: '600', cursor: 'pointer' }}>
                    Unlock
                  </button>
                </form>
              )}

              <div style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <span style={{ color: '#4b5563', fontSize: '0.85rem', fontWeight: '600' }}>Budget Allocated</span>
                  
                  {isLocked ? (
                    <strong style={{ color: '#111827', fontSize: '0.95rem', fontWeight: '800' }}>
                      ₱{financialOverview.allocated.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                    </strong>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '2px 8px' }}>
                      <span style={{ fontWeight: '800', color: '#064e3b', marginRight: '4px' }}>₱</span>
                      <input 
                        type="number" 
                        value={tempBudget} 
                        onChange={(e) => setTempBudget(e.target.value)}
                        style={{ width: '80px', border: 'none', background: 'transparent', fontWeight: '800', fontSize: '0.95rem', textAlign: 'right', outline: 'none' }} 
                      />
                    </div>
                  )}
                </div>
                <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '14px', borderRadius: '10px' }}>
                  <div style={{ width: `${allocatedPercent}%`, height: '100%', backgroundColor: '#52a88a', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '8px' }}>
                  <span style={{ color: '#4b5563', fontSize: '0.85rem', fontWeight: '600' }}>Actual Spend</span>
                  <strong style={{ color: '#111827', fontSize: '0.95rem', fontWeight: '800' }}>₱{financialOverview.spent.toLocaleString('en-US', { minimumFractionDigits: 0 })}</strong>
                </div>
                <div style={{ width: '100%', backgroundColor: '#f1f5f9', height: '14px', borderRadius: '10px' }}>
                  <div style={{ width: `${spentPercent}%`, height: '100%', backgroundColor: '#bbf7d0', borderRadius: '10px', transition: 'width 0.5s ease-out' }}></div>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setIsReportModalOpen(true)}
                style={{ width: '100%', padding: '14px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: 'background 0.2s ease' }}
              >
                Generate Financial Report
              </button>
            </article>

            <article className="dg-card dg-activity-card" style={{ marginTop: '24px' }}>
              <div className="dg-side-card-header">
                <h3>Your Activity Log</h3>
                <span className="dg-dots">⋮</span>
              </div>
              <div className="dg-activity-list">
                {activityLogs.length === 0 ? (
                  <div style={{ padding: '20px 10px', textAlign: 'center', color: '#6b7280', fontSize: '0.85rem' }}>
                    No recent activity found.
                  </div>
                ) : (
                  activityLogs.map((item, index) => (
                    <div key={index} className={`dg-activity-item tone-${item.tone}`}>
                      <div className="dg-activity-badge">!</div>
                      <div>
                        <p>{item.title}</p>
                        <span>{item.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <button type="button" className="dg-ghost-button">View Full Director History</button>
            </article>
          </aside>
        </section>
      </section>

      {/* GENERATE FINANCIAL REPORT MODAL */}
      {isReportModalOpen && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.4)',
          zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            display: 'flex', flexDirection: 'column', maxHeight: '90vh', overflow: 'hidden', fontFamily: 'inherit'
          }}>
            
            <div style={{ padding: '32px 32px 24px 32px', position: 'relative' }}>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                {Icons.x}
              </button>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: '700', color: '#064e3b' }}>
                Generate Zonal Financial Audit Report
              </h2>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                Configure parameters for NIA Village Zone 3 fiscal oversight.
              </p>
            </div>

            <div style={{ padding: '0 32px 24px 32px', overflowY: 'auto' }}>
              
              <div style={{ marginBottom: '32px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                  <button 
                    onClick={() => setSelectedPeriod('current')}
                    style={{ 
                      padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                      border: selectedPeriod === 'current' ? '2px solid #064e3b' : '1px solid #e2e8f0',
                      backgroundColor: selectedPeriod === 'current' ? '#f0fdf4' : '#fff',
                      color: selectedPeriod === 'current' ? '#064e3b' : '#475569'
                    }}
                  >
                    {Icons.calendar} Current Month
                  </button>
                  <button 
                    onClick={() => setSelectedPeriod('quarter')}
                    style={{ 
                      padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                      border: selectedPeriod === 'quarter' ? '2px solid #064e3b' : '1px solid #e2e8f0',
                      backgroundColor: selectedPeriod === 'quarter' ? '#f0fdf4' : '#fff',
                      color: selectedPeriod === 'quarter' ? '#064e3b' : '#475569'
                    }}
                  >
                    {Icons.chart} Last Quarter
                  </button>
                  <button 
                    onClick={() => setSelectedPeriod('six_months')}
                    style={{ 
                      padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                      border: selectedPeriod === 'six_months' ? '2px solid #064e3b' : '1px solid #e2e8f0',
                      backgroundColor: selectedPeriod === 'six_months' ? '#f0fdf4' : '#fff',
                      color: selectedPeriod === 'six_months' ? '#064e3b' : '#475569',
                      gridColumn: '1 / -1' 
                    }}
                  >
                    {Icons.history} Last 6 Months
                  </button>
                </div>

                <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#334155' }}>Custom Date Range</span>
                    <span style={{ color: '#64748b' }}>{Icons.calendar}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px', letterSpacing: '0.05em' }}>START DATE</label>
                      <input 
                        type="date" 
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#334155', fontFamily: 'inherit' }} 
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px', letterSpacing: '0.05em' }}>END DATE</label>
                      <input 
                        type="date" 
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', color: '#334155', fontFamily: 'inherit' }} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.75rem', fontWeight: '700', color: '#064e3b', letterSpacing: '0.05em', marginBottom: '16px' }}>
                  REPORT SCOPE
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { id: 'gross', label: 'Gross Collections Breakdown' },
                    { id: 'collector', label: 'Collector Incentive Audit (10%)' },
                    { id: 'mandatory', label: 'Mandatory vs Discretionary Spend' },
                    { id: 'net', label: 'Net Zonal Operational Fund Variance' }
                  ].map(scope => (
                    <label 
                      key={scope.id}
                      style={{ 
                        display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', 
                        border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: reportScopes[scope.id] ? '#f8fafc' : '#fff',
                        transition: 'background 0.2s'
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={reportScopes[scope.id]}
                        onChange={() => handleScopeToggle(scope.id)}
                        style={{ width: '18px', height: '18px', accentColor: '#064e3b', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#334155' }}>
                        {scope.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </div>

            <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center' }}>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#64748b', fontWeight: '600', fontSize: '0.9rem', cursor: 'pointer', padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDownloadCSV}
                style={{ backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '8px', padding: '12px 20px', fontWeight: '700', fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {Icons.download} Download CSV Ledger
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}