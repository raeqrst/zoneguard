'use client';

import Link from 'next/link';
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
  );
}

function PieChartCard({ issueCategories = [] }) {
  if (!issueCategories || issueCategories.length === 0) return null;

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
      <div className="card-header-row">
        <div>
          <h2>Issue Categorization</h2>
          <p>Monthly volume of recorded complaints by category classification.</p>
        </div>
        <Link href="/admin/analytics#issue-categorization" className="engine-pill">
          R Analytics
        </Link>
      </div>

      <div className="ad-pie-layout">
        <div className="ad-pie-chart" style={{ background: `conic-gradient(${gradients})` }} />
        <div className="ad-pie-legend">
          {issueCategories.map((item) => (
            <div key={item.label} className="ad-legend-row">
              <span className="ad-legend-swatch" style={{ backgroundColor: item.color }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
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
          R Analytics
        </Link>
      </div>

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
  );
}

function TurnoverCard({ turnoverData = [] }) {
  if (!turnoverData || turnoverData.length === 0) return null;

  const maxValue = Math.max(...turnoverData.map((item) => Math.max(item.moveIn, item.moveOut)));

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
        <div className="page-title-section">
          <h1>Admin Dashboard</h1>
          <p>Operational overview for approvals, complaints, payments, and resident activity.</p>
        </div>

        <div className="action-buttons">
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
  );
}