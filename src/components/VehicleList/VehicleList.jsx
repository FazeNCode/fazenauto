// 'use client';
// import styles from './VehicleList.module.css';
// import { useRouter } from 'next/navigation';
// import Link from 'next/link';

// export default function VehicleList({ vehicles }) {
//   const router = useRouter();

//   const handleDelete = async (id) => {
//     const confirm = window.confirm('Are you sure you want to delete this vehicle?');
//     if (!confirm) return;

//     try {
//       const res = await fetch(`/api/vehicles/${id}`, {
//         method: 'DELETE',
//       });

//       if (res.ok) {
//         router.refresh(); // Re-fetch the page data
//       } else {
//         alert('Failed to delete vehicle');
//       }
//     } catch (err) {
//       console.error('Error deleting vehicle:', err);
//     }
//   };

//   return (
//     <div className={styles.vehicleGrid}>
//       {vehicles.map((vehicle) => (
//         <div key={vehicle._id} className={styles.vehicleCard}>
//           <div className={styles.imageWrapper}>
//             <img
//               src={vehicle.imageUrl}
//               alt={`${vehicle.make} ${vehicle.model}`}
//               className={styles.vehicleImage}
//             />
//             <span className={styles.priceTag}>${vehicle.price.toLocaleString()}</span>
//           </div>

//           <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
//           <p>Color: {vehicle.color}</p>
//           <p>Mileage: {vehicle.mileage.toLocaleString()} mi</p>
//           <p>Engine: {vehicle.engine}</p>
//           <p>Drivetrain: {vehicle.drivetrain}</p>
//           <p>Transmission: {vehicle.transmission}</p>

//           <div className={styles.actions}>
//             <Link href={`/admin/vehicles/${vehicle._id}/edit`}>
//               <button>Edit</button>
//             </Link>
//             <button onClick={() => handleDelete(vehicle._id)} className={styles.deleteButton}>
//               Delete
//             </button>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


// /src/app/admin/VehicleList.jsx

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
        router.refresh();
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
  <Link href={`/admin/vehicles/${vehicle._id}`}>
    <div className={styles.imageWrapper}>
      <img
        src={vehicle.imageUrl}
        alt={`${vehicle.make} ${vehicle.model}`}
        className={styles.vehicleImage}
      />
      <div className={styles.priceTag}>${vehicle.price.toLocaleString()}</div>
    </div>
    <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
    <p><strong>Mileage:</strong> {(vehicle.mileage * 1.60934).toLocaleString(undefined, { maximumFractionDigits: 1 })} km</p>
    <p><strong>Engine:</strong> {vehicle.engine || 'N/A'}</p>
    <p><strong>Drivetrain:</strong> {vehicle.drivetrain || 'N/A'}</p>
    <p><strong>Transmission:</strong> {vehicle.transmission || 'N/A'}</p>
       <p><strong>Color:</strong> {vehicle.color || 'N/A'}</p>
  </Link>

  <div className={styles.actions}>
    <Link href={`/admin/vehicles/${vehicle._id}/edit`}>
      <button>Edit</button>
    </Link>
    <button onClick={() => handleDelete(vehicle._id)} className={styles.deleteButton}>
      Delete
    </button>
  </div>
</div>

      ))}
    </div>
  );
}
