// src/app/admin/page.jsx
'use client';
import { useEffect, useState } from 'react';
import styles from './AdminPage.module.css';
import VehicleTable from '@/components/VehicleTable/VehicleTable';

export default function AdminPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    make: '',
    year: '',
    status: 'all'
  });

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();

      if (filters.search) queryParams.append('search', filters.search);
      if (filters.make) queryParams.append('make', filters.make);
      if (filters.year) queryParams.append('year', filters.year);
      if (filters.status !== 'all') queryParams.append('status', filters.status);

      const res = await fetch(`/api/vehicles?${queryParams}`);
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

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const handleDelete = async (vehicleId) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setVehicles(vehicles.filter(v => v._id !== vehicleId));
      } else {
        throw new Error('Failed to delete vehicle');
      }
    } catch (err) {
      alert('Error deleting vehicle: ' + err.message);
    }
  };

  return (
    <div className={styles.adminDashboard}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h1>Vehicle Inventory Management</h1>
        </div>
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Vehicles</h3>
            <p>{vehicles.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Active Listings</h3>
            <p>{vehicles.filter(v => v.status === 'active').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Draft Listings</h3>
            <p>{vehicles.filter(v => v.status === 'draft').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Sold Vehicles</h3>
            <p>{vehicles.filter(v => v.status === 'sold').length}</p>
          </div>
        </div>
      </div>

      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        error={error}
        filters={filters}
        setFilters={setFilters}
        onDelete={handleDelete}
        onRefresh={fetchVehicles}
      />
    </div>
  );
}
