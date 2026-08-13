'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

<<<<<<< HEAD
const ComplaintStatusMap = dynamic(() => import('../../components/ComplaintStatusMap'), {
   ssr: false,
   loading: () => <p>Loading map...</p>,
});

const ComplaintHeatmapMap = dynamic(() => import('../../components/ComplaintHeatmapMap'), {
   ssr: false,
   loading: () => <p>Loading map...</p>,
=======
const ComplaintStatusMap = dynamic(() => import('../../../components/ComplaintStatusMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

const ComplaintHeatmapMap = dynamic(() => import('../../../components/ComplaintHeatmapMap'), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
>>>>>>> 01836c54ddcfe91b7f8a90884af277b3524fb35f
});

const Icons = {
  search: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  )
};

const densityLegend = [
  { label: '0 complaints', color: '#86efac' },
  { label: '1 complaint', color: '#fde047' },
  { label: '2 complaints', color: '#fb923c' },
  { label: '3 complaints', color: '#ef4444' },
  { label: '4+ complaints', color: '#7f1d1d' },
];

const statusLegend = [
  { label: 'Active', color: '#ef4444' },
  { label: 'Pending', color: '#f97316' },
  { label: 'Escalated', color: '#2563eb' },
  { label: 'Investigating', color: '#eab308' },
  { label: 'Resolved', color: '#65a30d' },
];

export default function AdminMapPage() {
  const [mapView, setMapView] = useState('density'); // 'density' | 'status'
  const [selectedLot, setSelectedLot] = useState(null); 
  const [ticketIndex, setTicketIndex] = useState(0);

  // New State: Tracks which statuses are currently active in the filter
  const [activeStatuses, setActiveStatuses] = useState(['Active', 'Pending', 'Escalated', 'Investigating', 'Resolved']);

  const [currentUser, setCurrentUser] = useState({
    firstName: 'Admin',
    lastName: '',
    initials: 'AD',
    role: 'ADMINISTRATOR'
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('zoneguard_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      const fName = parsed.first_name || parsed.firstName || 'Admin';
      const lName = parsed.last_name || parsed.lastName || '';
      setCurrentUser({
        firstName: fName,
        lastName: lName,
        initials: `${fName.charAt(0)}${lName ? lName.charAt(0) : ''}`.toUpperCase(),
        role: 'ADMINISTRATOR'
      });
    }
  }, []);

  const activeLegend = mapView === 'density' ? densityLegend : statusLegend;

  function handleSelectLot(lotData) {
    setSelectedLot(lotData);
    setTicketIndex(0);
  }

  function handleCloseCard() {
    setSelectedLot(null);
    setTicketIndex(0);
  }

  return (
    <>
      <header className="dg-topbar">
        <div>
          <h1>Zone 3 Territorial Map</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="dg-zone-pill">NIA VILLAGE SUBD.</span>
            <span style={{ color: '#6b7280', fontSize: '0.9rem', fontWeight: '500' }}>
              {mapView === 'density' ? 'Complaint Density Overlay' : 'Real-time Status Tracker'}
            </span>
          </div>
        </div>

        <div className="dg-topbar-right">
          <label className="dg-search">
            <span>{Icons.search}</span>
            <input type="text" placeholder="Search Address / Resident..." aria-label="Search map" />
          </label>
          <div className="dg-user">
            <div className="dg-user-info">
              <strong>
                {currentUser.firstName} {currentUser.lastName ? `${currentUser.lastName.charAt(0)}.` : ''}
              </strong>
              <p>{currentUser.role}</p>
            </div>
            <span className="avatar">{currentUser.initials}</span>
          </div>
        </div>
      </header>

      <section className="dg-card" style={{ padding: '0', overflow: 'hidden', position: 'relative' }}>
        
        {/* Floating View Toggles */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 1000, display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setMapView('density')}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              backgroundColor: mapView === 'density' ? '#0f7050' : '#ffffff',
              color: mapView === 'density' ? '#ffffff' : '#475569',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            Density View
          </button>
          <button
            onClick={() => { setMapView('status'); handleCloseCard(); }}
            style={{
              padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer',
              backgroundColor: mapView === 'status' ? '#0f7050' : '#ffffff',
              color: mapView === 'status' ? '#ffffff' : '#475569',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s'
            }}
          >
            Complaint Status
          </button>
        </div>

        {/* Interactive Legend Overlay */}
        <div style={{ position: 'absolute', bottom: '24px', left: '16px', zIndex: 1000, backgroundColor: '#ffffff', padding: '16px', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', minWidth: '160px' }}>
          <strong style={{ display: 'block', marginBottom: '12px', fontSize: '0.85rem', color: '#1e293b' }}>
            {mapView === 'density' ? 'Density Scale' : 'Status Filters (Click to toggle)'}
          </strong>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activeLegend.map((item) => {
              const isStatusView = mapView === 'status';
              const isActive = isStatusView ? activeStatuses.includes(item.label) : true;
              
              return (
                <li 
                  key={item.label} 
                  onClick={() => {
                    if (!isStatusView) return;
                    setActiveStatuses(prev => 
                      prev.includes(item.label) 
                        ? prev.filter(s => s !== item.label)
                        : [...prev, item.label]
                    );
                    handleCloseCard(); // Close ticket card to prevent reading missing data
                  }}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem', 
                    color: isActive ? '#475569' : '#cbd5e1', fontWeight: '500',
                    cursor: isStatusView ? 'pointer' : 'default',
                    opacity: isActive ? 1 : 0.4,
                    transition: 'all 0.2s'
                  }}
                >
                  <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: item.color }}></span>
                  <span style={{ textDecoration: isActive ? 'none' : 'line-through' }}>{item.label}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Map Container */}
        <div style={{ height: 'calc(100vh - 180px)', minHeight: '450px', width: '100%', backgroundColor: '#e2e8f0' }}>
          {mapView === 'density' ? (
            <ComplaintHeatmapMap />
          ) : (
            <ComplaintStatusMap 
              onSelectLot={handleSelectLot} 
              activeStatuses={activeStatuses.map(s => s.toUpperCase())} // Pass active filters down
            />
          )}
        </div>

        {/* Floating Ticket Detail Card */}
        {mapView === 'status' && selectedLot && (() => {
          const ticket = selectedLot.complaints[ticketIndex];
          const hasMultiple = selectedLot.complaints.length > 1;
          return (
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 1000, backgroundColor: '#ffffff', borderRadius: '12px', padding: '20px', width: '320px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f7050' }}>TICKET #{ticket.ticket_id}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>{selectedLot.lotId}</span>
                </div>
                <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase' }}>
                  {ticket.status}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', color: '#334155', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Filed By:</span> <strong>{ticket.uploaded_by}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Date:</span> <strong>{ticket.date_filed}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94a3b8' }}>Category:</span> <strong>{ticket.category}</strong></div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {hasMultiple ? (
                  <button onClick={() => setTicketIndex((i) => (i + 1) % selectedLot.complaints.length)} style={{ border: 'none', background: '#eef2f4', padding: '8px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '700', color: '#0f7050', cursor: 'pointer' }}>
                    Next ({ticketIndex + 1}/{selectedLot.complaints.length}) →
                  </button>
                ) : <div></div>}
                <button onClick={handleCloseCard} style={{ border: 'none', background: 'transparent', color: '#94a3b8', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer' }}>
                  Close
                </button>
              </div>
            </div>
          );
        })()}

      </section>
    </>
  );
}