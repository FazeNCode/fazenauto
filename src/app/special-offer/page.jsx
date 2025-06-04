'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SpecialOffer() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to coming soon page with feature parameter
    router.push('/coming-soon?feature=special-offer');
  }, [router]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #0f1419 0%, #1a202c 50%, #2d3748 100%)',
      color: 'white',
      fontSize: '1.2rem'
    }}>
      Redirecting to Special Offers...
    </div>
  );
}
