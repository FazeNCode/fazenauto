'use client';
import { useRouter } from 'next/navigation';
import styles from './Unauthorized.module.css';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>🚫</div>
        <h1 className={styles.title}>Access Denied</h1>
        <p className={styles.message}>
          You don't have permission to access this page. This area is restricted to authorized dealers and administrators only.
        </p>
        <div className={styles.actions}>
          <button 
            onClick={() => router.push('/')}
            className={styles.homeBtn}
          >
            Go to Homepage
          </button>
          <button 
            onClick={() => router.push('/login')}
            className={styles.loginBtn}
          >
            Login as Dealer
          </button>
        </div>
      </div>
    </div>
  );
}
