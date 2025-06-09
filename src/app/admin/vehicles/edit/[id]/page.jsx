'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { FaGasPump, FaCogs, FaPalette, FaCar, FaIdCard, FaCalendarAlt, FaDollarSign, FaTachometerAlt } from 'react-icons/fa';
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

  const [newImages, setNewImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);

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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const removeNewImage = (index) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const markImageForDeletion = (imageUrl) => {
    setImagesToDelete(prev => [...prev, imageUrl]);
  };

  const unmarkImageForDeletion = (imageUrl) => {
    setImagesToDelete(prev => prev.filter(url => url !== imageUrl));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Create FormData for file uploads
      const submitData = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Add new images
      newImages.forEach(image => {
        submitData.append('newImages', image);
      });

      // Add images to delete
      imagesToDelete.forEach(imageUrl => {
        submitData.append('imagesToDelete', imageUrl);
      });

      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: 'PUT',
        body: submitData,
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
          ← Back to Dashboard
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
            <label htmlFor="make">
              <FaCar className={styles.labelIcon} />
              Make *
            </label>
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
            <label htmlFor="model">
              <FaCar className={styles.labelIcon} />
              Model *
            </label>
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
            <label htmlFor="year">
              <FaCalendarAlt className={styles.labelIcon} />
              Year *
            </label>
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
            <label htmlFor="price">
              <FaDollarSign className={styles.labelIcon} />
              Price *
            </label>
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
            <label htmlFor="mileage">
              <FaTachometerAlt className={styles.labelIcon} />
              KM
            </label>
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
            <label htmlFor="vin">
              <FaIdCard className={styles.labelIcon} />
              VIN
            </label>
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
            <label htmlFor="fuelType">
              <FaGasPump className={styles.labelIcon} />
              Fuel Type
            </label>
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
            <label htmlFor="transmission">
              <FaCogs className={styles.labelIcon} />
              Transmission
            </label>
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
            <label htmlFor="bodyType">
              <FaCar className={styles.labelIcon} />
              Body Type
            </label>
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
            <label htmlFor="color">
              <FaPalette className={styles.labelIcon} />
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleInputChange}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            {/* Empty space to maintain grid layout */}
          </div>
        </div>

        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
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

        {/* Photo Management Section */}
        <div className={styles.photoSection}>
          <h3>Vehicle Photos</h3>

          {/* Current Images */}
          {vehicle && vehicle.images && vehicle.images.length > 0 && (
            <div className={styles.currentImages}>
              <h4>Current Images</h4>
              <div className={styles.imageGrid}>
                {vehicle.images.map((image, index) => (
                  <div key={index} className={styles.imageContainer}>
                    <img
                      src={image}
                      alt={`Vehicle ${index + 1}`}
                      className={styles.vehicleImage}
                    />
                    {imagesToDelete.includes(image) ? (
                      <button
                        type="button"
                        onClick={() => unmarkImageForDeletion(image)}
                        className={styles.undoDeleteBtn}
                      >
                        Undo Delete
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => markImageForDeletion(image)}
                        className={styles.deleteBtn}
                      >
                        Delete
                      </button>
                    )}
                    {imagesToDelete.includes(image) && (
                      <div className={styles.deleteOverlay}>
                        <span>Will be deleted</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add New Images */}
          <div className={styles.addImages}>
            <h4>Add New Images</h4>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className={styles.fileInput}
            />

            {newImages.length > 0 && (
              <div className={styles.newImagesPreview}>
                <h5>New Images to Upload:</h5>
                <div className={styles.imageGrid}>
                  {newImages.map((image, index) => (
                    <div key={index} className={styles.imageContainer}>
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New ${index + 1}`}
                        className={styles.vehicleImage}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className={styles.deleteBtn}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
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
    </div>
  );
}
