// // src/components/VehicleCard.jsx

// export default function VehicleCard({ vehicle }) {
//   return (
//     <div className="vehicle-card">
//       <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
//       <p>Color: {vehicle.color}</p>
//       <p>Mileage: {vehicle.mileage} miles</p>
//       {/* Optionally include an image if available */}
//       {vehicle.imageUrl && <img src={vehicle.imageUrl} alt={`${vehicle.make} ${vehicle.model}`} />}
//     </div>
//   );
// }



export default function VehicleCard({ vehicle }) {
  return (
    <div className="vehicle-card">
      <div className="image-wrapper">
        <img src={vehicle.imageUrl} alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />
        <span className="price">${vehicle.price.toLocaleString()}</span>
      </div>
      <div className="vehicle-info">
        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p>Color: {vehicle.color}</p>
        <p>Mileage: {vehicle.mileage.toLocaleString()} mi</p>
        <p>Engine: {vehicle.engine}</p>
        <p>Drivetrain: {vehicle.drivetrain}</p>
        <p>Transmission: {vehicle.transmission}</p>

        <div className="card-actions">
          <button className="edit-btn">Edit</button>
          <button className="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  );
}
