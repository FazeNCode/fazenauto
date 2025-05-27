// At the top of the file
'use client';
import styles from './VehicleList.module.css';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


export default function VehicleList({ vehicles }) {
  const router = useRouter();

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this vehicle?');
    if (!confirm) return;

    try {
      const res = await fetch(`/api/vehicles/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        router.refresh(); // Re-fetch the page data
      } else {
        alert('Failed to delete vehicle');
      }
    } catch (err) {
      console.error('Error deleting vehicle:', err);
    }
  };

  return (
    <div className={styles.vehicleGrid}>
      {vehicles.map((vehicle) => (
        <div key={vehicle._id} className={styles.vehicleCard}>
          <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} className={styles.vehicleImage} />
          <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
          <p>VIN: {vehicle.vin}</p>
          <p>Color: {vehicle.color}</p>
          <p>Mileage: {vehicle.mileage.toLocaleString()} mi</p>
          <p>Price: ${vehicle.price.toLocaleString()}</p>
          
          <div className={styles.actions}>
        
        <Link href={`/admin/vehicles/${vehicle._id}/edit`}>
        <button>Edit</button>
        </Link>
            <button onClick={() => handleDelete(vehicle._id)} className={styles.deleteButton}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
