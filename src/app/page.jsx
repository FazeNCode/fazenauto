'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Home.module.css';

export default function Home() {
  const [featuredVehicles, setFeaturedVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedVehicles = async () => {
      try {
        const response = await fetch('/api/vehicles?status=active');
        const data = await response.json();
        if (data.success) {
          // Get first 3 vehicles for featured section
          setFeaturedVehicles(data.data.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedVehicles();
  }, []);

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Find Your Perfect Vehicle at <span className={styles.brandName}>
                <span className={styles.brandFaze}>Faze</span>
                <span className={styles.brandN}>N</span>
                <span className={styles.brandAuto}>Auto</span>
              </span>
            </h1>
            <p className={styles.heroSubtitle}>
              Quality pre-owned vehicles sold as-is. Transparent pricing, no hidden fees.
              Your trusted automotive partner in finding the right car for your needs.
            </p>
            <div className={styles.heroButtons}>
              <Link href="/inventory/used-cars" className={styles.primaryBtn}>
                Browse Inventory
              </Link>
              <Link href="#about" className={styles.secondaryBtn}>
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.container}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>{featuredVehicles.length}+</div>
              <div className={styles.statLabel}>Quality Vehicles</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>As-Is</div>
              <div className={styles.statLabel}>Transparent Pricing</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Customer Focused</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles Section */}
      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Vehicles</h2>
            <p className={styles.sectionSubtitle}>
              Check out our latest quality pre-owned vehicles
            </p>
          </div>

          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Loading featured vehicles...</p>
            </div>
          ) : (
            <div className={styles.vehicleGrid}>
              {featuredVehicles.map((vehicle) => (
                <div key={vehicle._id} className={styles.vehicleCard}>
                  <div className={styles.vehicleImageWrapper}>
                    <img
                      src={vehicle.imageUrl}
                      alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
                      className={styles.vehicleImage}
                    />
                    <div className={styles.priceTag}>
                      ${vehicle.price?.toLocaleString() || 'N/A'}
                    </div>
                  </div>
                  <div className={styles.vehicleInfo}>
                    <h3 className={styles.vehicleTitle}>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                    <div className={styles.vehicleSpecs}>
                      <span className={styles.spec}>
                        {vehicle.mileage ? `${(vehicle.mileage * 1.60934).toLocaleString(undefined, { maximumFractionDigits: 0 })} km` : 'N/A'}
                      </span>
                      <span className={styles.spec}>{vehicle.engine || 'N/A'}</span>
                      <span className={styles.spec}>{vehicle.transmission || 'N/A'}</span>
                    </div>
                    <Link
                      href={`/vehicles/${vehicle._id}`}
                      className={styles.viewDetailsBtn}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className={styles.sectionFooter}>
            <Link href="/inventory/used-cars" className={styles.viewAllBtn}>
              View All Vehicles
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Our Services</h2>
            <p className={styles.sectionSubtitle}>
              Everything you need for your automotive journey
            </p>
          </div>

          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🚗</div>
              <h3 className={styles.serviceTitle}>Quality Vehicles</h3>
              <p className={styles.serviceDescription}>
                Carefully selected pre-owned vehicles with transparent as-is pricing.
                No hidden fees, just honest deals.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>💰</div>
              <h3 className={styles.serviceTitle}>Competitive Pricing</h3>
              <p className={styles.serviceDescription}>
                Fair market pricing on all our vehicles. We believe in transparency
                and providing value to our customers.
              </p>
            </div>

            <div className={styles.serviceCard}>
              <div className={styles.serviceIcon}>🤝</div>
              <h3 className={styles.serviceTitle}>Customer Service</h3>
              <p className={styles.serviceDescription}>
                Dedicated support throughout your buying journey. We're here to help
                you find the perfect vehicle for your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className={styles.aboutSection}>
        <div className={styles.container}>
          <div className={styles.aboutContent}>
            <div className={styles.aboutText}>
              <h2 className={styles.sectionTitle}>About <span className={styles.brandName}>
                <span className={styles.brandFaze}>Faze</span>
                <span className={styles.brandN}>N</span>
                <span className={styles.brandAuto}>Auto</span>
              </span></h2>
              <p className={styles.aboutDescription}>
                At <span className={styles.brandName}>
                  <span className={styles.brandFaze}>Faze</span>
                  <span className={styles.brandN}>N</span>
                  <span className={styles.brandAuto}>Auto</span>
                </span>, we're committed to providing quality pre-owned vehicles
                with complete transparency. Our as-is pricing model means no surprises,
                no hidden fees, and honest deals for every customer.
              </p>
              <p className={styles.aboutDescription}>
                We understand that buying a vehicle is a significant decision, and we're
                here to make that process as smooth and transparent as possible. Every
                vehicle in our inventory is carefully selected and priced fairly.
              </p>
              <div className={styles.aboutFeatures}>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Transparent As-Is Pricing</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Quality Pre-Owned Vehicles</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>No Hidden Fees</span>
                </div>
                <div className={styles.feature}>
                  <span className={styles.featureIcon}>✓</span>
                  <span>Customer-Focused Service</span>
                </div>
              </div>
            </div>
            <div className={styles.aboutImage}>
              <div className={styles.aboutImagePlaceholder}>
                🏢
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Find Your Next Vehicle?</h2>
            <p className={styles.ctaSubtitle}>
              Browse our inventory of quality pre-owned vehicles or get in touch with our team
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/inventory/used-cars" className={styles.primaryBtn}>
                Browse Inventory
              </Link>
              <Link href="/login" className={styles.secondaryBtn}>
                Dealer Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
