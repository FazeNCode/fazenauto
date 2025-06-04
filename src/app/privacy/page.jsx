'use client';
import Link from 'next/link';
import styles from './Legal.module.css';

export default function Privacy() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Information We Collect</h2>
            <p>
              At FazeNAuto, we collect information you provide directly to us, such as when you:
            </p>
            <ul>
              <li>Browse our vehicle inventory</li>
              <li>Contact us for information about vehicles</li>
              <li>Create an account on our website</li>
              <li>Subscribe to our newsletter</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>How We Use Your Information</h2>
            <p>
              We use the information we collect to:
            </p>
            <ul>
              <li>Provide and improve our services</li>
              <li>Respond to your inquiries about vehicles</li>
              <li>Send you updates about new inventory</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Information Sharing</h2>
            <p>
              We do not sell, trade, or otherwise transfer your personal information to third parties 
              without your consent, except as described in this privacy policy.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: info@fazenauto.com</p>
              <p>Phone: 647-338-9110</p>
            </div>
          </section>
        </div>

        <div className={styles.footer}>
          <Link href="/" className={styles.backButton}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
