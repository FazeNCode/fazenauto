"use client"; // Ensures client-side rendering for interactivity

import React from 'react';
import Link from 'next/link';
// import styles from '../../app/style'; // Adjusted alias for regular .jsx usage

import { FaFacebook, FaTwitter, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className={`${styles.footer} bg-primary text-white`}>
      <div className={`${styles.container} max-w-7xl mx-auto py-8 px-4`}>
        
        {/* Logo and Brand */}
        <div className={styles.footerBrand}>
          <img src="/logo.png" alt="Company Logo" className={styles.logo} />
          <p className={styles.brandText}>
            &copy; {new Date().getFullYear()} FazeNauto. All rights reserved.
          </p>
        </div>

        {/* Footer Links */}
        <div className={styles.footerLinks}>
          <div className={styles.linkColumn}>
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/services">Services</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Support</h4>
            <Link href="/faq">FAQ</Link>
            <Link href="/privacy">Privacy Policy</Link>
            <Link href="/terms">Terms of Service</Link>
          </div>

          <div className={styles.linkColumn}>
            <h4>Social</h4>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className={styles.icon} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <FaTwitter className={styles.icon} />
            </a>
            <a href="https://www.instagram.com/fazenauto/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className={styles.icon} />
            </a>
            <a href="https://www.tiktok.com" target="_blank" rel="noopener noreferrer">
              <FaTiktok className={styles.icon} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
