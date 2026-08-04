'use client';

import React, { useState } from 'react';

// SVGs matched precisely to the ZoneGuard design system
const Icons = {
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  userOutline: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};

export default function HomeownerSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* TITLE & TABS HEADER */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '900', color: '#0f172a', margin: 0 }}>Account Settings</h1>
        
        <div style={{ display: 'flex', gap: '8px', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('profile')}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem', backgroundColor: activeTab === 'profile' ? '#ffffff' : 'transparent', color: activeTab === 'profile' ? '#064e3b' : '#64748b', boxShadow: activeTab === 'profile' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
          >
            Profile Settings
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: '800', fontSize: '0.85rem', backgroundColor: activeTab === 'privacy' ? '#ffffff' : 'transparent', color: activeTab === 'privacy' ? '#064e3b' : '#64748b', boxShadow: activeTab === 'privacy' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none' }}
          >
            Privacy & Security
          </button>
        </div>
      </div>

      {/* MAIN SETTINGS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '32px', alignItems: 'start' }}>
        
        {/* LEFT FORM CARD */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          {activeTab === 'profile' ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
                <div>
                  <h3 style={{ color: '#064e3b', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 0, marginBottom: '16px' }}>Personal Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>FIRST NAME</label>
                      <input type="text" defaultValue="Thelma" readOnly style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>MIDDLE INITIAL</label>
                      <input type="text" defaultValue="I." readOnly style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>LAST NAME</label>
                      <input type="text" defaultValue="Ipac" readOnly style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 style={{ color: '#064e3b', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 0, marginBottom: '16px' }}>Contact Information</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>CONTACT NUMBER</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', color: '#64748b', fontSize: '0.9rem', fontWeight: '600' }}>+63</span>
                        <input type="text" defaultValue="923 584 1827" readOnly style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                      <input type="text" defaultValue="thelma.ipac1@zoneguard.demo" readOnly style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '28px' }}>
                <h3 style={{ color: '#064e3b', fontSize: '0.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: 0, marginBottom: '20px' }}>Property Address Details</h3>

                <div style={{ marginBottom: '20px' }}>
                  <span style={{ display: 'block', fontSize: '0.7rem', color: '#64748b', fontWeight: '800', marginBottom: '8px' }}>PRIMARY RESIDENCE</span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '10px' }}>
                    <div><label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>HOUSE NO.</label><input defaultValue="16" readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} /></div>
                    <div><label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>BLOCK</label><input defaultValue="BLK 2A" readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} /></div>
                    <div><label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>LOT</label><input defaultValue="LOT 1" readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '12px' }}>
                    <div><label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>ZONE</label><input defaultValue="Zone 3" readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} /></div>
                    <div><label style={{ display: 'block', fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', marginBottom: '4px' }}>STREET</label><input defaultValue="Pantabangan St." readOnly style={{ width: '100%', padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.85rem', fontWeight: '600', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} /></div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px 0' }}>
              <h3 style={{ color: '#064e3b', fontSize: '1rem', fontWeight: '900', marginBottom: '20px', textAlign: 'center' }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Current Password</label>
                  <input type="password" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>New Password</label>
                  <input type="password" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', marginBottom: '6px' }}>Confirm New Password</label>
                  <input type="password" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                </div>
                <button style={{ backgroundColor: '#064e3b', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '800', fontSize: '0.85rem', cursor: 'pointer', marginTop: '12px' }}>
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PROFILE CARD */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
          <div style={{ width: '110px', height: '110px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '2px solid #e2e8f0' }}>
            {Icons.userOutline}
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Thelma I.</h2>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '16px' }}>Homeowner</span>
          <button style={{ background: 'none', border: 'none', color: '#064e3b', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '800' }}>
            Edit Profile {Icons.pencil}
          </button>
        </div>

      </div>

    </div>
  );
}