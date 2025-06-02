'use client';

import { useState } from 'react';
import styles from './CreateUser.module.css';

export default function CreateUserPage() {
  const [formData, setFormData] = useState({
    adminSecret: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'dealer'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ show: false, type: '', message: '' });
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time password validation
    if (name === 'password' || name === 'confirmPassword') {
      const password = name === 'password' ? value : formData.password;
      const confirmPassword = name === 'confirmPassword' ? value : formData.confirmPassword;
      setPasswordsMatch(password === confirmPassword || confirmPassword === '');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult({ show: false, type: '', message: '' });

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setResult({
        show: true,
        type: 'error',
        message: 'Passwords do not match'
      });
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setResult({
        show: true,
        type: 'error',
        message: 'Password must be at least 6 characters long'
      });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminSecret: formData.adminSecret,
          email: formData.email,
          password: formData.password,
          role: formData.role
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          show: true,
          type: 'success',
          message: `✅ User Created Successfully!\n📧 Email: ${data.data.email}\n👤 Role: ${data.data.role}\n🆔 User ID: ${data.data.userId}`
        });
        
        // Clear form
        setFormData({
          adminSecret: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'dealer'
        });
      } else {
        setResult({
          show: true,
          type: 'error',
          message: data.error
        });
      }

    } catch (error) {
      setResult({
        show: true,
        type: 'error',
        message: `Network Error: ${error.message}`
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>🔐 Create Authorized User</h1>
          <p>Secure user creation for FazeNAuto Admin</p>
        </div>
        
        <div className={styles.warning}>
          <strong>⚠️ Admin Only:</strong> This page is for creating authorized dealer accounts. 
          Make sure you have set the required environment variables.
        </div>
        
        <div className={styles.envInfo}>
          <h4>Required Environment Variables:</h4>
          <p><code>ADMIN_SECRET</code> - Secret key for admin operations</p>
          <p><code>AUTHORIZED_EMAILS</code> - Comma-separated list of allowed emails</p>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="adminSecret">Admin Secret *</label>
            <input
              type="password"
              id="adminSecret"
              name="adminSecret"
              value={formData.adminSecret}
              onChange={handleInputChange}
              required
              placeholder="Enter admin secret"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="dealer@example.com"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="Enter secure password"
              minLength="6"
              className={styles.input}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm password"
              className={`${styles.input} ${!passwordsMatch ? styles.errorInput : ''} ${passwordsMatch && formData.confirmPassword ? styles.successInput : ''}`}
            />
            {!passwordsMatch && formData.confirmPassword && (
              <span className={styles.errorText}>Passwords do not match</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value="dealer">Dealer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading || !passwordsMatch}
            className={styles.submitBtn}
          >
            {loading ? 'Creating User...' : 'Create User'}
          </button>
        </form>
        
        {result.show && (
          <div className={`${styles.result} ${styles[result.type]}`}>
            <pre>{result.message}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
