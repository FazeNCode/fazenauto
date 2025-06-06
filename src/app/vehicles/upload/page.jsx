

'use client';
import { useState } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute/ProtectedRoute';
import styles from './UploadForm.module.css';

export default function UploadForm() {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const formData = new FormData(e.target);

      const res = await fetch('/api/vehicles/upload', {
        method: 'POST',
        body: formData,
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
                placeholder="e.g., Toyota, Honda, Ford"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Model *</label>
              <input
                name="model"
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
                placeholder="e.g., Black, White, Silver"
                required
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>VIN *</label>
            <input
              name="vin"
              placeholder="17-character Vehicle Identification Number"
              maxLength="17"
              required
              className={styles.input}
            />
          </div>

          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Mileage *</label>
              <input
                name="mileage"
                type="number"
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
                placeholder="Price in USD (e.g., 25000)"
                min="0"
                required
                className={styles.input}
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className={styles.twoColumnGrid}>
            <div className={styles.inputGroup}>
              <label className={styles.label}>Engine *</label>
              <input
                name="engine"
                placeholder="e.g., V6, 4-Cylinder, V8"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.label}>Transmission *</label>
              <input
                name="transmission"
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
    </ProtectedRoute>
  );
}
