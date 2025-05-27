// src/components/VehicleCard.jsx

export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
      <p>Color: {vehicle.color}</p>
      <p>Mileage: {vehicle.mileage} miles</p>
      {/* Optionally include an image if available */}
      {vehicle.imageUrl && <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />}
    </div>
  );
}
