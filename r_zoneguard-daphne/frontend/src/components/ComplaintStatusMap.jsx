"use client";
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const statusColors = {
  RESOLVED: '#65a30d',
  INVESTIGATING: '#eab308',
  ACTIVE: '#ef4444',
  ESCALATED: '#2563eb',
  PENDING: '#f97316',
};

function getComplaints(feature) {
  const raw = feature.properties.all_complaints;
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      return [];
    }
  }
  return [];
}

const starIcon = L.divIcon({
  className: 'lot-star-icon',
  html: '<div style="color: #fff; font-size: 14px; text-shadow: 1px 1px 2px #000;">★</div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

function getPolygonCentroid(geometry) {
  const ring = geometry.coordinates[0];
  let x = 0, y = 0;
  ring.forEach(([lng, lat]) => { x += lng; y += lat; });
  return [y / ring.length, x / ring.length];
}

export default function ComplaintStatusMap({ onSelectLot, activeStatuses = [] }) {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/complaint-status-map')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setGeoData(res.data);
        else setError(res.error || 'Failed to load status map');
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <div style={{ padding: '20px', color: '#ef4444' }}>Couldn't load map: {error}</div>;
  if (!geoData) return <div style={{ padding: '20px' }}>Loading map data...</div>;

  // Filter styles based on the active toggles from the parent page
  const styleLot = (feature) => {
    const complaints = getComplaints(feature).filter(c => activeStatuses.includes(c.status.toUpperCase()));
    const topStatus = complaints.length > 0 ? complaints[0].status.toUpperCase() : null;
    return {
      fillColor: statusColors[topStatus] || '#d1d5db',
      fillOpacity: 0.75,
      color: '#333',
      weight: 1,
    };
  };

  // Recalculate which lots get the star marker based ON the active filters
  const multiComplaintLots = geoData.features.filter((f) => {
    const complaints = getComplaints(f).filter(c => activeStatuses.includes(c.status.toUpperCase()));
    return complaints.length > 1;
  });

  return (
    <MapContainer
      center={[14.692050, 121.050850]}
      zoom={17}
      minZoom={16}
      maxZoom={22}
      style={{ height: '100%', width: '100%', backgroundColor: '#e2e8f0' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />

      {/* The KEY attribute forces Leaflet to repaint immediately when filters change */}
      <GeoJSON
        key={activeStatuses.join('-')}
        data={geoData}
        style={styleLot}
        onEachFeature={(feature, layer) => {
          const p = feature.properties;
          const filteredComplaints = getComplaints(feature).filter(c => activeStatuses.includes(c.status.toUpperCase()));
          
          layer.bindTooltip(
            filteredComplaints.length > 0
              ? `<div style="text-align: center;"><strong>${p.lot_id}</strong><br/>${filteredComplaints[0].status} (${filteredComplaints.length})</div>`
              : `<div style="text-align: center;"><strong>${p.lot_id}</strong><br/>No visible complaints</div>`,
            { sticky: true }
          );

          layer.on('click', () => {
            if (filteredComplaints.length > 0) {
              onSelectLot({ lotId: p.lot_id, complaints: filteredComplaints });
            }
          });
        }}
      />

      {multiComplaintLots.map((f) => (
        <Marker
          key={f.properties.lot_id}
          position={getPolygonCentroid(f.geometry)}
          icon={starIcon}
          interactive={false}
        />
      ))}
    </MapContainer>
  );
}