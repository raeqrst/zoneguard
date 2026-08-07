'use client';

import SidebarLayout, { Icons } from '../../components/SidebarLayout';
import './layout.css';

const menuItems = [
  { label: 'Dashboard', href: '/director/dashboard', icon: Icons.dashboard },
  { label: 'Escalated Complaints', href: '/director/escalated_complaints', icon: Icons.escalatedComplaints },
  { label: 'Executive Reports', href: '/director/executive_reports', icon: Icons.executiveReports },
];

export default function DirectorLayout({ children }) {
  return (
    <SidebarLayout 
      menuItems={menuItems} 
      settingsPath="/director/settings"
    >
      {children}
    </SidebarLayout>
  );
}