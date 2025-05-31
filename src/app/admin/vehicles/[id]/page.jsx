// /src/app/admin/vehicles/[id]/page.jsx
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);

  useEffect(() => {
    async function fetchVehicle() {
      const res = await fetch(`/api/vehicles/${id}`);
      const data = await res.json();
      setVehicle(data);
    }

    fetchVehicle();
  }, [id]);

  if (!vehicle) return <p>Loading vehicle details...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>{vehicle.year} {vehicle.make} {vehicle.model}</h1>
      <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} style={{ maxWidth: '100%', borderRadius: '8px' }} />
      <p><strong>VIN:</strong> {vehicle.vin}</p>
      <p><strong>Color:</strong> {vehicle.color}</p>
      <p><strong>Mileage:</strong> {vehicle.mileage.toLocaleString()} mi</p>
      <p><strong>Engine:</strong> {vehicle.engine || 'N/A'}</p>
      <p><strong>Drivetrain:</strong> {vehicle.drivetrain || 'N/A'}</p>
      <p><strong>Transmission:</strong> {vehicle.transmission || 'N/A'}</p>
      <p><strong>Location:</strong> {vehicle.location || 'N/A'}</p>
      <p><strong>Price:</strong> ${vehicle.price.toLocaleString()}</p>
    </div>
  );
}
