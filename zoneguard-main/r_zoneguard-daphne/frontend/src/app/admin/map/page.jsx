"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import './style.css';

const Icons = {
  dashboard: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>,
  analytics: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>,
  map: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" y1="3" x2="9" y2="21"></line><line x1="15" y1="3" x2="15" y2="21"></line></svg>,
  complaints: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>,
  residents: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>,
  tenant: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>,
  vehicle: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="3"></circle><circle cx="17" cy="17" r="3"></circle><path d="M14 17h-4v-5l-2-3H4"></path><path d="M16 14h2l2-3V8a2 2 0 0 0-2-2H8"></path></svg>,
  settings: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>,
  logout: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
};

const sidebarItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Icons.dashboard },
  { label: 'Analytics', href: '/admin/analytics', icon: Icons.analytics },
  { label: 'Map', href: '/admin/map', active: true, icon: Icons.map },
  { label: 'Complaints', href: '/admin/complaints', icon: Icons.complaints },
  { label: 'Residents', href: '/admin/residents', icon: Icons.residents },
  { label: 'Tenant Management', href: '/admin/tenant-management', icon: Icons.tenant },
  { label: 'Registered Vehicle', href: '/admin/registered-vehicle', icon: Icons.vehicle },
];

const statusColors = {
  resolved: '#65a30d',      // Green
  investigating: '#eab308', // Yellow
  active: '#ef4444',        // Red
  escalated: '#2563eb',     // Blue
  normal: '#86efac'         // Default Light Green
};

// --- ZONE 3 ACCURATE MAPPING DATA (DERIVED FROM NIA-MAP-REAL.PDF) ---
const mapLots = [
  // --- CAMILING STREET RESIDENTS & BLOCKS ---
  { id: 'cam-1', address: 'Blk 9 Lot 1 - Camiling St', status: 'normal', points: '120,80 150,80 150,115 120,115', owner: 'Lew Brian Manuel' },
  { id: 'cam-2', address: 'Blk 9 Lot 2 - Camiling St', status: 'resolved', points: '155,80 185,80 185,115 155,115', owner: 'Thelma Ipac' },
  { id: 'cam-3', address: 'Blk 9 Lot 2A - Camiling St', status: 'normal', points: '190,80 220,80 220,115 190,115', owner: 'BSL Printing' },
  { id: 'cam-4', address: 'Blk 9 Lot 2B - Camiling St', status: 'investigating', points: '225,80 255,80 255,115 225,115', owner: 'BSL Printing' },
  { id: 'cam-5', address: 'Blk 9 Lot 5 - Camiling St', status: 'active', points: '260,80 290,80 290,115 260,115', owner: 'Manuel Peralta' },

  // --- SEPARATE BLOCKS RULE: INDIVIDUAL ADJACENT LOTS (77, 79, 81) ---
  { id: 'panta-77', address: 'House 77 - Pantabangan St', status: 'normal', points: '140,220 170,190 190,210 160,240', owner: 'Jessil Perido[cite: 3]' },
  { id: 'panta-79', address: 'House 79 - Pantabangan St', status: 'resolved', points: '165,245 195,215 215,235 185,265', owner: 'Paolo Paje[cite: 3]' },
  { id: 'panta-81', address: 'House 81 - Pantabangan St', status: 'investigating', points: '190,270 220,240 240,260 210,290', owner: 'Mercy Abranes[cite: 3]' },

  // --- COMBINED/SUBDIVIDED BLOCK RULE: ADJACENT SUB-LOTS (77A, 77B, 77C) ---
  { id: 'cam-sub-77abc', address: '77A, 77B, 77C - Camiling St', status: 'active', points: '320,140 440,140 440,185 320,185', owner: 'Reyna Saycon / Mel Rio Morales', isCombined: true, partitions: 3 },

  // --- AGOS LANE STREET BLOCKS ---
  { id: 'agos-03', address: 'Blk 9 Lot 03 - Agos Lane', status: 'normal', points: '230,340 260,340 260,380 230,380', owner: 'Rene Lucas' },
  { id: 'agos-06', address: 'Blk 9 Lot 06 - Agos Lane', status: 'escalated', points: '265,340 295,340 295,380 265,380', owner: 'Florentino David' },
  { id: 'agos-07', address: 'Blk 9 Lot 07 - Agos Lane', status: 'resolved', points: '300,340 330,340 330,380 300,380', owner: 'Ellen Gabrieles' },

  // --- JALAUR STREET BLOCKS ---
  { id: 'jalaur-01', address: 'Blk 7 Lot 01 - Jalaur St', status: 'normal', points: '420,210 450,230 435,260 405,240', owner: 'Josefina Sumilong' },
  { id: 'jalaur-03', address: 'Blk 7 Lot 03 - Jalaur St', status: 'investigating', points: '455,235 485,255 470,285 440,265', owner: 'Ray Calusin' },
  { id: 'jalaur-04', address: 'Blk 7 Lot 04 - Jalaur St', status: 'active', points: '490,260 520,280 505,310 475,290', owner: 'Anlyn Sebastian' },

  // --- PALICO LANE & CHICO STREET BLOCKS ---
  { id: 'palico-01', address: 'Blk 9 Lot 01 - Palico Lane', status: 'resolved', points: '340,390 370,390 370,425 340,425', owner: 'Normita Abundo' },
  { id: 'chico-28', address: 'Blk 9 Lot 28 - Chico St', status: 'normal', points: '250,470 280,470 280,505 250,505', owner: 'Menchie Into' },
  { id: 'chico-30', address: 'Blk 9 Lot 30A - Chico St', status: 'investigating', points: '285,470 315,470 315,505 285,505', owner: 'Reynaldo / Myrna' }
];

