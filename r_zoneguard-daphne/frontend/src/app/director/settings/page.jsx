'use client';


import React, { useState } from 'react';
import Link from 'next/link';


const Icons = {
  pencil: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
    </svg>
  ),
  userOutline: (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
};


export default function DirectorSettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');


  return (
    <div className="settings-outer-wrapper" style={{ display: 'block', height: '100vh', overflow: 'hidden', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
     
      {/* SCROLLABLE MAIN CONTENT (Sidebar completely removed) */}
      <main className="settings-main" style={{ height: '100vh', overflowY: 'auto', padding: '32px 48px', boxSizing: 'border-box' }}>
       
        {/* TOPBAR */}
        <header className="settings-topbar" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <span className="settings-user-name" style={{ display: 'block', fontWeight: '800', color: '#0f172a', fontSize: '0.9rem' }}>Dir. Del Rosario</span>
              <span className="settings-user-role" style={{ display: 'block', fontSize: '0.65rem', color: '#64748b', fontWeight: '700' }}>ZONE 3 DIRECTOR</span>
            </div>
            <div className="settings-avatar-badge" style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#064e3b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '0.8rem' }}>DR</div>
          </div>
        </header>


        {/* PAGE HEADER & TABS */}
        <div className="settings-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <h1 className="settings-title" style={{ color: '#064e3b', fontSize: '2.2rem', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Account Settings</h1>
         
          <div className="tab-pill-group" style={{ display: 'flex', backgroundColor: '#e2e8f0', padding: '4px', borderRadius: '24px', gap: '4px' }}>
            <button
              onClick={() => setActiveTab('profile')}
              className={`tab-btn ${activeTab === 'profile' ? 'active-tab' : ''}`}
              style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', backgroundColor: activeTab === 'profile' ? '#064e3b' : 'transparent', color: activeTab === 'profile' ? '#ffffff' : '#64748b', transition: 'all 0.2s' }}
            >
              Profile Settings
            </button>
            <button
              onClick={() => setActiveTab('privacy')}
              className={`tab-btn ${activeTab === 'privacy' ? 'active-tab' : ''}`}
              style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '700', fontSize: '0.85rem', backgroundColor: activeTab === 'privacy' ? '#064e3b' : 'transparent', color: activeTab === 'privacy' ? '#ffffff' : '#64748b', transition: 'all 0.2s' }}
            >
              Privacy Settings
            </button>
          </div>
        </div>


        {/* CONTENT GRID */}
        <div className="settings-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '32px', alignItems: 'start', maxWidth: '1200px', margin: '0 auto' }}>
         
          {/* FORM CARD */}
          <div className="settings-form-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '36px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            {activeTab === 'profile' ? (
              <div>
                {/* SECTION 1 */}
                <h3 className="settings-section-heading" style={{ color: '#064e3b', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>Personal Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>FIRST NAME</label>
                    <input type="text" defaultValue="Del" readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>MIDDLE INITIAL</label>
                    <input type="text" defaultValue="A." readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>LAST NAME</label>
                    <input type="text" defaultValue="Rosario" readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  </div>
                </div>


                {/* SECTION 2 */}
                <h3 className="settings-section-heading" style={{ color: '#064e3b', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>Contact Information</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>CONTACT NUMBER</label>
                    <div className="phone-input-wrapper" style={{ display: 'flex', gap: '6px' }}>
                      <span className="phone-prefix" style={{ padding: '10px 12px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#f1f5f9', color: '#475569', fontSize: '0.9rem', fontWeight: '600' }}>+63</span>
                      <input type="text" defaultValue="917 412 9988" readOnly className="settings-input flex-1" style={{ flex: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>EMAIL ADDRESS</label>
                    <input type="text" defaultValue="delrosario.zone3@zoneguard.ph" readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                  </div>
                </div>


                {/* SECTION 3 */}
                <div className="settings-sub-section" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '28px' }}>
                  <h3 className="settings-section-heading" style={{ color: '#064e3b', fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '20px' }}>Administrative Assignment</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div>
                      <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ASSIGNED ZONE</label>
                      <input defaultValue="Zone 3" readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                    <div>
                      <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>ROLE LEVEL</label>
                      <input defaultValue="Executive Director" readOnly className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a', backgroundColor: '#f8fafc', boxSizing: 'border-box' }} />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="privacy-container" style={{ maxWidth: '400px', margin: '0 auto' }}>
                <h3 className="settings-section-heading text-center" style={{ color: '#064e3b', fontSize: '0.9rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '24px', textAlign: 'center' }}>Change Password</h3>
                <div className="settings-fields-group" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>Current Password</label>
                    <input type="password" className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>New Password</label>
                    <input type="password" className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label className="settings-label" style={{ display: 'block', fontSize: '0.7rem', fontWeight: '700', color: '#64748b', marginBottom: '6px' }}>Confirm New Password</label>
                    <input type="password" className="settings-input" style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', boxSizing: 'border-box' }} />
                  </div>
                  <button className="change-password-btn" style={{ backgroundColor: '#064e3b', color: '#ffffff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', marginTop: '12px' }}>Update Password</button>
                </div>
              </div>
            )}
          </div>


          {/* PROFILE SUMMARY CARD */}
          <div className="profile-display-card settings-form-card" style={{ backgroundColor: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.02)' }}>
            <div className="profile-avatar-circle" style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', border: '2px solid #e2e8f0' }}>
              {Icons.userOutline}
            </div>
            <h2 className="profile-display-name" style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Dir. Del Rosario</h2>
            <p style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', margin: '0 0 20px 0' }}>ZONE 3 DIRECTOR</p>
           
            <button className="edit-profile-btn" style={{ background: '#f8fafc', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', color: '#475569', fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' }}>
              Edit Profile {Icons.pencil}
            </button>
          </div>


        </div>
      </main>
    </div>
  );
}

