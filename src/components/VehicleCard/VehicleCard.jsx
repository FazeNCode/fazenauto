import styles from './VehicleCard.module.css';

export default function VehicleCard({ vehicle }) {
  return (
    <div className={styles.vehicleCard}>
      <div className={styles.imageWrapper}>
        <img
          src={vehicle.imageUrl}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          className={styles.vehicleImage}
        />
        <span className={styles.priceTag}>${vehicle.price.toLocaleString()}</span>
      </div>
      <div className={styles.vehicleInfo}>
        <h3>{vehicle.year} {vehicle.make} {vehicle.model}</h3>
        <p>Color: {vehicle.color}</p>
        <p>Mileage: {vehicle.mileage.toLocaleString()} mi</p>
        <p>Engine: {vehicle.engine}</p>
        <p>Drivetrain: {vehicle.drivetrain}</p>
        <p>Transmission: {vehicle.transmission}</p>

        <div className={styles.cardActions}>
          <button className={styles.editBtn}>Edit</button>
          <button className={styles.deleteBtn}>Delete</button>
        </div>
      </div>
    </div>
  );
}
