'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import AdminProtectedLayout from '@/components/AdminProtectedLayout/AdminProtectedLayout';
import './admin.css'; // You'll add layout styles here

export default function AdminLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <AdminProtectedLayout>
      <div className={`admin-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
        <main className="admin-content">
          {children}
        </main>
      </div>
    </AdminProtectedLayout>
  );
}
