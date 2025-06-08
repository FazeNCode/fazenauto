

'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import { decodeVIN, validateVIN, mapVINToFormData } from '@/utils/vinDecoder';
import VINScanner from '@/components/VINScanner/VINScanner';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [vinDecoding, setVinDecoding] = useState(false);
  const [vinData, setVinData] = useState(null);
  const [showVINScanner, setShowVINScanner] = useState(false);
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    color: '',
    vin: '',
    mileage: '',
    price: '',
    engine: '',
    transmission: '',
    drivetrain: ''
  });

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle VIN decoding
  const handleDecodeVIN = async () => {
    if (!formData.vin) {
      setMessage('Please enter a VIN first');
      return;
    }

    if (!validateVIN(formData.vin)) {
      setMessage('Invalid VIN format. VIN must be 17 characters long and contain only letters and numbers (no I, O, or Q).');
      return;
    }

    setVinDecoding(true);
    setMessage('');

    try {
      const result = await decodeVIN(formData.vin);

      if (result.success) {
        const mappedData = mapVINToFormData(result.data);
        setVinData(result.data);

        // Auto-populate form fields
        setFormData(prev => ({
          ...prev,
          make: mappedData.make || prev.make,
          model: mappedData.model || prev.model,
          year: mappedData.year || prev.year,
          engine: mappedData.engine || prev.engine,
          transmission: mappedData.transmission || prev.transmission,
          drivetrain: mappedData.driveline || prev.drivetrain
        }));

        setMessage(`✅ VIN decoded successfully! Auto-populated: ${mappedData.year} ${mappedData.make} ${mappedData.model}`);
      } else {
        setMessage(`❌ VIN Decoder Error: ${result.error}`);
      }
    } catch (error) {
      setMessage('❌ Error decoding VIN. Please try again.');
      console.error('VIN Decode Error:', error);
    } finally {
      setVinDecoding(false);
    }
  };

  // Handle VIN detected from scanner
  const handleVINDetected = async (detectedVIN) => {
    setFormData(prev => ({
      ...prev,
      vin: detectedVIN
    }));

    // Automatically decode the detected VIN
    if (validateVIN(detectedVIN)) {
      setVinDecoding(true);
      try {
        const result = await decodeVIN(detectedVIN);
        if (result.success) {
          const mappedData = mapVINToFormData(result.data);
          setVinData(result.data);

          setFormData(prev => ({
            ...prev,
            vin: detectedVIN,
            make: mappedData.make || prev.make,
            model: mappedData.model || prev.model,
            year: mappedData.year || prev.year,
            engine: mappedData.engine || prev.engine,
            transmission: mappedData.transmission || prev.transmission,
            drivetrain: mappedData.driveline || prev.drivetrain
          }));

          setMessage(`✅ VIN scanned and decoded successfully! Auto-populated: ${mappedData.year} ${mappedData.make} ${mappedData.model}`);
        } else {
          setMessage(`✅ VIN scanned: ${detectedVIN}. Click "Decode VIN" to auto-populate details.`);
        }
      } catch (error) {
        setMessage(`✅ VIN scanned: ${detectedVIN}. Click "Decode VIN" to auto-populate details.`);
      } finally {
        setVinDecoding(false);
      }
    } else {
      setMessage(`⚠️ Scanned VIN may be invalid: ${detectedVIN}. Please verify.`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const submitFormData = new FormData(e.target);

      const res = await fetch('/api/vehicles/upload', {
        method: 'POST',
        body: submitFormData,
      });

      const data = await res.json();
      setMessage(data.message || 'Vehicle uploaded successfully!');
    } catch (error) {
      setMessage('Error uploading vehicle. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className={styles.container}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Upload a Vehicle</h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className={styles.form}>

          {/* Basic Vehicle Information */}
          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Make *</label>
              <input
                name="make"
                value={formData.make}
                onChange={handleInputChange}
                placeholder="e.g., Toyota, Honda, Ford"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Model *</label>
              <input
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g., Camry, Civic, F-150"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Year *</label>
              <input
                name="year"
                type="number"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g., 2020"
                min="1900"
                max="2025"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Color *</label>
              <input
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g., Black, White, Silver"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>VIN *
              <span className={styles.vinHelper}>
                (17-character Vehicle Identification Number)
              </span>
            </label>
            <div className={styles.vinInputGroup}>
              <input
                name="vin"
                value={formData.vin}
                onChange={handleInputChange}
                placeholder="Enter VIN to auto-populate vehicle details"
                maxLength="17"
                required
                className={styles.input}
                style={{ textTransform: 'uppercase' }}
              />
              <button
                type="button"
                onClick={() => setShowVINScanner(true)}
                className={styles.scanButton}
              >
                📷 Scan VIN
              </button>
              <button
                type="button"
                onClick={handleDecodeVIN}
                disabled={vinDecoding || !formData.vin || formData.vin.length !== 17}
                className={styles.decodeButton}
              >
                {vinDecoding ? '🔄 Decoding...' : '🔍 Decode VIN'}
              </button>
            </div>
            <small className={styles.helpText}>
              Enter a 17-character VIN and click "Decode VIN" to automatically fill vehicle details
            </small>
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Mileage *</label>
              <input
                name="mileage"
                type="number"
                value={formData.mileage}
                onChange={handleInputChange}
                placeholder="Miles (e.g., 50000)"
                min="0"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Price *</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="Price in USD (e.g., 25000)"
                min="0"
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className={styles.sectionHeader}>
            <h3>Technical Specifications</h3>
            {vinData && (
              <small className={styles.autoFilledNote}>
                ✅ Auto-filled from VIN: {vinData.year} {vinData.make} {vinData.model}
              </small>
            )}
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Engine *</label>
              <input
                name="engine"
                value={formData.engine}
                onChange={handleInputChange}
                placeholder="e.g., V6, 4-Cylinder, V8"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Transmission *</label>
              <input
                name="transmission"
                value={formData.transmission}
                onChange={handleInputChange}
                placeholder="e.g., Automatic, Manual"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Drivetrain *</label>
            <input
              name="drivetrain"
              value={formData.drivetrain}
              onChange={handleInputChange}
              placeholder="e.g., FWD, AWD, RWD, 4WD"
              required
              className={styles.input}
            />
          </div>

          {/* Vehicle Images */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Vehicle Images * (Select multiple photos)</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              required
              className={styles.fileInput}
            />
            <small className={styles.helpText}>
              You can select up to 50 photos. Hold Ctrl/Cmd to select multiple files.
            </small>
          </div>

          {/* Vehicle Video */}
          <div className={styles.inputGroup}>
            <label className={styles.label}>Vehicle Video (Optional)</label>
            <input
              type="file"
              name="video"
              accept="video/mp4,video/avi,video/mov,video/wmv,video/webm"
              className={styles.fileInput}
            />
            <small className={styles.helpText}>
              Upload a video of the vehicle (MP4, AVI, MOV, WMV, WebM). Maximum size: 100MB.
            </small>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={styles.submitButton}
          >
            {isLoading ? 'Uploading...' : 'Upload Vehicle'}
          </button>

          {message && (
            <div className={`${styles.message} ${message.includes('Error') ? styles.messageError : styles.messageSuccess}`}>
              {message}
            </div>
          )}
        </form>
      </div>
    </div>

    {/* VIN Scanner Modal */}
    {showVINScanner && (
      <VINScanner
        onVINDetected={handleVINDetected}
        onClose={() => setShowVINScanner(false)}
      />
    )}
    </ProtectedRoute>
  );
}
