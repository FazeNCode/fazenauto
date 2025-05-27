// "use client";

// import { useEffect, useState } from 'react';

// export default function VehiclesPage() {
//   const [vehicles, setVehicles] = useState([]);

//   useEffect(() => {
//     const fetchVehicles = async () => {
//       try {
//         const response = await fetch('/api/vehicles');
//         const data = await response.json();
//         if (data.success) {
//           setVehicles(data.data);
//         }
//       } catch (error) {
//         console.error('Error fetching vehicles:', error);
//       }
//     };

//     fetchVehicles();
//   }, []);

//   return (
//     <div>
//       <h1>Vehicle</h1>
//       <ul>
//         {vehicles.map((vehicle) => (
//           <li key={vehicle.vin}>
//             {vehicle.year} {vehicle.make} {vehicle.model} - {vehicle.color} ({vehicle.mileage} miles)
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }


// src/app/vehicles/page.jsx
'use client';

import { useEffect, useState } from 'react';
import VehicleCard from '../../components/VehicleCard/VehicleCard'

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
    <div className="vehicles-page">
      <h1>Our Vehicles</h1>
      <div className="vehicle-grid">
        {vehicles.map((vehicle) => (
          <VehicleCard key={vehicle.vin} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
}
