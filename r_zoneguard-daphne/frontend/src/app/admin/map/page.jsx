"use client";
import React, { useState } from 'react';
import './style.css';

const statusColors = {
  resolved: '#65a30d',      // Green
  investigating: '#eab308', // Yellow
  active: '#ef4444',        // Red
  escalated: '#2563eb',     // Blue
  normal: '#86efac'         // Default Light Green
};

// --- ZONE 3 ACCURATE MAPPING DATA ---
const mapLots = [
  { id: 'cam-1', address: 'Blk 9 Lot 1 - Camiling St', status: 'normal', points: '120,80 150,80 150,115 120,115', owner: 'Lew Brian Manuel' },
  { id: 'cam-2', address: 'Blk 9 Lot 2 - Camiling St', status: 'resolved', points: '155,80 185,80 185,115 155,115', owner: 'Thelma Ipac' },
  { id: 'cam-3', address: 'Blk 9 Lot 2A - Camiling St', status: 'normal', points: '190,80 220,80 220,115 190,115', owner: 'BSL Printing' },
  { id: 'cam-4', address: 'Blk 9 Lot 2B - Camiling St', status: 'investigating', points: '225,80 255,80 255,115 225,115', owner: 'BSL Printing' },
  { id: 'cam-5', address: 'Blk 9 Lot 5 - Camiling St', status: 'active', points: '260,80 290,80 290,115 260,115', owner: 'Manuel Peralta' },

  { id: 'panta-77', address: 'House 77 - Pantabangan St', status: 'normal', points: '140,220 170,190 190,210 160,240', owner: 'Jessil Perido' },
  { id: 'panta-79', address: 'House 79 - Pantabangan St', status: 'resolved', points: '165,245 195,215 215,235 185,265', owner: 'Paolo Paje' },
  { id: 'panta-81', address: 'House 81 - Pantabangan St', status: 'investigating', points: '190,270 220,240 240,260 210,290', owner: 'Mercy Abranes' },

  { id: 'cam-sub-77abc', address: '77A, 77B, 77C - Camiling St', status: 'active', points: '320,140 440,140 440,185 320,185', owner: 'Reyna Saycon / Mel Rio Morales', isCombined: true, partitions: 3 },

  { id: 'agos-03', address: 'Blk 9 Lot 03 - Agos Lane', status: 'normal', points: '230,340 260,340 260,380 230,380', owner: 'Rene Lucas' },
  { id: 'agos-06', address: 'Blk 9 Lot 06 - Agos Lane', status: 'escalated', points: '265,340 295,340 295,380 265,380', owner: 'Florentino David' },
  { id: 'agos-07', address: 'Blk 9 Lot 07 - Agos Lane', status: 'resolved', points: '300,340 330,340 330,380 300,380', owner: 'Ellen Gabrieles' },

  { id: 'jalaur-01', address: 'Blk 7 Lot 01 - Jalaur St', status: 'normal', points: '420,210 450,230 435,260 405,240', owner: 'Josefina Sumilong' },
  { id: 'jalaur-03', address: 'Blk 7 Lot 03 - Jalaur St', status: 'investigating', points: '455,235 485,255 470,285 440,265', owner: 'Ray Calusin' },
  { id: 'jalaur-04', address: 'Blk 7 Lot 04 - Jalaur St', status: 'active', points: '490,260 520,280 505,310 475,290', owner: 'Anlyn Sebastian' },

  { id: 'palico-01', address: 'Blk 9 Lot 01 - Palico Lane', status: 'resolved', points: '340,390 370,390 370,425 340,425', owner: 'Normita Abundo' },
  { id: 'chico-28', address: 'Blk 9 Lot 28 - Chico St', status: 'normal', points: '250,470 280,470 280,505 250,505', owner: 'Menchie Into' },
  { id: 'chico-30', address: 'Blk 9 Lot 30A - Chico St', status: 'investigating', points: '285,470 315,470 315,505 285,505', owner: 'Reynaldo / Myrna' }
];

export default function AdminMapPage() {
  const [hoveredLot, setHoveredLot] = useState(null);

  return (
    <div className="map-card">
      {/* MAP HEADER */}
      <div className="map-header">
        <h2>
          NIA Village Zone 3 Map 
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </h2>
        <div className="map-search">
          <input type="text" placeholder="Search Address / Resident" />
          <button>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
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

          <g className="landmark-chapel" transform="translate(60, 470)">
            <circle cx="35" cy="35" r="35" fill="#d1d5db" />
            <text x="35" y="40" fill="#4b5563" fontSize="11" textAnchor="middle" fontWeight="bold">NIA Chapel</text>
            <path d="M35 12 v12 M28 18 h14" stroke="#4b5563" strokeWidth="2" />
          </g>

          {mapLots.map((lot) => (
            <g key={lot.id} 
               onMouseEnter={() => setHoveredLot(lot)} 
               onMouseLeave={() => setHoveredLot(null)}
               className="lot-group">
              <polygon 
                points={lot.points} 
                fill={statusColors[lot.status]} 
                className={`lot-polygon ${hoveredLot?.id === lot.id ? 'hovered' : ''}`}
              />
              {lot.isCombined && (
                <g stroke="#ffffff" strokeWidth="2" opacity="0.8">
                  <line x1="360" y1="140" x2="360" y2="185" />
                  <line x1="400" y1="140" x2="400" y2="185" />
                </g>
              )}
            </g>
          ))}
        </svg>

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
  );
}