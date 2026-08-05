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
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  ),
  payments: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="6" width="20" height="12" rx="2"></rect>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M6 12h.01M18 12h.01"></path>
    </svg>
  ),
  complaints: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
      <line x1="12" y1="9" x2="12" y2="13"></line>
      <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
  ),
  tenant: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      <polyline points="9 22 9 12 15 12 15 22"></polyline>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l-.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
    </svg>
  ),
  logout: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
      <polyline points="16 17 21 12 16 7"></polyline>
      <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
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
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState({
    firstName: 'Homeowner',
    lastName: '',
    initials: 'H',
    role: 'HOMEOWNER'
  });

  const [properties, setProperties] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);

  useEffect(() => {
    async function loadHomeownerSession() {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('zoneguard_user');
        const loggedInUserId = localStorage.getItem('userId'); // Extract the saved ID

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          const fName = parsed.first_name || parsed.firstName || 'Homeowner';
          const lName = parsed.last_name || parsed.lastName || '';
          
          setCurrentUser({
            firstName: fName,
            lastName: lName,
            initials: `${fName.charAt(0)}${lName ? lName.charAt(0) : ''}`.toUpperCase(),
            role: 'HOMEOWNER'
          });
        }

        // Send the request to port 5000 and pass the userId
        const response = await fetch(`http://localhost:5000/api/homeowner/properties?userId=${loggedInUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          let fetchedProps = data.properties || [];

          // Sort the properties so that 'Primary Residence' always appears first
          fetchedProps.sort((a, b) => {
            const aIsPrimary = a.name.toLowerCase().includes('primary');
            const bIsPrimary = b.name.toLowerCase().includes('primary');
            if (aIsPrimary && !bIsPrimary) return -1;
            if (!aIsPrimary && bIsPrimary) return 1;
            return 0;
          });

          setProperties(fetchedProps);

          // Get URL parameter and stored ID to determine what should be selected
          const urlParams = new URLSearchParams(window.location.search);
          const urlPropId = urlParams.get('propertyId');
          const storedId = localStorage.getItem('active_property_id');

          // Prioritize URL > Valid Stored ID > First Item (which is now guaranteed to be Primary if it exists)
          if (urlPropId && fetchedProps.some(p => String(p.id) === String(urlPropId))) {
            setSelectedPropertyId(urlPropId);
            localStorage.setItem('active_property_id', urlPropId);
          } else if (storedId && fetchedProps.some(p => String(p.id) === String(storedId))) {
            setSelectedPropertyId(storedId);
          } else if (fetchedProps.length > 0) {
            setSelectedPropertyId(fetchedProps[0].id);
            localStorage.setItem('active_property_id', fetchedProps[0].id);
          }

        } else {
          setProperties([
            { id: 1, name: 'Primary Residence (NIA Village Subd.)' },
            { id: 2, name: 'Property 1 (NIA Village Subd.)' },
            { id: 3, name: 'Property 2 (NIA Village Subd.)' }
          ]);
          setSelectedPropertyId(1);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      }
    }

    loadHomeownerSession();
  }, []);

  const handlePropertySwitch = (propertyId) => {
    setSelectedPropertyId(propertyId);
    localStorage.setItem('active_property_id', propertyId);
    
    // Notify open pages that active property changed
    window.dispatchEvent(new Event('propertyChanged'));

    // Update the URL to fetch the selected property's data without leaving the current page
    router.push(`${pathname}?propertyId=${propertyId}`);
  };

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

  return (
    <div className="layout-wrapper">
      <div className="main-container">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="brand-header">
            <div className="brand-logo">{Icons.houseBrand}</div>
            <div className="brand-text">
              <strong>ZoneGuard</strong>
              <span>NIA VILLAGE SUBD.</span>
            </div>
          </div>

          <nav className="nav-menu">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.label} href={item.href} className={`nav-link ${isActive ? 'active' : ''}`}>
                  <span className="nav-icon">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-divider" />
            <Link href="/homeowner/settings" className={`nav-link ${pathname === '/homeowner/settings' ? 'active' : ''}`}>
              <span className="nav-icon">{Icons.settings}</span>
              <span>Account Settings</span>
            </Link>
            <button type="button" onClick={handleLogout} className="nav-link btn-logout">
              <span className="nav-icon">{Icons.logout}</span>
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="content-area">
          <header className="topbar">
            <div className="property-tabs">
              {properties.map((prop) => (
                <button
                  key={prop.id}
                  className={`prop-tab ${String(selectedPropertyId) === String(prop.id) ? 'active' : ''}`}
                  onClick={() => handlePropertySwitch(prop.id)}
                >
                  {prop.name}
                </button>
              ))}
            </div>

            <div className="user-profile">
              <div className="user-info">
                <span className="user-name">
                  {currentUser.firstName} {currentUser.lastName ? `${currentUser.lastName.charAt(0)}.` : ''}
                </span>
                <span className="user-role">{currentUser.role}</span>
              </div>
              <div className="user-avatar">{currentUser.initials}</div>
            </div>
          </header>

          <div className="page-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}