'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './VehicleDetails.module.css';

export default function VehicleDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const res = await fetch(`/api/vehicles/${id}`);
        const data = await res.json();
        
        if (data.success) {
          setVehicle(data.data);
        } else {
          setError('Vehicle not found');
        }
      } catch (err) {
        setError('Failed to load vehicle details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVehicle();
    }
  }, [id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading vehicle details...</p>
        </div>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <h2>Vehicle Not Found</h2>
          <p>{error || 'The vehicle you are looking for could not be found.'}</p>
          <button 
            onClick={() => router.push('/inventory/used-cars')}
            className={styles.backBtn}
          >
            Back to Inventory
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button 
          onClick={() => router.push('/inventory/used-cars')}
          className={styles.backBtn}
        >
          ← Back to Inventory
        </button>
      </div>

      <div className={styles.vehicleDetails}>
        {/* Vehicle Image */}
        <div className={styles.imageSection}>
          <img
            src={vehicle.imageUrl}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            className={styles.vehicleImage}
          />
        </div>

        {/* Vehicle Information */}
        <div className={styles.infoSection}>
          <div className={styles.titleSection}>
            <h1 className={styles.vehicleTitle}>
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h1>
            <div className={styles.priceSection}>
              <span className={styles.price}>
                ${vehicle.price?.toLocaleString() || 'N/A'}
              </span>
              <span className={styles.taxText}>+ Tax</span>
            </div>
            <div className={styles.estimatedPayment}>
              Est. ${Math.round((vehicle.price || 0) / 60)}/mo
            </div>
          </div>

          {/* Key Specifications */}
          <div className={styles.specsGrid}>
            <div className={styles.specCard}>
              <h3>Odometer</h3>
              <p>{vehicle.mileage ? `${vehicle.mileage.toLocaleString()} km` : 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Engine</h3>
              <p>{vehicle.engine || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Engine Size</h3>
              <p>{vehicle.engineSize || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Transmission</h3>
              <p>{vehicle.transmission || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Drivetrain</h3>
              <p>{vehicle.drivetrain || vehicle.driveline || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Fuel Type</h3>
              <p>{vehicle.fuelType || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Exterior</h3>
              <p>{vehicle.color || 'N/A'}</p>
            </div>
            <div className={styles.specCard}>
              <h3>Interior</h3>
              <p>{vehicle.interiorColor || 'N/A'}</p>
            </div>
          </div>

          {/* Additional Details */}
          <div className={styles.detailsSection}>
            <h2>Vehicle Details</h2>
            <div className={styles.detailsList}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>VIN:</span>
                <span className={styles.detailValue}>{vehicle.vin || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Year:</span>
                <span className={styles.detailValue}>{vehicle.year || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Make:</span>
                <span className={styles.detailValue}>{vehicle.make || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Model:</span>
                <span className={styles.detailValue}>{vehicle.model || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Body Type:</span>
                <span className={styles.detailValue}>{vehicle.bodyType || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Engine Size:</span>
                <span className={styles.detailValue}>{vehicle.engineSize || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Doors:</span>
                <span className={styles.detailValue}>{vehicle.doors || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Exterior Color:</span>
                <span className={styles.detailValue}>{vehicle.color || 'N/A'}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Interior Color:</span>
                <span className={styles.detailValue}>{vehicle.interiorColor || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actionButtons}>
            <button className={styles.contactBtn}>
              Contact Us About This Vehicle
            </button>
            <button className={styles.financeBtn}>
              Get Financing Info
            </button>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            <p><strong>Note:</strong> All vehicles are sold as-is. Prices do not include taxes, licensing, and other fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
