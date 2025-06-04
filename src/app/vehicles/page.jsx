
'use client';

import { useEffect, useState } from 'react';
import VehicleCard from '../../components/VehicleCard/VehicleCard';
import styles from './VehiclesPage.module.css';

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles');
        const data = await response.json();
        if (data.success) {
          setVehicles(data.data);
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  return (
    <div className={styles.vehiclesPage}>
      <h1>Our Vehicles</h1>
      <div className={styles.vehicleGrid}>
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.vin} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
