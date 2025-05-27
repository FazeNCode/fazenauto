'use client';

import { useState } from 'react';

export default function UploadVehiclePage() {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    vin: '',
    mileage: '',
    color: '',
    image: null,
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const res = await fetch('/api/vehicles/upload', {
        method: 'POST',
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setMessage('Vehicle uploaded successfully!');
        setFormData({
          make: '',
          model: '',
          year: '',
          vin: '',
          mileage: '',
          color: '',
          image: null,
        });
      } else {
        setMessage(result.error || 'Upload failed.');
      }
    } catch (error) {
      setMessage('Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-form-container">
      <h1>Upload a Vehicle</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-form">
        <input name="make" placeholder="Make" value={formData.make} onChange={handleChange} required />
        <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
        <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} required />
        <input name="vin" placeholder="VIN" value={formData.vin} onChange={handleChange} required />
        <input name="mileage" type="number" placeholder="Mileage" value={formData.mileage} onChange={handleChange} required />
        <input name="color" placeholder="Color" value={formData.color} onChange={handleChange} required />
        <input type="file" name="image" accept="image/*" onChange={handleChange} required />
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Submit'}
        </button>
      </form>
      {message && <p className="form-message">{message}</p>}
    </div>
  );
}
