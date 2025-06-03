'use client';
import Link from 'next/link';
import styles from './Services.module.css';

export default function Services() {
  const services = [
    {
      icon: '🚗',
      title: 'Quality Pre-Owned Vehicles',
      description: 'Carefully selected vehicles with transparent as-is pricing. Every vehicle is priced fairly with no hidden fees.',
      features: [
        'Transparent pricing',
        'No hidden fees',
        'Quality inspection',
        'Honest vehicle history'
      ]
    },
    {
      icon: '💰',
      title: 'Competitive Pricing',
      description: 'Fair market pricing on all our vehicles. We believe in providing value and transparency to our customers.',
      features: [
        'Market-competitive rates',
        'As-is pricing model',
        'No surprise charges',
        'Value for money'
      ]
    },
    {
      icon: '🤝',
      title: 'Customer Support',
      description: 'Dedicated customer service throughout your vehicle buying journey. We\'re here to help every step of the way.',
      features: [
        'Personalized assistance',
        'Expert guidance',
        'Post-purchase support',
        'Customer satisfaction focus'
      ]
    },
    {
      icon: '📋',
      title: 'Vehicle Information',
      description: 'Complete transparency with detailed vehicle information, specifications, and condition reports.',
      features: [
        'Detailed specifications',
        'Vehicle history available',
        'Condition transparency',
        'Complete documentation'
      ]
    }
  ];

  const comingSoonServices = [
    {
      icon: '🎯',
      title: 'Special Offers',
      description: 'Exclusive deals and limited-time promotions',
      status: 'Coming Soon'
    },
    {
      icon: '🔄',
      title: 'Sell or Trade',
      description: 'Vehicle selling and trade-in services',
      status: 'Coming Soon'
    }
  ];

  return (
    <div className={styles.servicesPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Our Services</h1>
            <p className={styles.heroSubtitle}>
              Comprehensive automotive services designed to meet your needs with transparency and quality.
            </p>
          </div>
        </div>
      </section>

      {/* Current Services */}
      <section className={styles.currentServices}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>What We Offer</h2>
            <p className={styles.sectionSubtitle}>
              Our commitment to quality and transparency in every service
            </p>
          </div>

          <div className={styles.servicesGrid}>
            {services.map((service, index) => (
              <div key={index} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <ul className={styles.featuresList}>
                  {service.features.map((feature, idx) => (
                    <li key={idx} className={styles.featureItem}>
                      <span className={styles.checkIcon}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Coming Soon Services */}
      <section className={styles.comingSoonSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Coming Soon</h2>
            <p className={styles.sectionSubtitle}>
              Exciting new services we're working on for you
            </p>
          </div>

          <div className={styles.comingSoonGrid}>
            {comingSoonServices.map((service, index) => (
              <div key={index} className={styles.comingSoonCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <p className={styles.serviceDescription}>{service.description}</p>
                <span className={styles.statusBadge}>{service.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Find Your Next Vehicle?</h2>
            <p className={styles.ctaSubtitle}>
              Browse our inventory of quality pre-owned vehicles with transparent pricing
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/inventory/used-cars" className={styles.primaryBtn}>
                Browse Inventory
              </Link>
              <Link href="/" className={styles.secondaryBtn}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
