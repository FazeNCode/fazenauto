'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import styles from './ComingSoon.module.css';

function ComingSoonContent() {
  const searchParams = useSearchParams();
  const feature = searchParams.get('feature') || 'This Feature';

  const getFeatureDetails = (featureName) => {
    switch (featureName.toLowerCase()) {
      case 'special-offer':
        return {
          title: 'Special Offers',
          description: 'Exclusive deals and limited-time offers on quality pre-owned vehicles.',
          icon: '🎯',
          features: [
            'Seasonal discounts',
            'Limited-time promotions',
            'Exclusive member deals',
            'Flash sales notifications'
          ]
        };
      case 'sell-or-trade':
        return {
          title: 'Sell or Trade',
          description: 'Easy vehicle selling and trade-in services for our customers.',
          icon: '🔄',
          features: [
            'Quick vehicle appraisals',
            'Trade-in evaluations',
            'Hassle-free selling process',
            'Competitive market pricing'
          ]
        };
      default:
        return {
          title: 'New Feature',
          description: 'An exciting new feature is coming to FazeNAuto.',
          icon: '🚀',
          features: [
            'Enhanced user experience',
            'Improved functionality',
            'Better customer service',
            'More convenient features'
          ]
        };
    }
  };

  const featureDetails = getFeatureDetails(feature);

  return (
    <div className={styles.comingSoonPage}>
      <div className={styles.container}>
        <div className={styles.content}>
          {/* Main Icon */}
          <div className={styles.mainIcon}>
            {featureDetails.icon}
          </div>

          {/* Title */}
          <h1 className={styles.title}>
            {featureDetails.title}
          </h1>
          
          <h2 className={styles.subtitle}>
            Coming Soon
          </h2>

          {/* Description */}
          <p className={styles.description}>
            {featureDetails.description}
          </p>

          {/* Features List */}
          <div className={styles.featuresSection}>
            <h3 className={styles.featuresTitle}>What to Expect:</h3>
            <ul className={styles.featuresList}>
              {featureDetails.features.map((item, index) => (
                <li key={index} className={styles.featureItem}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <p className={styles.ctaText}>
              In the meantime, check out our current inventory of quality pre-owned vehicles.
            </p>
            
            <div className={styles.buttons}>
              <Link href="/inventory/used-cars" className={styles.primaryBtn}>
                Browse Inventory
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                Back to Home
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className={styles.contactSection}>
            <p className={styles.contactText}>
              Have questions? We'd love to hear from you!
            </p>
            <div className={styles.contactInfo}>
              <span className={styles.contactItem}>
                📧 info@fazenauto.com
              </span>
              <span className={styles.contactItem}>
                📞 647-338-9110
              </span>
            </div>
          </div>
        </div>

        {/* Background Animation */}
        <div className={styles.backgroundAnimation}>
          <div className={styles.floatingIcon}>🚗</div>
          <div className={styles.floatingIcon}>⭐</div>
          <div className={styles.floatingIcon}>🔧</div>
          <div className={styles.floatingIcon}>💎</div>
        </div>
      </div>
    </div>
  );
}

export default function ComingSoon() {
  return (
    <Suspense fallback={
      <div className={styles.comingSoonPage}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.mainIcon}>🚀</div>
            <h1 className={styles.title}>Loading...</h1>
          </div>
        </div>
      </div>
    }>
      <ComingSoonContent />
    </Suspense>
  );
}
