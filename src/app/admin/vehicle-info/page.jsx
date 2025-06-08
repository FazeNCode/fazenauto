'use client';

import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import VINScanner from '@/components/VINScanner/VINScanner';
import { decodeVIN, validateVIN } from '@/utils/vinDecoder';
import styles from './VehicleInfo.module.css';

export default function VehicleInfoPage() {
  const [showVINScanner, setShowVINScanner] = useState(false);
  const [vinInput, setVinInput] = useState('');
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehicleHistory, setVehicleHistory] = useState(null);

  // Handle VIN input change
  const handleVinInputChange = (e) => {
    setVinInput(e.target.value.toUpperCase());
    setError('');
  };

  // Handle VIN detected from scanner
  const handleVINDetected = async (detectedVIN) => {
    setVinInput(detectedVIN);
    await lookupVehicleInfo(detectedVIN);
  };

  // Lookup vehicle information
  const lookupVehicleInfo = async (vin = vinInput) => {
    if (!vin) {
      setError('Please enter a VIN');
      return;
    }

    if (!validateVIN(vin)) {
      setError('Invalid VIN format. VIN must be 17 characters long and contain only letters and numbers (no I, O, or Q).');
      return;
    }

    setLoading(true);
    setError('');
    setVehicleData(null);
    setVehicleHistory(null);

    try {
      // Decode VIN using NHTSA API
      const result = await decodeVIN(vin);
      
      if (result.success) {
        setVehicleData(result.data);
        
        // Try to get vehicle history (placeholder for now)
        await getVehicleHistory(vin);
      } else {
        setError(`VIN Decoder Error: ${result.error}`);
      }
    } catch (err) {
      setError('Failed to lookup vehicle information. Please try again.');
      console.error('Vehicle lookup error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get vehicle history using our API
  const getVehicleHistory = async (vin) => {
    try {
      const response = await fetch('/api/vehicle-history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vin }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setVehicleHistory(result.data);
        } else {
          console.error('Vehicle history API error:', result.error);
          setVehicleHistory({
            hasHistory: false,
            error: result.error,
            message: 'Unable to retrieve vehicle history at this time.'
          });
        }
      } else {
        throw new Error('API request failed');
      }
    } catch (error) {
      console.error('Vehicle history lookup error:', error);
      setVehicleHistory({
        hasHistory: false,
        error: 'Network error',
        message: 'Unable to connect to vehicle history service.'
      });
    }
  };

  const handleManualLookup = () => {
    lookupVehicleInfo();
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Vehicle Information Lookup</h1>
          <p>Scan or enter a VIN to get detailed vehicle information</p>
        </div>

        <div className={styles.inputSection}>
          <div className={styles.vinInputGroup}>
            <input
              type="text"
              value={vinInput}
              onChange={handleVinInputChange}
              placeholder="Enter 17-character VIN"
              maxLength="17"
              className={styles.vinInput}
            />
            <button
              onClick={() => setShowVINScanner(true)}
              className={styles.scanButton}
            >
              📷 Scan VIN
            </button>
            <button
              onClick={handleManualLookup}
              disabled={loading || !vinInput || vinInput.length !== 17}
              className={styles.lookupButton}
            >
              {loading ? '🔄 Looking up...' : '🔍 Lookup'}
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.error}>
            {error}
          </div>
        )}

        {vehicleData && (
          <div className={styles.resultsSection}>
            <div className={styles.vehicleInfo}>
              <h2>Vehicle Information</h2>
              <div className={styles.infoGrid}>
                <div className={styles.infoCard}>
                  <h3>Basic Information</h3>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Make:</span>
                    <span className={styles.value}>{vehicleData.make || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Model:</span>
                    <span className={styles.value}>{vehicleData.model || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Year:</span>
                    <span className={styles.value}>{vehicleData.year || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Body Class:</span>
                    <span className={styles.value}>{vehicleData.bodyClass || 'N/A'}</span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Engine & Performance</h3>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Engine:</span>
                    <span className={styles.value}>{vehicleData.engine || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Cylinders:</span>
                    <span className={styles.value}>{vehicleData.engineCylinders || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Displacement:</span>
                    <span className={styles.value}>{vehicleData.engineLiters ? `${vehicleData.engineLiters}L` : 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Fuel Type:</span>
                    <span className={styles.value}>{vehicleData.fuelType || 'N/A'}</span>
                  </div>
                </div>

                <div className={styles.infoCard}>
                  <h3>Drivetrain & Transmission</h3>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Transmission:</span>
                    <span className={styles.value}>{vehicleData.transmission || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Drive Type:</span>
                    <span className={styles.value}>{vehicleData.driveType || 'N/A'}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.label}>Doors:</span>
                    <span className={styles.value}>{vehicleData.doors || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {vehicleHistory && (
              <div className={styles.historySection}>
                <h2>Vehicle History & Recalls</h2>

                {/* Recalls Section (Free NHTSA Data) */}
                {vehicleHistory.recalls && (
                  <div className={styles.recallsSection}>
                    <h3>Safety Recalls</h3>
                    {vehicleHistory.recalls.hasRecalls ? (
                      <div className={styles.recallsData}>
                        <p className={styles.recallCount}>
                          ⚠️ {vehicleHistory.recalls.count} recall(s) found
                        </p>
                        <div className={styles.recallsList}>
                          {vehicleHistory.recalls.recalls.slice(0, 3).map((recall, index) => (
                            <div key={index} className={styles.recallItem}>
                              <h4>{recall.Component}</h4>
                              <p><strong>Date:</strong> {recall.ReportReceivedDate}</p>
                              <p><strong>Summary:</strong> {recall.Summary}</p>
                            </div>
                          ))}
                        </div>
                        <p className={styles.dataSource}>Source: {vehicleHistory.recalls.source}</p>
                      </div>
                    ) : (
                      <div className={styles.noRecalls}>
                        <p>✅ No recalls found for this vehicle</p>
                        <p className={styles.dataSource}>Source: {vehicleHistory.recalls.source}</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Premium History Services */}
                <div className={styles.premiumSection}>
                  <h3>Complete Vehicle History</h3>
                  <p>For comprehensive vehicle history including accidents, ownership, and title information, consider these services:</p>

                  {vehicleHistory.integrationOptions && (
                    <div className={styles.serviceOptions}>
                      {vehicleHistory.integrationOptions.recommended.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                          <h4>{service.service}</h4>
                          <p className={styles.serviceCost}>{service.cost}</p>
                          <ul className={styles.serviceFeatures}>
                            {service.features.map((feature, fIndex) => (
                              <li key={fIndex}>{feature}</li>
                            ))}
                          </ul>
                          {service.note && (
                            <p className={styles.serviceNote}>{service.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIN Scanner Modal */}
        {showVINScanner && (
          <VINScanner
            onVINDetected={handleVINDetected}
            onClose={() => setShowVINScanner(false)}
          />
        )}
      </div>
    </ProtectedRoute>
  );
}
