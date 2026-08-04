import './style.css';

const metrics = [
  {
    label: 'Total Zone Residents',
    value: '187',
    detail: '↑ 8 escalations',
    tone: 'green',
    icon: '◔',
  },
  {
    label: 'Active Escalated Complaints',
    value: '10',
    detail: '2 more than last month',
    tone: 'blue',
    icon: '⚠',
  },
  {
    label: 'Total Gross Collection',
    value: '₱94,000',
    detail: '▲ 20% from past 6 months',
    tone: 'amber',
    icon: '₱',
  },
  {
    label: 'Budget Utilization',
    value: '68.2%',
    detail: 'Target: 75%',
    tone: 'purple',
    icon: '◫',
  },
];

const categories = [
  { name: 'Infrastructure', percent: 47, color: '#92e0ad' },
  { name: 'Grievance', percent: 22, color: '#f6b4ad' },
  { name: 'Public Relations', percent: 16, color: '#9ad0ea' },
  { name: 'Beautification', percent: 8, color: '#c7b7e7' },
  { name: 'Financial', percent: 5, color: '#f0d48c' },
  { name: 'Sport', percent: 2, color: '#f4a5cf' },
];

const activity = [
  {
    title: 'New Escalation: Case F3-0005 transferred from Admin for Director Review',
    time: 'Just now',
    tone: 'danger',
  },
  {
    title: 'Resolved Case G3-0011',
    time: 'Today, 08:45 AM',
    tone: 'neutral',
  },
  {
    title: 'Modified discretionary allocations for “Street Light Repairs” and saved the draft.',
    time: 'Yesterday, 1:38 PM',
    tone: 'neutral',
  },
  {
    title: 'Locked the Monthly Allocation',
    time: 'May 06, 2026, 10:16 AM',
    tone: 'neutral',
  },
];

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
  return (
    <main className="dg-shell">
      <section className="dg-main">
        <header className="dg-topbar">
          <div>
            <h1>Zonal Command Center</h1>
            <span className="dg-zone-pill">ZONE 3</span>
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

        <section className="dg-metrics-grid">
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="dg-content-grid">
          <div className="dg-primary-column">
            <article className="dg-card dg-chart-card">
              <div className="dg-card-heading">
                <div>
                  <h2>Financial Health Trajectory</h2>
                  <p>5-month collection vs. arrears comparison</p>
                </div>
              </div>

              <div className="dg-chart-wrap" aria-label="Financial trend chart">
                <svg viewBox="0 0 800 300" role="img" aria-hidden="true">
                  <defs>
                    <linearGradient id="collectionsLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#7fae8c" />
                      <stop offset="100%" stopColor="#4d8f69" />
                    </linearGradient>
                    <linearGradient id="arrearsLine" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ff8a8a" />
                      <stop offset="100%" stopColor="#e46969" />
                    </linearGradient>
                  </defs>
                  <g className="dg-gridlines">
                    {[50, 110, 170, 230, 290].map((y) => (
                      <line key={y} x1="55" y1={y} x2="760" y2={y} />
                    ))}
                    {[100, 220, 340, 460, 580, 700].map((x) => (
                      <line key={x} x1={x} y1="30" x2={x} y2="260" />
                    ))}
                  </g>
                  <polyline
                    fill="none"
                    stroke="url(#collectionsLine)"
                    strokeWidth="4"
                    points="80,70 190,125 300,165 410,178 520,105 620,70 720,50"
                  />
                  <polyline
                    fill="none"
                    stroke="url(#arrearsLine)"
                    strokeWidth="4"
                    points="80,215 190,175 300,145 410,140 520,185 620,225 720,250"
                  />
                </svg>
                <div className="dg-chart-legend">
                  <span><i className="legend collections" /> Collections</span>
                  <span><i className="legend arrears" /> Arrears</span>
                </div>
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
                <div className="dg-pie-chart" style={{ background: 'conic-gradient(#92e0ad 0% 47%, #f6b4ad 47% 69%, #9ad0ea 69% 85%, #c7b7e7 85% 93%, #f0d48c 93% 98%, #f4a5cf 98% 100%)' }} />
                <div className="dg-pie-legend">
                  {categories.map((category) => (
                    <div key={category.name} className="dg-pie-legend-row">
                      <span className="dg-pie-swatch" style={{ backgroundColor: category.color }} />
                      <span>{category.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          </div>

          <aside className="dg-side-column">
            <article className="dg-card dg-financial-overview">
              <div className="dg-side-card-header">
                <h3>Financial Overview</h3>
                <span className="dg-locked-pill">LOCKED</span>
              </div>
              <div className="dg-budget-line">
                <div>
                  <span>Budget Allocated</span>
                  <strong>₱74,500</strong>
                </div>
              </div>
              <div className="dg-budget-line muted">
                <div>
                  <span>Actual Spend</span>
                  <strong>₱46,890</strong>
                </div>
              </div>
              <button type="button" className="dg-primary-button">Generate Financial Report</button>
            </article>

            <article className="dg-card dg-activity-card">
              <div className="dg-side-card-header">
                <h3>Your Activity Log</h3>
                <span className="dg-dots">⋮</span>
              </div>
              <div className="dg-activity-list">
                {activity.map((item) => (
                  <div key={item.title} className={`dg-activity-item tone-${item.tone}`}>
                    <div className="dg-activity-badge">!</div>
                    <div>
                      <p>{item.title}</p>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" className="dg-ghost-button">View Full Director History</button>
            </article>
          </aside>
        </section>
      </section>
    </main>
  );
}