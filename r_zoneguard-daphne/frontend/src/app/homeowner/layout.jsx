'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import SidebarLayout, { Icons } from '../../components/SidebarLayout';
import './layout.css'; // <-- ADD THIS LINE HERE

const homeownerItems = [
  { label: 'Dashboard', href: '/homeowner/dashboard', icon: Icons.dashboard },
  { label: 'Payments', href: '/homeowner/payments', icon: Icons.payments },
  { label: 'Complaints', href: '/homeowner/complaints', icon: Icons.escalatedComplaints },
  { label: 'Tenant Management', href: '/homeowner/tenant_management', icon: Icons.tenant },
];

export default function HomeownerLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

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
        const loggedInUserId = localStorage.getItem('userId');

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

        const response = await fetch(`http://localhost:5000/api/homeowner/properties?userId=${loggedInUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.ok) {
          const data = await response.json();
          let fetchedProps = data.properties || [];

          fetchedProps.sort((a, b) => {
            const aIsPrimary = a.name.toLowerCase().includes('primary');
            const bIsPrimary = b.name.toLowerCase().includes('primary');
            if (aIsPrimary && !bIsPrimary) return -1;
            if (!aIsPrimary && bIsPrimary) return 1;
            return 0;
          });

          setProperties(fetchedProps);

          const urlParams = new URLSearchParams(window.location.search);
          const urlPropId = urlParams.get('propertyId');
          const storedId = localStorage.getItem('active_property_id');

          if (urlPropId && fetchedProps.some(p => String(p.id) === String(urlPropId))) {
            setSelectedPropertyId(urlPropId);
            localStorage.setItem('active_property_id', urlPropId);
          } else if (storedId && fetchedProps.some(p => String(p.id) === String(storedId))) {
            setSelectedPropertyId(storedId);
          } else if (fetchedProps.length > 0) {
            setSelectedPropertyId(fetchedProps[0].id);
            localStorage.setItem('active_property_id', fetchedProps[0].id);
          }
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
    window.dispatchEvent(new Event('propertyChanged'));
    router.push(`${pathname}?propertyId=${propertyId}`);
  };

  const topbarContent = (
    <>
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
    </>
  );

  return (
    <SidebarLayout 
      menuItems={homeownerItems} 
      settingsPath="/homeowner/settings"
      topbarContent={topbarContent}
    >
      {children}
    </SidebarLayout>
  );
}