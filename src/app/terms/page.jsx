'use client';
import Link from 'next/link';
import styles from './Legal.module.css';

export default function Terms() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2>Acceptance of Terms</h2>
            <p>
              By accessing and using the FazeNAuto website, you accept and agree to be bound by 
              the terms and provision of this agreement.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Vehicle Sales</h2>
            <p>
              All vehicles are sold "as-is" with no warranties or guarantees. We provide transparent 
              pricing with no hidden fees.
            </p>
            <ul>
              <li>All sales are final</li>
              <li>Vehicles are sold in their current condition</li>
              <li>Buyers are responsible for inspection before purchase</li>
              <li>Pricing is clearly displayed with no hidden costs</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Website Use</h2>
            <p>
              You may use our website for lawful purposes only. You agree not to use the site:
            </p>
            <ul>
              <li>In any way that violates applicable laws</li>
              <li>To transmit harmful or malicious content</li>
              <li>To interfere with the website's functionality</li>
              <li>For any commercial purpose without authorization</li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2>Limitation of Liability</h2>
            <p>
              FazeNAuto shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages resulting from your use of our website or services.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective 
              immediately upon posting to the website.
            </p>
          </section>

          <section className={styles.section}>
            <h2>Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us:
            </p>
            <div className={styles.contactInfo}>
              <p>Email: info@fazenauto.com</p>
              <p>Phone: (555) 123-4567</p>
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
