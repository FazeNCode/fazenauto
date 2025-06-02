

'use client';
import { useEffect, useState } from 'react';
import styles from './QualityUsedCars.module.css';

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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    // Re-trigger the useEffect
    window.location.reload();
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading our quality vehicles...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <p className={styles.errorText}>Oops! Something went wrong</p>
          <p>Error: {error}</p>
          <button onClick={handleRetry} className={styles.retryBtn}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Used Vehicles</h1>
        <p className={styles.heroSubtitle}>
          Discover our carefully selected collection of premium pre-owned vehicles.
          All vehicles are sold as-is with competitive pricing.
        </p>
      </div>

      <div className={styles.contentWrapper}>
        {/* Stats Section */}
        <div className={styles.statsSection}>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>{vehicles.length}</span>
            <span className={styles.statLabel}>Available Cars</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>As-Is</span>
            <span className={styles.statLabel}>Pricing</span>
          </div>
          <div className={styles.statCard}>
            <span className={styles.statNumber}>5★</span>
            <span className={styles.statLabel}>Customer Rating</span>
          </div>
        </div>

        {/* Vehicle Grid */}
        {vehicles.length === 0 ? (
          <div className={styles.emptyContainer}>
            <div className={styles.emptyIcon}>🚗</div>
            <p className={styles.emptyText}>No vehicles available at the moment</p>
            <p className={styles.emptySubtext}>Check back soon for new arrivals!</p>
          </div>
        ) : (
          <div className={styles.vehicleGrid}>
            {vehicles.map((vehicle) => (
              <div key={vehicle._id} className={styles.vehicleCard}>
                <img
                  src={vehicle.imageUrl}
                  alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                  className={styles.vehicleImage}
                />

                <div className={styles.vehicleInfo}>
                  <h2 className={styles.vehicleTitle}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>

                  <div className={styles.vehicleDetails}>
                    <span className={styles.mileage}>
                      {vehicle.mileage ? `${(vehicle.mileage * 1.60934).toLocaleString(undefined, { maximumFractionDigits: 0 })} km` : 'N/A'}
                    </span>
                  </div>

                  <div className={styles.vehicleSpecs}>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Engine:</span>
                      <span className={styles.specValue}>{vehicle.engine || 'N/A'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Transmission:</span>
                      <span className={styles.specValue}>{vehicle.transmission || 'N/A'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Fuel Type:</span>
                      <span className={styles.specValue}>{vehicle.fuelType || 'N/A'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Doors:</span>
                      <span className={styles.specValue}>{vehicle.doors || 'N/A'}</span>
                    </div>
                    <div className={styles.specItem}>
                      <span className={styles.specLabel}>Driveline:</span>
                      <span className={styles.specValue}>{vehicle.drivetrain || vehicle.driveline || 'N/A'}</span>
                    </div>
                  </div>

                  <div className={styles.vehiclePrice}>
                    ${vehicle.price?.toLocaleString() || 'N/A'} <span className={styles.taxText}>+ Tax</span>
                  </div>

                  <div className={styles.estimatedPayment}>
                    Est. ${Math.round((vehicle.price || 0) / 60)}/mo
                  </div>

                  <div className={styles.buttonGroup}>
                    <button className={styles.viewDetailsBtn}>
                      View Details
                    </button>
                    <button className={styles.contactBtn}>
                      Contact Us
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
