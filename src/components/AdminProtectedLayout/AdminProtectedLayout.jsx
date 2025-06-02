'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdminProtectedLayout.module.css';

export default function AdminProtectedLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user is stored in localStorage
        const storedUser = localStorage.getItem('user');
        
        if (!storedUser) {
          // No user found, redirect to login
          router.push('/login');
          return;
        }

        const userData = JSON.parse(storedUser);
        
        // Validate user data structure
        if (!userData || !userData.email || !userData.role) {
          // Invalid user data, clear storage and redirect
          localStorage.removeItem('user');
          router.push('/login');
          return;
        }

        // Check if user has admin or dealer role
        if (userData.role !== 'admin' && userData.role !== 'dealer') {
          // User doesn't have required role, redirect to unauthorized page
          router.push('/unauthorized');
          return;
        }

        // User is authenticated and authorized
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check error:', error);
        // Clear invalid data and redirect
        localStorage.removeItem('user');
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Verifying authentication...</p>
      </div>
    );
  }

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Render protected content if authenticated
  return <>{children}</>;
}
