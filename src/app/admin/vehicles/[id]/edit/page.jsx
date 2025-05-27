// src/app/admin/vehicles/[id]/edit/page.jsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EditVehicle({ params }) {
  const { id } = params;
  const [vehicle, setVehicle] = useState(null);
  const [form, setForm] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/vehicles/${id}`)
      .then(res => res.json())
      .then(data => {
        setVehicle(data.data);
        setForm(data.data);
      });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await fetch(`/api/vehicles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push('/admin'); // Redirect to dashboard
    }
  };

  if (!vehicle) return <p>Loading...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Edit Vehicle</h2>
      <form onSubmit={handleSubmit}>
        {['vin', 'make', 'model', 'year', 'color', 'mileage', 'price'].map(field => (
          <div key={field} style={{ marginBottom: '1rem' }}>
            <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
            <input
              type="text"
              name={field}
              value={form[field] || ''}
              onChange={handleChange}
              required
              style={{ display: 'block', width: '100%', padding: '0.5rem' }}
            />
          </div>
        ))}
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>Update</button>
      </form>
    </div>
  );
}
