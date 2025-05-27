import Sidebar from '@/components/Sidebar/Sidebar';
import './admin.css'; // You'll add layout styles here

export const metadata = {
  title: 'Admin Dashboard',
};

export default function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}
