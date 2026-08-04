'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
// Note: You may need to adjust this path to wherever your sidebar/topbar CSS lives!
import './dashboard/style.css'; 

const Icons = {
  shieldHome: (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M9 12l2 2 4-4"></path></svg>
  ),
  dashboard: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
  ),
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
  ),
  tenant: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
  )
};

const sidebarItems = [
  { label: 'Dashboard', href: '/homeowner/dashboard', icon: Icons.dashboard },
  { label: 'Payments', href: '/homeowner/payments', icon: Icons.payments },
  { label: 'Complaints', href: '/homeowner/complaints', icon: Icons.complaints },
  { label: 'Tenant Management', href: '/homeowner/tenant_management', icon: Icons.tenant },
];

export default function HomeownerLayout({ children }) {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState({
    firstName: 'Loading...',
    lastName: '',
    initials: '...'
  });

  // Fetch the user info globally for ALL homeowner pages
  useEffect(() => {
    const storedUserStr = localStorage.getItem('zoneguard_user');
    if (storedUserStr) {
      try {
        const parsedUser = JSON.parse(storedUserStr);
        const fName = parsedUser.first_name || parsedUser.firstName || 'Homeowner';
        const lName = parsedUser.last_name || parsedUser.lastName || '';
        
        const fInitial = fName.charAt(0).toUpperCase();
        const lInitial = lName ? lName.charAt(0).toUpperCase() : '';

        setCurrentUser({
          firstName: fName,
          lastName: lName,
          initials: `${fInitial}${lInitial}`
        });
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('zoneguard_user');
    localStorage.removeItem('user');
  };

  return (
    <div className="layout-wrapper">
      {/* 1. THE PERMANENT SIDEBAR */}
      <aside className="sidebar">
        <div className="brand-header">
          <div className="brand-logo-zg">{Icons.shieldHome}</div>
          <div className="brand-text">
            <strong>ZoneGuard</strong>
            <span>NIA VILLAGE SUBD.</span>
          </div>
        </div>

        <nav className="nav-menu">
          {sidebarItems.map((item) => {
            // Check if the current route matches the button's link to highlight it
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link key={item.label} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <Link href="/homeowner/settings" className={`nav-link ${pathname === '/homeowner/settings' ? 'active' : ''}`}>
            <span className="nav-icon">{Icons.settings}</span>
            Account Settings
          </Link>
          <Link href="/login" onClick={handleLogout} className="nav-link btn-logout">
            <span className="nav-icon">{Icons.logout}</span>
            Logout
          </Link>
        </div>
      </aside>

      {/* 2. THE PERMANENT TOPBAR */}
      <main className="content-area">
        <header className="topbar">
          <div className="property-tabs">
            <button className="prop-tab active">Primary Residence (Zone 3)</button>
            <button className="prop-tab">Property 1 (Zone 3)</button>
            <button className="prop-tab">Property 2 (Zone 1)</button>
          </div>

          <div className="user-profile">
            <div className="user-info">
              <span className="user-name">
                {currentUser.firstName} {currentUser.lastName ? `${currentUser.lastName.charAt(0)}.` : ''}
              </span>
              <span className="user-role">HOMEOWNER</span>
            </div>
            <div className="user-avatar">{currentUser.initials}</div>
          </div>
        </header>

        {/* 3. THIS IS WHERE NEXT.JS INJECTS YOUR SPECIFIC PAGES! */}
        <div className="page-content">
            {children}
        </div>
      </main>
    </div>
  );
}