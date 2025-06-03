'use client';
import Link from 'next/link';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import styles from './Contact.module.css';

export default function Contact() {
  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>
            Get in touch with our team for any questions about our vehicles or services
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.contactGrid}>
            
            {/* Contact Information */}
            <div className={styles.contactInfo}>
              <h2 className={styles.sectionTitle}>Get in Touch</h2>
              
              <div className={styles.contactItem}>
                <FaPhone className={styles.icon} />
                <div>
                  <h3>Phone</h3>
                  <p>(555) 123-4567</p>
                  <span>Call us during business hours</span>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FaEnvelope className={styles.icon} />
                <div>
                  <h3>Email</h3>
                  <p>info@fazenauto.com</p>
                  <span>We'll respond within 24 hours</span>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.icon} />
                <div>
                  <h3>Address</h3>
                  <p>123 Auto Street<br />Your City, State 12345</p>
                  <span>Visit our showroom</span>
                </div>
              </div>

              <div className={styles.contactItem}>
                <FaClock className={styles.icon} />
                <div>
                  <h3>Business Hours</h3>
                  <p>
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Sat: 9:00 AM - 5:00 PM<br />
                    Sun: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.contactForm}>
              <h2 className={styles.sectionTitle}>Send us a Message</h2>
              <form className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Full Name</label>
                  <input type="text" id="name" name="name" required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input type="email" id="email" name="email" required />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="vehicle">Vehicle Information</option>
                    <option value="service">Service Question</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows="5" required></textarea>
                </div>

                <button type="submit" className={styles.submitButton}>
                  Send Message
                </button>
              </form>
            </div>
          </div>
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
