"use client";

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';

const densityColors = {
  1: '#86efac', // 0 complaints
  2: '#fde047', // 1 complaint
  3: '#fb923c', // 2 complaints
  4: '#ef4444', // 3 complaints
  5: '#7f1d1d', // 4+ complaints
};

function styleLot(feature) {
  const cls = feature.properties.density_class || 1;
  return {
    fillColor: densityColors[cls],
    fillOpacity: 0.75,
    color: '#333',
    weight: 1,
  };
}

function onEachLot(feature, layer) {
  const { lot_id, complaint_count } = feature.properties;
  layer.bindTooltip(
    `<strong>${lot_id}</strong><br/>${complaint_count} complaint${complaint_count === 1 ? '' : 's'}`,
    { sticky: true }
  );
}

// HELPER: Converts your GeoJSON polygons into center coordinates for the radial glow
function getPolygonCenter(coordinates) {
  let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
  const ring = coordinates[0]; // The outer boundary ring of the lot
  ring.forEach(([lng, lat]) => {
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
  });
  return [(minLat + maxLat) / 2, (minLng + maxLng) / 2];
}

// CUSTOM COMPONENT: Generates the glowing radial heatmap
function RadialHeatmapLayer({ geoData }) {
  const map = useMap();

  useEffect(() => {
    if (!geoData || !geoData.features || typeof window === 'undefined') return;

    // Dynamically import leaflet.heat so Next.js doesn't crash during SSR
    require('leaflet.heat');

    // FIX: We only plot lots with > 0 complaints. This stops the giant red overlapping blob.
    const heatPoints = geoData.features
      .filter(feature => feature.properties.complaint_count > 0)
      .map(feature => {
        let coords = feature.geometry.coordinates;
        if (feature.geometry.type === "MultiPolygon") coords = coords[0];

        const [lat, lng] = getPolygonCenter(coords);
        const count = feature.properties.complaint_count;

        // Pass the straightforward count as the weight
        return [lat, lng, count];
      });

    const heatLayer = L.heatLayer(heatPoints, {
      radius: 40,     // Increased radius pushes the green halo further out into the empty streets
      blur: 25,       // High blur creates a smooth, foggy fade
      maxZoom: 17,
      max: 4,         // Cap it at 4 to keep the red/yellow scaling accurate
      gradient: {
        0.10: '#86efac', // Prominent Green halo on the outer edges
        0.30: '#fde047', // Yellow
        0.60: '#fb923c', // Orange
        0.85: '#ef4444', // Red
        1.00: '#7f1d1d'  // Dark Red center for extreme hotspots
      }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [geoData, map]);

  return null;
}

export default function ComplaintHeatmapMap() {
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  // New state to manage the toggle switch (defaults to your original polygons)
  const [viewMode, setViewMode] = useState('polygon'); // 'polygon' | 'radial'

  useEffect(() => {
    fetch('http://localhost:5000/api/analytics/complaint-heatmap')
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setGeoData(res.data);
        } else {
          setError(res.error || 'Failed to load heatmap data');
        }
      })
      .catch((err) => setError(err.message));
  }, []);

  if (error) {
    return <div className="map-error">Couldn't load heatmap: {error}</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>

      {/* FLOATING TOGGLE SWITCH */}
      <div style={{
        position: 'absolute',
        top: '12px',
        right: '12px',
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '4px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        display: 'flex',
        gap: '4px'
      }}>
        <button
          onClick={() => setViewMode('polygon')}
          style={{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: viewMode === 'polygon' ? '#064E3B' : 'transparent',
            color: viewMode === 'polygon' ? 'white' : '#4B5563',
            transition: 'all 0.2s ease'
          }}
        >
          Lot Density
        </button>
        <button
          onClick={() => setViewMode('radial')}
          style={{
            padding: '8px 14px',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            backgroundColor: viewMode === 'radial' ? '#064E3B' : 'transparent',
            color: viewMode === 'radial' ? 'white' : '#4B5563',
            transition: 'all 0.2s ease'
          }}
        >
          Radial Heatmap
        </button>
      </div>

      <MapContainer
        // Paste your two numbers right here! [Latitude, Longitude]
        center={[14.692060, 121.050860]}
        zoom={18}
        minZoom={17}
        maxZoom={22}
        style={{ height: '100%', width: '100%' }}
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />

        {/* Render Original Lot View */}
        {geoData && viewMode === 'polygon' && (
          <GeoJSON
            key="polygon-layer"
            data={geoData}
            style={styleLot}
            onEachFeature={onEachLot}
          />
        )}

        {/* Render New Radial Glow View */}
        {geoData && viewMode === 'radial' && (
          <RadialHeatmapLayer geoData={geoData} />
        )}
      </MapContainer>
    </div>
  );
}