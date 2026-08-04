'use client';

import React, { useState } from 'react';

// SVGs matched precisely to the dashboard design system
const Icons = {
  tenant: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  ),
  upload: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  ),
};

const linkedTenantsData = [
  { id: 1, name: 'Charlie Balagtas', avatarBg: '#78350f', initials: 'CB', status: 'PENDING' },
  { id: 2, name: 'John Christian Abella', avatarBg: '#1e3a8a', initials: 'JA', status: 'ACTIVE' }
];

export default function TenantManagementPage() {
  const [allowDues, setAllowDues] = useState(true);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* PAGE HEADER */}
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Tenant Management</h1>
        <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>Manage property occupancy and authorize resident permissions.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: FORM & PERMISSIONS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* NEW TENANT CARD */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#ecfdf5', color: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {Icons.tenant}
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>New Tenant Account</h3>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '8px', letterSpacing: '0.5px' }}>SELECT PROPERTY</label>
              <select style={{ width: '100%', padding: '12px 16px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', cursor: 'pointer', fontWeight: '600', color: '#0f172a', boxSizing: 'border-box' }}>
                <option>B1 L3 4B Pantabangan Street, Zone 5</option>
              </select>
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '20px' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '16px', letterSpacing: '0.5px' }}>TENANT INFORMATION</span>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px' }}>FIRST NAME</label>
                    <input type="text" placeholder="Enter first name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px' }}>LAST NAME</label>
                    <input type="text" placeholder="Enter last name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px' }}>MIDDLE NAME</label>
                    <input type="text" placeholder="Enter middle name" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                    <input type="email" placeholder="tenant@example.com" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: '800', color: '#94a3b8', marginBottom: '6px' }}>RENTAL PERMIT</label>
                    <div style={{ border: '2px dashed #cbd5e1', borderRadius: '10px', padding: '16px', textAlign: 'center', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '105px', boxSizing: 'border-box', cursor: 'pointer' }}>
                      <div style={{ marginBottom: '6px' }}>{Icons.upload}</div>
                      <strong style={{ fontSize: '0.78rem', color: '#0f172a', fontWeight: '700', display: 'block' }}>Upload Permit</strong>
                      <span style={{ fontSize: '0.65rem', color: '#64748b' }}>JPG, PNG (Max 5MB)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PERMISSION & ACCESS CARD */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '28px 32px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <span style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '16px', letterSpacing: '0.5px' }}>PERMISSION AND ACCESS</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '800', color: '#0f172a' }}>Allow Dues Payment</h4>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Can this tenant view and pay HOA dues?</p>
              </div>
              <label style={{ position: 'relative', display: 'inline-block', width: '48px', height: '26px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={allowDues} 
                  onChange={() => setAllowDues(!allowDues)} 
                  style={{ opacity: 0, width: 0, height: 0 }} 
                />
                <span style={{ 
                  position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0, 
                  backgroundColor: allowDues ? '#064e3b' : '#cbd5e1', 
                  transition: '.3s', borderRadius: '26px' 
                }}>
                  <span style={{ 
                    position: 'absolute', content: '""', height: '20px', width: '20px', left: allowDues ? '24px' : '3px', bottom: '3px', 
                    backgroundColor: 'white', transition: '.3s', borderRadius: '50%' 
                  }}></span>
                </span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button style={{ backgroundColor: '#064e3b', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '14px 32px', fontWeight: '800', fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 10px rgba(6, 78, 59, 0.2)' }}>
              Confirm and Invite
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN: LINKED TENANTS LIST */}
        <div>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px 28px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f1f5f9' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>Linked Tenants</h3>
              <span style={{ backgroundColor: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '800' }}>2 Total</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {linkedTenantsData.map((tenant) => (
                <div key={tenant.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: tenant.avatarBg, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: '800', flexShrink: 0 }}>
                      {tenant.initials}
                    </div>
                    <span style={{ fontSize: '0.88rem', fontWeight: '800', color: '#0f172a' }}>{tenant.name}</span>
                  </div>
                  <span style={{ 
                    backgroundColor: tenant.status === 'ACTIVE' ? '#d1fae5' : '#fef3c7', 
                    color: tenant.status === 'ACTIVE' ? '#065f46' : '#92400e', 
                    padding: '3px 8px', borderRadius: '8px', fontSize: '0.65rem', fontWeight: '800' 
                  }}>
                    {tenant.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}