export default function AdminMapPage() {
  const [hoveredLot, setHoveredLot] = useState(null);

  return (
    <div className="layout-wrapper">
      <div className="main-container">
        
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand-header">
            <div className="brand-logo-zg">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            </div>
            <div className="brand-text">
              <strong>ZoneGuard</strong>
              <span>NIA VILLAGE SUBD.</span>
            </div>
          </div>

          <nav className="nav-menu">
            {sidebarItems.map((item) => (
              <Link key={item.label} href={item.href} className={`nav-link ${item.active ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-divider"></div>
            <Link href="/admin/settings" className="nav-link">
              <span className="nav-icon">{Icons.settings}</span>
              Account Settings
            </Link>
            <button className="nav-link btn-logout">
              <span className="nav-icon">{Icons.logout}</span>
              Logout
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="content-area">
          <header className="topbar">
            <div className="search-bar-large">
              <span className="search-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              </span>
              <input type="text" placeholder="Search here..." />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">Admin</span>
                <span className="user-role">ADMINISTRATOR</span>
              </div>
              <div className="user-avatar">AD</div>
            </div>
          </header>

          <div className="map-card">
            
            {/* MAP HEADER */}
            <div className="map-header">
              <h2>NIA Village Zone 3 Map 
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </h2>
              <div className="map-search">
                <input type="text" placeholder="Search Address / Resident" />
                <button>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </button>
              </div>
            </div>

            {/* INTERACTIVE MAP CONTAINER */}
            <div className="map-container">
              
              {/* LEGEND OVERLAY */}
              <div className="map-legend">
                <div className="legend-header">
                  <strong>Legend</strong>
                  <div className="toggle-switch"></div>
                </div>
                <ul className="legend-list">
                  <li><span className="color-box" style={{backgroundColor: statusColors.resolved}}></span> Resolved</li>
                  <li><span className="color-box" style={{backgroundColor: statusColors.investigating}}></span> Investigating</li>
                  <li><span className="color-box" style={{backgroundColor: statusColors.active}}></span> Active</li>
                  <li><span className="color-box" style={{backgroundColor: statusColors.escalated}}></span> Escalated</li>
                </ul>
              </div>

              {/* ZONE TOGGLES OVERLAY */}
              <div className="map-zone-toggles">
                {['ZONE 1', 'ZONE 2', 'ZONE 3', 'ZONE 4', 'ZONE 5', 'ZONE 6'].map(zone => (
                  <button key={zone} className={`zone-pill ${zone === 'ZONE 3' ? 'active' : ''}`}>{zone}</button>
                ))}
              </div>

              {/* SVG MAP DRAWING */}
              <svg className="interactive-svg-map" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
                
                {/* Background Roads matching NIA-MAP-REAL */}
                <g className="map-roads" stroke="#e5e7eb" strokeWidth="18" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="50,150 450,150 650,50" />
                  <text x="300" y="140" fill="#9ca3af" fontSize="12" stroke="none">Camiling Street</text>
                  
                  <polyline points="450,150 580,260 750,260" />
                  <text x="480" y="210" fill="#9ca3af" fontSize="12" stroke="none" transform="rotate(35 480,210)">Jalaur Street</text>

                  <polyline points="230,150 230,350" />
                  <text x="215" y="260" fill="#9ca3af" fontSize="10" stroke="none" transform="rotate(-90 215,260)">Agos Lane</text>

                  <polyline points="330,260 330,420" />
                  <text x="315" y="350" fill="#9ca3af" fontSize="10" stroke="none" transform="rotate(-90 315,350)">Palico Lane</text>

                  <polyline points="100,380 350,520" />
                  <text x="200" y="465" fill="#9ca3af" fontSize="11" stroke="none" transform="rotate(28 200,465)">Chico Street</text>
                </g>

                {/* NIA Chapel Landmark */}
                <g className="landmark-chapel" transform="translate(60, 470)">
                  <circle cx="35" cy="35" r="35" fill="#d1d5db" />
                  <text x="35" y="40" fill="#4b5563" fontSize="11" textAnchor="middle" fontWeight="bold">NIA Chapel</text>
                  <path d="M35 12 v12 M28 18 h14" stroke="#4b5563" strokeWidth="2" />
                </g>

                {/* Render Corrected Lots & Blocks */}
                {mapLots.map((lot) => (
                  <g key={lot.id} 
                     onMouseEnter={() => setHoveredLot(lot)} 
                     onMouseLeave={() => setHoveredLot(null)}
                     className="lot-group">
                    
                    {/* Main Polygon */}
                    <polygon 
                      points={lot.points} 
                      fill={statusColors[lot.status]} 
                      className={`lot-polygon ${hoveredLot?.id === lot.id ? 'hovered' : ''}`}
                    />

                    {/* Subdivision Dividers for Combined Blocks (e.g., 77A, 77B, 77C) */}
                    {lot.isCombined && (
                      <g stroke="#ffffff" strokeWidth="2" opacity="0.8">
                        <line x1="360" y1="140" x2="360" y2="185" />
                        <line x1="400" y1="140" x2="400" y2="185" />
                      </g>
                    )}
                  </g>
                ))}
              </svg>

              {/* HOVER TOOLTIP */}
              {hoveredLot && (
                <div className="map-tooltip">
                  <strong>{hoveredLot.address}</strong>
                  <span>Resident: {hoveredLot.owner}</span>
                  <span className="tooltip-status" style={{color: statusColors[hoveredLot.status]}}>
                    Status: {hoveredLot.status.charAt(0).toUpperCase() + hoveredLot.status.slice(1)}
                  </span>
                </div>
              )}

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}