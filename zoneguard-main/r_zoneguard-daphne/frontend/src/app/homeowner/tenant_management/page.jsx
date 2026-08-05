'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import './style.css';

const Icons = {
  tenant: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  upload: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#044e3a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

const mockProperties = [
  { id: 1, name: 'B1 L3 4B Pantabangan Street, Zone 5 (Primary Residence)' },
  { id: 2, name: 'B2 L12 1A Magat Street, Zone 3 (Property 1)' },
  { id: 3, name: 'B4 L8 2C Angat Street, Zone 1 (Property 2)' },
];

const mockTenantsByProperty = {
  1: [
    { id: 1, name: 'Charlie Balagtas', avatarBg: '#8a6d3b', initials: 'CB', status: 'PENDING' },
    { id: 2, name: 'John Christian Abella', avatarBg: '#1e3a8a', initials: 'JA', status: 'ACTIVE' },
  ],
  2: [
    { id: 3, name: 'Maria Santos', avatarBg: '#044e3a', initials: 'MS', status: 'ACTIVE' },
  ],
  3: [],
};

function TenantManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedPropertyId, setSelectedPropertyId] = useState(1);
  const [allowDues, setAllowDues] = useState(true);

  useEffect(() => {
    const propIdFromUrl = searchParams.get('propertyId');
    if (propIdFromUrl) {
      setSelectedPropertyId(Number(propIdFromUrl));
    } else {
      const storedId = localStorage.getItem('active_property_id');
      if (storedId) setSelectedPropertyId(Number(storedId));
    }

    const handlePropertyChange = () => {
      const updatedId = localStorage.getItem('active_property_id');
      if (updatedId) setSelectedPropertyId(Number(updatedId));
    };

    window.addEventListener('propertyChanged', handlePropertyChange);
    return () => window.removeEventListener('propertyChanged', handlePropertyChange);
  }, [searchParams]);

  const handleSelectProperty = (e) => {
    const newId = Number(e.target.value);
    setSelectedPropertyId(newId);
    localStorage.setItem('active_property_id', newId);
    window.dispatchEvent(new Event('propertyChanged'));

    if (newId === 1) {
      router.push('/homeowner/dashboard');
    } else {
      router.push(`/homeowner/tenant_management?propertyId=${newId}`);
    }
  };

  const activeTenants = mockTenantsByProperty[selectedPropertyId] || [];

  return (
    <div className="tm-container">

      <div className="page-title-section" style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '700',
          color: '#064e3b',
          margin: '0 0 8px 0',
          letterSpacing: '-0.02em'
        }}>
          Tenant Management
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#6b7280', margin: 0 }}>
          Manage property occupancy and authorize resident permissions.
        </p>
      </div>
      {/* GRID CONTAINER */}
      <div className="tm-grid">

        {/* LEFT COLUMN */}
        <div className="tm-left-col">

          {/* NEW TENANT CARD */}
          <div className="tm-card">
            <div className="tm-card-title">
              <div className="tm-icon-box">{Icons.tenant}</div>
              <h3>New Tenant Account</h3>
            </div>

            <div className="tm-form-group">
              <label className="tm-label">SELECT PROPERTY</label>
              <select
                value={selectedPropertyId}
                onChange={handleSelectProperty}
                className="tm-select"
              >
                {mockProperties.map((prop) => (
                  <option key={prop.id} value={prop.id}>{prop.name}</option>
                ))}
              </select>
            </div>

            <div className="tm-section-divider">
              <span className="tm-label">TENANT INFORMATION</span>

              <div className="tm-form-grid">
                <div className="tm-form-col">
                  <div>
                    <label className="tm-sublabel">FIRST NAME</label>
                    <input type="text" placeholder="Enter first name" className="tm-input" />
                  </div>
                  <div>
                    <label className="tm-sublabel">LAST NAME</label>
                    <input type="text" placeholder="Enter last name" className="tm-input" />
                  </div>
                  <div>
                    <label className="tm-sublabel">MIDDLE NAME</label>
                    <input type="text" placeholder="Enter middle name" className="tm-input" />
                  </div>
                </div>

                <div className="tm-form-col">
                  <div>
                    <label className="tm-sublabel">EMAIL ADDRESS</label>
                    <input type="email" placeholder="tenant@example.com" className="tm-input" />
                  </div>
                  <div>
                    <label className="tm-sublabel">RENTAL PERMIT</label>
                    <div className="tm-upload-box">
                      <div className="upload-icon">{Icons.upload}</div>
                      <strong>Upload Permit</strong>
                      <span>JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERMISSIONS CARD */}
          <div className="tm-card">
            <span className="tm-label">PERMISSION AND ACCESS</span>
            <div className="tm-permission-row">
              <div>
                <h4>Allow Dues Payment</h4>
                <p>Can this tenant view and pay HOA dues?</p>
              </div>
              <label className="tm-switch">
                <input
                  type="checkbox"
                  checked={allowDues}
                  onChange={() => setAllowDues(!allowDues)}
                />
                <span className="tm-slider"></span>
              </label>
            </div>
          </div>

          <div className="tm-action-row">
            <button className="tm-btn-primary">Confirm and Invite</button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="tm-right-col">
          <div className="tm-card">
            <div className="tm-linked-header">
              <h3>Linked Tenants</h3>
              <span className="tm-badge-count">{activeTenants.length} Total</span>
            </div>

            <div className="tm-tenant-list">
              {activeTenants.length > 0 ? (
                activeTenants.map((tenant) => (
                  <div key={tenant.id} className="tm-tenant-item">
                    <div className="tm-tenant-info">
                      <div className="tm-avatar" style={{ backgroundColor: tenant.avatarBg }}>
                        {tenant.initials}
                      </div>
                      <span className="tm-tenant-name">{tenant.name}</span>
                    </div>
                    <span className={`tm-status-pill ${tenant.status === 'ACTIVE' ? 'active' : 'pending'}`}>
                      {tenant.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="tm-empty-state">No tenants linked to this property yet.</div>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default function TenantManagementPage() {
  return (
    <Suspense fallback={<div className="tm-loading">Loading tenant management...</div>}>
      <TenantManagementContent />
    </Suspense>
  );
}