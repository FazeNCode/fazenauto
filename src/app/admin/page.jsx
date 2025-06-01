// src/app/admin/page.jsx
'use client';
import { useEffect, useState } from 'react';
import styles from './AdminPage.module.css';
import VehicleList from '@/components/VehicleList/VehicleList';

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch('/api/vehicles');
        const data = await res.json();
        if (data.success) {
          setVehicles(data.data || []);
        } else {
          throw new Error(data.error || 'Failed to fetch vehicles');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);

  if (loading) return <div>Loading vehicles...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.adminDashboard}>
      <h1>Inventory</h1>
      <VehicleList vehicles={vehicles} />
    </div>
  );
}
