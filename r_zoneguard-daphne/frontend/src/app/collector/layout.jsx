'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './layout.css';

const Icons = {
  houseBrand: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  map: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
      <line x1="8" y1="2" x2="8" y2="18"></line>
      <line x1="16" y1="6" x2="16" y2="22"></line>
    </svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  ),
  disputes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  vehicleSticker: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.9 3.4C1.4 11.8 1 12.6 1 13.5V16c0 .6.4 1 1 1h2"></path>
      <circle cx="7" cy="17" r="2"></circle>
      <circle cx="17" cy="17" r="2"></circle>
    </svg>
  ),
  residents: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  search: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  )
};

const sidebarItems = [
  { label: 'Dashboard', href: '/collector/dashboard', icon: Icons.dashboard },
  { label: 'Map', href: '/collector/map', icon: Icons.map },
  { label: 'Payments', href: '/collector/payments', icon: Icons.payments },
  { label: 'Disputes', href: '/collector/disputes', icon: Icons.disputes },
  { label: 'Vehicle Sticker', href: '/collector/sticker', icon: Icons.vehicleSticker },
  { label: 'Residents', href: '/collector/residents', icon: Icons.residents },
];

export default function CollectorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState({
    name: 'Collector Name',
    role: 'Zone Collector',
    initials: 'CL',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser({
            name: `${data.firstName} ${data.lastName}`,
            role: data.role || 'Zone Collector',
            initials: `${data.firstName?.[0] || ''}${data.lastName?.[0] || ''}`.toUpperCase() || 'CL',
          });
        }
      } catch (error) {
        console.error('Failed to load collector session:', error);
      }
    }

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.clear();
      router.push('/login');
    }
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/collector/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="collector-layout-wrapper">
      <aside className="zg-sidebar">
        {/* BRAND HEADER */}
        <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 14px 28px' }}>
          <div className="brand-badge" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#065f46', color: '#ffffff', flexShrink: 0 }}>
            {Icons.houseBrand}
          </div>
          <div className="brand-text" style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="brand-title" style={{ fontSize: '1.15rem', color: '#111827', fontWeight: 700, lineHeight: 1.1, textTransform: 'none' }}>ZoneGuard</span>
            <span className="brand-sub" style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: '2px' }}>NIA VILLAGE SUBD.</span>
          </div>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="nav-group">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER ACTIONS */}
        <div className="nav-footer">
          <Link 
            href="/collector/settings" 
            className={`nav-item ${pathname === '/collector/settings' ? 'active' : ''}`}
          >
            <span className="nav-icon">{Icons.settings}</span>
            <span>Account Settings</span>
          </Link>
          <button 
            type="button" 
            onClick={handleLogout} 
            className="nav-item btn-logout" 
          >
            <span className="nav-icon">{Icons.logout}</span>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main className="collector-main-viewport">
        <header className="topbar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div className="search-bar-large" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px 14px', width: '300px' }}>
            <span className="search-icon">{Icons.search}</span>
            <input 
              type="text" 
              placeholder="Search collector portal..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '0.85rem', color: '#111827' }}
            />
          </div>

          <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="user-info" style={{ display: 'flex', flexDirection: 'column', textAlign: 'right' }}>
              <span className="user-name" style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111827' }}>{user.name}</span>
              <span className="user-role" style={{ fontSize: '0.7rem', color: '#6b7280' }}>{user.role}</span>
            </div>
            <div className="user-avatar" style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#065f46', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: '700' }}>{user.initials}</div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}