"use client";
import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';
import { FaFacebook, FaTwitter, FaInstagram, FaTiktok, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCar, FaClock } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        {/* Main Footer Content */}
        <div className={styles.footerContent}>

          {/* Brand Section */}
          <div className={styles.brandSection}>
            <div className={styles.brandHeader}>
              <FaCar className={styles.brandIcon} />
              <h3 className={styles.brandName}>
                <span className={styles.brandFaze}>Faze</span>
                <span className={styles.brandN}>N</span>
                <span className={styles.brandAuto}>Auto</span>
              </h3>
            </div>
            <p className={styles.brandDescription}>
              Quality pre-owned vehicles with transparent as-is pricing.
              No hidden fees, just honest deals for every customer.
            </p>
            <div className={styles.socialLinks}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaTwitter />
              </a>
              <a href="https://www.instagram.com/fazenauto/" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaInstagram />
              </a>
              <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                <FaTiktok />
              </a>
            </div>
          </div>



          {/* Services */}
          <div className={styles.linkSection}>
            <h4 className={styles.sectionTitle}>Our Services</h4>
            <ul className={styles.linkList}>
              <li><span className={styles.serviceItem}>Quality Pre-Owned Vehicles</span></li>
              <li><span className={styles.serviceItem}>Transparent Pricing</span></li>
              <li><span className={styles.serviceItem}>Customer Support</span></li>
              <li><span className={styles.serviceItem}>Vehicle Information</span></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={styles.contactSection}>
            <h4 className={styles.sectionTitle}>Contact Us</h4>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <FaPhone className={styles.contactIcon} />
                <span>647-338-9110</span>
              </div>
              <div className={styles.contactItem}>
                <FaEnvelope className={styles.contactIcon} />
                <span>info@fazenauto.com</span>
              </div>
              <div className={styles.contactItem}>
                <FaMapMarkerAlt className={styles.contactIcon} />
                <span>123 Main Street, Toronto, ON M5V 3A8</span>
              </div>
            </div>
            <div className={styles.businessHours}>
              <h5 className={styles.hoursTitle}>
                <FaClock className={styles.contactIcon} />
                Business Hours
              </h5>
              <p className={styles.hoursText}>
                Mon - Fri: 9:00 AM - 6:00 PM<br />
                Sat: 9:00 AM - 5:00 PM<br />
                Sun: Closed
              </p>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className={styles.footerBottom}>
          <div className={styles.bottomContent}>
            <p className={styles.copyright}>
              &copy; {currentYear} FazeNAuto. All rights reserved.
            </p>
            <div className={styles.legalLinks}>
              <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
              <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
              <Link href="/contact" className={styles.legalLink}>Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
