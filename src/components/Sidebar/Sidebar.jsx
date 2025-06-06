// 'use client';
// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { Home, Upload, Users } from 'lucide-react';

// const navItems = [
//   { name: 'Vehicles', href: '/admin', icon: <Home size={18} /> },
//   { name: 'Upload New', href: '/admin/upload', icon: <Upload size={18} /> },
//   { name: 'Dealers', href: '/admin/dealers', icon: <Users size={18} /> },
// ];

// export default function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col">
//       <div className="text-2xl font-bold p-6 border-b border-gray-700">
//         Admin Panel
//       </div>
//       <nav className="flex-1 p-4 space-y-2">
//         {navItems.map((item) => (
//           <Link
//             key={item.name}
//             href={item.href}
//             className={`flex items-center gap-2 p-3 rounded-lg transition hover:bg-gray-700 ${
//               pathname === item.href ? 'bg-gray-700' : ''
//             }`}
//           >
//             {item.icon}
//             <span>{item.name}</span>
//           </Link>
//         ))}
//       </nav>
//     </aside>
//   );
// }

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import './Sidebar.css'; // You'll create this CSS file

const navItems = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Upload New', href: '/vehicles/upload' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    // Clear user session
    localStorage.removeItem('user');
    // Redirect to login page
    router.push('/login');
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  return (
    <>
      {/* Toggle Button - Always Visible */}
      <button
        className={`sidebar-toggle ${collapsed ? 'collapsed' : ''}`}
        onClick={onToggle}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '»' : '«'}
      </button>

      {/* Sidebar Content - Hidden when collapsed */}
      <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header">
          <h2 className="sidebar-title">Admin Portal</h2>
        </div>

        <nav>
          <ul>
            {navItems.map(({ label, href }) => (
              <li key={href} className={pathname === href ? 'active' : ''}>
                <Link href={href}>{label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogoutClick} className="logout-btn">
            Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <h3>Are you sure you want to log out?</h3>
            <div className="logout-modal-buttons">
              <button onClick={confirmLogout} className="logout-confirm-btn">
                Yes
              </button>
              <button onClick={cancelLogout} className="logout-cancel-btn">
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

