
// src/app/vehicles/upload/page.jsx

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
    <form onSubmit={handleSubmit} encType="multipart/form-data">
      <input type="file" name="file" required />
      <button type="submit">Upload</button>
      {message && <p>{message}</p>}
    </form>
  );
}
