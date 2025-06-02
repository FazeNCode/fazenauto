'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from './EditVehicle.module.css';

export default function EditVehiclePage() {
  const router = useRouter();
  const params = useParams();
  const vehicleId = params.id;

  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    vin: '',
    status: 'draft',
    description: '',
    fuelType: '',
    transmission: '',
    bodyType: '',
    color: '',
  });

  useEffect(() => {
    fetchVehicle();
  }, [vehicleId]);

  const fetchVehicle = async () => {
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`);
      const data = await res.json();
      
      if (data.success) {
        setVehicle(data.data);
        setFormData({
          make: data.data.make || '',
          model: data.data.model || '',
          year: data.data.year || '',
          price: data.data.price || '',
          mileage: data.data.mileage || '',
          vin: data.data.vin || '',
          status: data.data.status || 'draft',
          description: data.data.description || '',
          fuelType: data.data.fuelType || '',
          transmission: data.data.transmission || '',
          bodyType: data.data.bodyType || '',
          color: data.data.color || '',
        });
      } else {
        setError(data.error || 'Failed to fetch vehicle');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        router.push('/admin');
      } else {
        setError(data.error || 'Failed to update vehicle');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Loading vehicle...</div>;
  }

  if (error && !vehicle) {
    return (
      <div className={styles.error}>
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => router.push('/admin')} className={styles.backBtn}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className={styles.editContainer}>
      <div className={styles.header}>
        <h1>Edit Vehicle</h1>
        <button 
          onClick={() => router.push('/admin')} 
          className={styles.backBtn}
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className={styles.errorAlert}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label htmlFor="make">Make *</label>
            <input
              type="text"
              id="make"
              name="make"
              value={formData.make}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="model">Model *</label>
            <input
              type="text"
              id="model"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              required
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="year">Year *</label>
            <input
              type="number"
              id="year"
              name="year"
              value={formData.year}
              onChange={handleInputChange}
              required
              min="1900"
              max="2030"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="price">Price *</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              min="0"
              step="0.01"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mileage">Mileage</label>
            <input
              type="number"
              id="mileage"
              name="mileage"
              value={formData.mileage}
              onChange={handleInputChange}
              min="0"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="vin">VIN</label>
            <input
              type="text"
              id="vin"
              name="vin"
              value={formData.vin}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="status">Status *</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="fuelType">Fuel Type</label>
            <select
              id="fuelType"
              name="fuelType"
              value={formData.fuelType}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">Select Fuel Type</option>
              <option value="gasoline">Gasoline</option>
              <option value="diesel">Diesel</option>
              <option value="hybrid">Hybrid</option>
              <option value="electric">Electric</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="transmission">Transmission</label>
            <select
              id="transmission"
              name="transmission"
              value={formData.transmission}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="">Select Transmission</option>
              <option value="manual">Manual</option>
              <option value="automatic">Automatic</option>
              <option value="cvt">CVT</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="bodyType">Body Type</label>
            <input
              type="text"
              id="bodyType"
              name="bodyType"
              value={formData.bodyType}
              onChange={handleInputChange}
              placeholder="e.g., Sedan, SUV, Truck"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="color">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className={styles.textarea}
            placeholder="Enter vehicle description..."
          />
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => router.push('/admin')}
            className={styles.cancelBtn}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className={styles.saveBtn}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {vehicle && vehicle.images && vehicle.images.length > 0 && (
        <div className={styles.imagesSection}>
          <h3>Current Images</h3>
          <div className={styles.imageGrid}>
            {vehicle.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Vehicle ${index + 1}`}
                className={styles.vehicleImage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
