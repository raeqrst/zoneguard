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

function TenantManagementContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [allowDues, setAllowDues] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTenants, setActiveTenants] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    birthDate: '',
  });
  const [permitFile, setPermitFile] = useState(null);

  // Fetch live properties and linked tenants from the database
  useEffect(() => {
    async function fetchInitialData() {
      setLoading(true);
      try {
        const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
        const res = await fetch(`http://localhost:5000/api/homeowner/properties?userId=${loggedInUserId}`);
        const data = await res.json();

        if (res.ok && data.properties) {
          setProperties(data.properties);

          const propIdFromUrl = searchParams.get('propertyId');
          const storedId = localStorage.getItem('active_property_id');

          let targetId = data.properties[0]?.id;
          if (propIdFromUrl) {
            targetId = propIdFromUrl;
          } else if (storedId) {
            targetId = storedId;
          }

          setSelectedPropertyId(targetId);
          if (targetId) {
            fetchTenantsForProperty(targetId, loggedInUserId);
          }
        }
      } catch (err) {
        console.error('Failed to load properties:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchInitialData();
  }, [searchParams]);

  const fetchTenantsForProperty = async (propId, userId) => {
    try {
      const url = new URL('http://localhost:5000/api/homeowner/tenants');
      if (propId) url.searchParams.append('propertyId', propId);
      if (userId) url.searchParams.append('userId', userId);

      const res = await fetch(url.toString());
      const data = await res.json();
      if (res.ok && data.tenants) {
        const formatted = data.tenants.map((t, idx) => {
          const fName = t.user?.firstName || 'Tenant';
          const lName = t.user?.lastName || '';
          const initials = `${fName[0] || ''}${lName[0] || ''}`.toUpperCase();
          const colors = ['#044e3a', '#0284c7', '#d97706', '#7c3aed'];
          
          // 🌟 Map backend approval states: 'APPROVED' or 'ACTIVE' maps to 'ACTIVE', everything else defaults to 'PENDING'
          const rawStatus = (t.approvalStatus || t.status || 'PENDING').toUpperCase();
          const displayStatus = (rawStatus === 'APPROVED' || rawStatus === 'ACTIVE') ? 'ACTIVE' : 'PENDING';

          return {
            id: t.id,
            name: `${fName} ${lName}`,
            initials: initials || 'T',
            avatarBg: colors[idx % colors.length],
            status: displayStatus
          };
        });
        setActiveTenants(formatted);
      }
    } catch (err) {
      console.error('Failed to load tenants:', err);
      setActiveTenants([]);
    }
  };

  const handleSelectProperty = (e) => {
    const newId = e.target.value;
    setSelectedPropertyId(newId);
    localStorage.setItem('active_property_id', newId);
    window.dispatchEvent(new Event('propertyChanged'));

    const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
    fetchTenantsForProperty(newId, loggedInUserId);

    const selectedProp = properties.find((p) => String(p.id) === String(newId));
    const isPrimary = selectedProp ? selectedProp.name.toLowerCase().includes('primary') : false;

    if (isPrimary) {
      router.push('/homeowner/dashboard');
    } else {
      router.push(`/homeowner/tenant_management?propertyId=${newId}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit.');
        return;
      }
      setPermitFile(file);
    }
  };

  const handleInviteTenant = async (e) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      alert('Please fill out all required tenant details.');
      return;
    }

    setIsSubmitting(true);
    try {
      const loggedInUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
      const res = await fetch('http://localhost:5000/api/homeowner/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId: selectedPropertyId,
          userId: loggedInUserId,
          firstName: formData.firstName.trim(),
          middleName: formData.middleName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          birthDate: formData.birthDate || null,
          rentalPermit: permitFile ? permitFile.name : null,
          permissions: {
            allowDuesPayment: allowDues,
            allowComplaints: true
          }
        })
      });

      const data = await res.json();
      if (res.ok) {
        alert('Tenant account submitted successfully and is now pending admin approval!');
        setFormData({ firstName: '', lastName: '', middleName: '', email: '', birthDate: '' });
        setPermitFile(null);
        fetchTenantsForProperty(selectedPropertyId, loggedInUserId);
      } else {
        alert('Failed to create tenant: ' + (data.message || 'Unknown error'));
      }
    } catch (err) {
      console.error('Tenant submission error:', err);
      alert('Network error while registering tenant.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading property details...</div>;
  }

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
          <form onSubmit={handleInviteTenant}>
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
                  {properties.map((prop) => (
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
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Enter first name"
                        className="tm-input"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="tm-sublabel">LAST NAME</label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Enter last name"
                        className="tm-input"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="tm-sublabel">MIDDLE NAME</label>
                      <input
                        type="text"
                        name="middleName"
                        placeholder="Enter middle name"
                        className="tm-input"
                        value={formData.middleName}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <label className="tm-sublabel">BIRTHDATE</label>
                      <input
                        type="date"
                        name="birthDate"
                        className="tm-input"
                        value={formData.birthDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="tm-form-col">
                    <div>
                      <label className="tm-sublabel">EMAIL ADDRESS</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="tenant@example.com"
                        className="tm-input"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <label className="tm-sublabel">RENTAL PERMIT</label>
                      <label className="tm-upload-box" style={{ cursor: 'pointer' }}>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} style={{ display: 'none' }} />
                        <div className="upload-icon">{Icons.upload}</div>
                        <strong>{permitFile ? permitFile.name : 'Upload Permit'}</strong>
                        <span>JPG, PNG (Max 5MB)</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PERMISSIONS CARD */}
            <div className="tm-card" style={{ marginTop: '24px' }}>
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

            <div className="tm-action-row" style={{ marginTop: '24px' }}>
              <button type="submit" className="tm-btn-primary" disabled={isSubmitting}>
                {isSubmitting ? 'Processing...' : 'Confirm and Invite'}
              </button>
            </div>
          </form>
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
                    {/* 🌟 Dynamically applies 'active' or 'pending' class based on database status */}
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
    <Suspense fallback={<div style={{ padding: '40px', color: '#6b7280' }}>Loading tenant management...</div>}>
      <TenantManagementContent />
    </Suspense>
  );
}