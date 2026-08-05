'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './layout.css';

const Icons = {
  houseBrand: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#065f46" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
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
  { label: 'Payments', href: '/collector/payments', icon: Icons.payments },
  { label: 'Disputes', href: '/collector/disputes', icon: Icons.disputes },
];

export default function CollectorLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();

  // 1. Dynamic User State (Populated from Backend/Session API)
  const [user, setUser] = useState({
    name: 'Collector Name',
    role: 'Zone Collector',
    initials: 'CL',
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // BACKEND INTEGRATION: Fetch current user profile session
    async function fetchUserProfile() {
      try {
        const response = await fetch('/api/auth/me'); // Replace with your actual auth endpoint
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

  // 2. Handle Backend Logout Request
  const handleLogout = async () => {
    try {
      // Call your backend logout endpoint to destroy session/cookies
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage/cookies if necessary and navigate to login page
      localStorage.clear();
      router.push('/login');
    }
  };

  // 3. Handle Search Action
  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/collector/search?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="layout-wrapper">
      <div className="main-container">
        <aside className="sidebar">
          {/* BRAND HEADER */}
          <div className="brand-header">
            <div className="brand-logo">
              {Icons.houseBrand}
            </div>
            <div className="brand-text">
              <strong>ZoneGuard</strong>
              <span>Nia Village Subd.</span>
            </div>
          </div>

          {/* NAVIGATION LINKS */}
          <nav className="nav-menu">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`nav-link ${isActive ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* FOOTER ACTIONS */}
          <div className="sidebar-footer">
            <div className="sidebar-divider" />
            <Link 
              href="/collector/settings" 
              className={`nav-link ${pathname === '/collector/settings' ? 'active' : ''}`}
            >
              <span className="nav-icon">{Icons.settings}</span>
              <span>Account Settings</span>
            </Link>
            <button 
              type="button" 
              onClick={handleLogout} 
              className="nav-link btn-logout" 
            >
              <span className="nav-icon">{Icons.logout}</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* CONTENT AREA */}
        <main className="content-area">
          <header className="topbar">
            <div className="search-bar-large">
              <span className="search-icon">{Icons.search}</span>
              <input 
                type="text" 
                placeholder="Search collector portal..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
              />
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-role">{user.role}</span>
              </div>
              <div className="user-avatar">{user.initials}</div>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}