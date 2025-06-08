'use client';

import { useState, useEffect } from 'react';
import styles from './SyndicationPanel.module.css';

export default function SyndicationPanel({ selectedVehicles = [], onRefresh }) {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [syndicating, setSyndicating] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [results, setResults] = useState(null);
  const [vehicleStatuses, setVehicleStatuses] = useState({});

  // Fetch available platforms
  useEffect(() => {
    fetchPlatforms();
  }, []);

  // Fetch vehicle statuses when selection changes
  useEffect(() => {
    if (selectedVehicles.length > 0) {
      fetchVehicleStatuses();
    }
  }, [selectedVehicles]);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/syndication?action=platforms');
      const data = await response.json();
      
      if (data.success) {
        setPlatforms(data.platforms);
      }
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
    }
  };

  const fetchVehicleStatuses = async () => {
    setLoading(true);
    try {
      const statuses = {};
      
      for (const vehicleId of selectedVehicles) {
        const response = await fetch(`/api/syndication?action=status&vehicleId=${vehicleId}`);
        const data = await response.json();
        
        if (data.success) {
          statuses[vehicleId] = data.platforms;
        }
      }
      
      setVehicleStatuses(statuses);
    } catch (error) {
      console.error('Failed to fetch vehicle statuses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platformId) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleSyndicate = async () => {
    if (selectedVehicles.length === 0 || selectedPlatforms.length === 0) {
      alert('Please select vehicles and platforms');
      return;
    }

    setSyndicating(true);
    setResults(null);

    try {
      const response = await fetch('/api/syndication', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vehicleIds: selectedVehicles,
          platforms: selectedPlatforms,
          settings: {
            userId: 'current-user', // Replace with actual user ID
            platformSettings: {
              // Add platform-specific settings here
            }
          }
        }),
      });

      const data = await response.json();
      setResults(data);
      
      if (data.success) {
        // Refresh vehicle statuses
        await fetchVehicleStatuses();
        // Refresh parent component
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Syndication failed:', error);
      setResults({
        success: false,
        error: error.message
      });
    } finally {
      setSyndicating(false);
    }
  };

  const handleRemove = async () => {
    if (selectedVehicles.length === 0) {
      alert('Please select vehicles');
      return;
    }

    if (!confirm('Remove selected vehicles from all platforms?')) {
      return;
    }

    setSyndicating(true);

    try {
      const response = await fetch(
        `/api/syndication?vehicleIds=${selectedVehicles.join(',')}&platforms=${selectedPlatforms.join(',')}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      setResults(data);
      
      if (data.success) {
        await fetchVehicleStatuses();
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Removal failed:', error);
      setResults({
        success: false,
        error: error.message
      });
    } finally {
      setSyndicating(false);
    }
  };

  const handleExportCSV = async (format = 'standard') => {
    if (selectedVehicles.length === 0) {
      alert('Please select vehicles to export');
      return;
    }

    try {
      const response = await fetch(
        `/api/export/csv?vehicleIds=${selectedVehicles.join(',')}&format=${format}`
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `fazenauto_export_${format}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        const error = await response.json();
        alert(`Export failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  };

  return (
    <div className={styles.syndicationPanel}>
      <div className={styles.header}>
        <h3>Vehicle Syndication</h3>
        <span className={styles.selectedCount}>
          {selectedVehicles.length} vehicle(s) selected
        </span>
      </div>

      {/* Platform Selection */}
      <div className={styles.section}>
        <h4>Select Platforms</h4>
        <div className={styles.platformGrid}>
          {platforms.map(platform => (
            <div 
              key={platform.id} 
              className={`${styles.platformCard} ${!platform.enabled ? styles.disabled : ''}`}
            >
              <label className={styles.platformLabel}>
                <input
                  type="checkbox"
                  checked={selectedPlatforms.includes(platform.id)}
                  onChange={() => handlePlatformToggle(platform.id)}
                  disabled={!platform.enabled || syndicating}
                />
                <div className={styles.platformInfo}>
                  <span className={styles.platformName}>{platform.name}</span>
                  <span className={styles.platformDesc}>{platform.description}</span>
                  {!platform.enabled && (
                    <span className={styles.platformStatus}>Not configured</span>
                  )}
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className={styles.actions}>
        <button
          onClick={handleSyndicate}
          disabled={selectedVehicles.length === 0 || selectedPlatforms.length === 0 || syndicating}
          className={styles.primaryBtn}
        >
          {syndicating ? 'Syndicating...' : 'Syndicate to Selected Platforms'}
        </button>

        <button
          onClick={handleRemove}
          disabled={selectedVehicles.length === 0 || syndicating}
          className={styles.dangerBtn}
        >
          Remove from Platforms
        </button>

        <div className={styles.exportGroup}>
          <span>Export:</span>
          <button onClick={() => handleExportCSV('standard')} className={styles.secondaryBtn}>
            Standard CSV
          </button>
          <button onClick={() => handleExportCSV('facebook')} className={styles.secondaryBtn}>
            Facebook CSV
          </button>
          <button onClick={() => handleExportCSV('craigslist')} className={styles.secondaryBtn}>
            Craigslist CSV
          </button>
        </div>
      </div>

      {/* Vehicle Status Display */}
      {selectedVehicles.length > 0 && (
        <div className={styles.section}>
          <h4>Current Syndication Status</h4>
          {loading ? (
            <div className={styles.loading}>Loading statuses...</div>
          ) : (
            <div className={styles.statusGrid}>
              {selectedVehicles.map(vehicleId => (
                <div key={vehicleId} className={styles.vehicleStatus}>
                  <div className={styles.vehicleId}>Vehicle: {vehicleId.slice(-6)}</div>
                  <div className={styles.platformStatuses}>
                    {platforms.map(platform => {
                      const status = vehicleStatuses[vehicleId]?.[platform.id];
                      return (
                        <div key={platform.id} className={styles.platformStatus}>
                          <span className={styles.platformName}>{platform.name}:</span>
                          <span className={`${styles.status} ${styles[status?.status || 'none']}`}>
                            {status?.statusDisplay || 'Not synced'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Display */}
      {results && (
        <div className={styles.results}>
          <h4>Syndication Results</h4>
          {results.success ? (
            <div className={styles.successResults}>
              <div className={styles.summary}>
                <span>✅ {results.summary.successful} successful</span>
                {results.summary.failed > 0 && (
                  <span>❌ {results.summary.failed} failed</span>
                )}
              </div>
              <div className={styles.resultDetails}>
                {results.results.map((result, index) => (
                  <div key={index} className={styles.resultItem}>
                    <span>Vehicle {result.vehicleId?.slice(-6)}</span>
                    {result.success ? (
                      <span className={styles.success}>✅ Success</span>
                    ) : (
                      <span className={styles.error}>❌ {result.error}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={styles.errorResults}>
              <span>❌ {results.error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
