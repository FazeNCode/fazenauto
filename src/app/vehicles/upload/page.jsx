

'use client';
import { useState } from 'react';

export default function UploadForm() {
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const res = await fetch('/api/vehicles/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message || 'Upload done');
  };

  return (
   

    <form onSubmit={handleSubmit} encType="multipart/form-data" className="upload-form">
  <h1>Upload a Vehicle</h1>

  <input name="make" placeholder="Make" required />
  <input name="model" placeholder="Model" required />
  <input name="year" type="number" placeholder="Year" required />
  <input name="vin" placeholder="VIN" required />
  <input name="mileage" type="number" placeholder="Mileage" required />
  <input name="color" placeholder="Color" required />
  <input name="price" type="number" placeholder="Price" required />

  <input name="engine" placeholder="Engine" required />
  <input name="drivetrain" placeholder="Drivetrain" required />
  <input name="transmission" placeholder="Transmission" required />

  <input type="file" name="image" accept="image/*" required />

  <button type="submit">Upload</button>

  {message && <p>{message}</p>}
</form>

  );
}
