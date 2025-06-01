

'use client';
import { useEffect, useState } from 'react';

export default function QualityUsedCars() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
  const fetchVehicles = async () => {
    try {
      // Use relative path for API calls - works in both development and production
      const res = await fetch('/api/vehicles');
      const json = await res.json();

      if (json.success && Array.isArray(json.data)) {
        setVehicles(json.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchVehicles();
}, []);

  if (loading) return <p>Loading vehicles...</p>;
  if (error) return <p>Error loading vehicles: {error}</p>;

  return (
    <div className="vehicle-list">
      <h1>Quality Used Cars</h1>
      {vehicles.length === 0 ? (
        <p>No vehicles available.</p>
      ) : (
        vehicles.map((vehicle) => (
          <div key={vehicle._id} className="vehicle-card">
            <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />
            <h2>{vehicle.year} {vehicle.make} {vehicle.model}</h2>
            <p>Color: {vehicle.color}</p>
            <p>Mileage: {vehicle.mileage} mi</p>
            <p>Price: ${vehicle.price}</p>
          </div>
        ))
      )}
    </div>
  );
}
