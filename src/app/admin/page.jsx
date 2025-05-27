// src/app/admin/page.jsx
import styles from './AdminPage.module.css';
import VehicleList from '@/components/VehicleList/VehicleList';

async function getVehicles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/vehicles`, {
    cache: 'no-store',
  });
  const data = await res.json();
  return data.data || [];
}

export default async function AdminPage() {
  const vehicles = await getVehicles();

  return (
    <div className={styles.adminDashboard}>
      <h1>Inventory</h1>
      <VehicleList vehicles={vehicles} />
    </div>
  );
}
