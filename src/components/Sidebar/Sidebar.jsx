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
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './Sidebar.css'; // You'll create this CSS file

const navItems = [
  { label: 'Vehicles', href: '/admin/vehicles' },
  { label: 'Upload New', href: '/admin/upload' },
  { label: 'Dealers', href: '/admin/dealers' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Fazen Auto Admin</h2>
      <nav>
        <ul>
          {navItems.map(({ label, href }) => (
            <li key={href} className={pathname === href ? 'active' : ''}>
              <Link href={href}>{label}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

