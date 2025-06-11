/**
 * Facebook Marketplace Handler
 * Handles posting vehicles to Facebook Marketplace via Facebook Marketing API
 */

import Vehicle from '@/models/Vehicle';
import { connectToDatabase } from '@/lib/dbConnect';

export default class FacebookMarketplaceHandler {
  constructor() {
    this.apiVersion = 'v18.0';
    this.baseUrl = `https://graph.facebook.com/${this.apiVersion}`;
  }

  getName() {
    return 'Facebook Marketplace';
  }

  getDescription() {
    return 'Post vehicles to Facebook Marketplace for maximum visibility';
  }

  isEnabled() {
    // Check if Facebook credentials are configured
    return !!(
      process.env.FACEBOOK_APP_ID &&
      process.env.FACEBOOK_APP_SECRET &&
      (process.env.FACEBOOK_PAGE_TOKEN || process.env.FACEBOOK_USER_TOKEN)
    );
  }

  requiresAuth() {
    return true;
  }

  getSupportedFeatures() {
    return [
      'auto_posting',
      'image_upload',
      'price_updates',
      'inventory_sync',
      'analytics',
      'promoted_listings'
    ];
  }

  /**
   * Post vehicle to Facebook Marketplace
   */
  async postVehicle(vehicleId, settings = {}) {
    try {
      await connectToDatabase();
      
      const vehicle = await Vehicle.findById(vehicleId);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      // Get access token from settings or environment
      const accessToken = settings.accessToken ||
                         process.env.FACEBOOK_PAGE_TOKEN ||
                         process.env.FACEBOOK_USER_TOKEN;

      const pageId = settings.pageId || process.env.FACEBOOK_PAGE_ID;

      if (!accessToken) {
        throw new Error('Facebook access token required. Set FACEBOOK_PAGE_TOKEN or FACEBOOK_USER_TOKEN in environment variables.');
      }

      if (!pageId) {
        throw new Error('Facebook page ID required. Set FACEBOOK_PAGE_ID in environment variables.');
      }

      // Update settings with resolved values
      settings = { ...settings, accessToken, pageId };

      // Format vehicle data for Facebook
      const listingData = this.formatVehicleForFacebook(vehicle, settings);
      
      // Upload images first
      const imageIds = await this.uploadImages(vehicle.images || [vehicle.imageUrl], settings);
      
      // Create the listing
      const listing = await this.createListing(listingData, imageIds, settings);
      
      return {
        externalId: listing.id,
        externalUrl: `https://www.facebook.com/marketplace/item/${listing.id}`,
        platformData: {
          listingId: listing.id,
          pageId: settings.pageId,
          imageIds,
          createdAt: new Date().toISOString(),
          facebookResponse: listing
        }
      };
      
    } catch (error) {
      console.error('❌ Facebook posting error:', error);
      throw new Error(`Facebook posting failed: ${error.message}`);
    }
  }

  /**
   * Remove vehicle from Facebook Marketplace
   */
  async removeVehicle(externalId, platformData = {}) {
    try {
      if (!platformData.accessToken) {
        throw new Error('Facebook access token required for removal');
      }

      const response = await fetch(`${this.baseUrl}/${externalId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${platformData.accessToken}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to remove listing');
      }

      return {
        success: true,
        removedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('❌ Facebook removal error:', error);
      throw error;
    }
  }

  /**
   * Format vehicle data for Facebook Marketplace
   */
  formatVehicleForFacebook(vehicle, settings = {}) {
    const title = `${vehicle.year} ${vehicle.make} ${vehicle.model}`;
    const description = this.generateDescription(vehicle);
    
    return {
      name: title,
      description: description,
      price: Math.round(vehicle.price * 100), // Facebook expects price in cents
      currency: settings.currency || 'CAD',
      condition: 'used',
      availability: 'in stock',
      
      // Vehicle-specific fields
      vehicle_year: vehicle.year,
      vehicle_make: vehicle.make,
      vehicle_model: vehicle.model,
      vehicle_mileage: vehicle.mileage,
      vehicle_transmission: this.mapTransmission(vehicle.transmission),
      vehicle_fuel_type: this.mapFuelType(vehicle.engine),
      vehicle_exterior_color: vehicle.color,
      vehicle_drivetrain: this.mapDrivetrain(vehicle.drivetrain),
      vehicle_vin: vehicle.vin,
      
      // Optional fields
      ...(vehicle.bodyType && { vehicle_body_style: vehicle.bodyType }),
      
      // Marketplace category
      marketplace_listing_type: 'vehicle',
      
      // Custom labels for tracking
      custom_label_0: 'FazeNAuto',
      custom_label_1: vehicle.status,
      custom_label_2: settings.campaign || 'organic'
    };
  }

  /**
   * Upload images to Facebook
   */
  async uploadImages(imageUrls, settings) {
    const imageIds = [];
    
    for (const imageUrl of imageUrls.slice(0, 10)) { // Facebook allows max 10 images
      try {
        const imageId = await this.uploadSingleImage(imageUrl, settings);
        if (imageId) {
          imageIds.push(imageId);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to upload image ${imageUrl}:`, error.message);
        // Continue with other images
      }
    }
    
    if (imageIds.length === 0) {
      throw new Error('No images could be uploaded to Facebook');
    }
    
    return imageIds;
  }

  /**
   * Upload single image to Facebook
   */
  async uploadSingleImage(imageUrl, settings) {
    try {
      // Download image from S3
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      
      const imageBuffer = await imageResponse.arrayBuffer();
      
      // Upload to Facebook
      const formData = new FormData();
      formData.append('source', new Blob([imageBuffer]), 'vehicle_image.jpg');
      formData.append('access_token', settings.accessToken);
      
      const uploadResponse = await fetch(`${this.baseUrl}/${settings.pageId}/photos`, {
        method: 'POST',
        body: formData
      });
      
      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error?.message || 'Image upload failed');
      }
      
      const result = await uploadResponse.json();
      return result.id;
      
    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw error;
    }
  }

  /**
   * Create Facebook Marketplace listing
   */
  async createListing(listingData, imageIds, settings) {
    try {
      const payload = {
        ...listingData,
        attached_media: imageIds.map(id => ({ media_fbid: id })),
        access_token: settings.accessToken
      };
      
      const response = await fetch(`${this.baseUrl}/${settings.pageId}/marketplace_listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Listing creation failed');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('❌ Listing creation error:', error);
      throw error;
    }
  }

  /**
   * Generate vehicle description
   */
  generateDescription(vehicle) {
    const features = [
      `Year: ${vehicle.year}`,
      `Make: ${vehicle.make}`,
      `Model: ${vehicle.model}`,
      `Mileage: ${vehicle.mileage?.toLocaleString()} km`,
      `Engine: ${vehicle.engine}`,
      `Transmission: ${vehicle.transmission}`,
      `Drivetrain: ${vehicle.drivetrain}`,
      `Color: ${vehicle.color}`
    ].filter(Boolean);

    return `${features.join('\n')}

VIN: ${vehicle.vin}

Well-maintained vehicle in excellent condition. Contact us for more information or to schedule a viewing.

📞 Phone: 647-338-9110
📧 Email: info@fazenauto.com
🏢 Visit our showroom at 123 Main Street, Toronto

All vehicles sold as-is. Financing options available.

#UsedCars #Toronto #FazeNAuto #${vehicle.make}${vehicle.model}`;
  }

  /**
   * Map transmission types to Facebook format
   */
  mapTransmission(transmission) {
    if (!transmission) return 'other';
    
    const trans = transmission.toLowerCase();
    if (trans.includes('manual')) return 'manual';
    if (trans.includes('automatic')) return 'automatic';
    if (trans.includes('cvt')) return 'other';
    return 'other';
  }

  /**
   * Map fuel types to Facebook format
   */
  mapFuelType(engine) {
    if (!engine) return 'gasoline';
    
    const eng = engine.toLowerCase();
    if (eng.includes('electric') || eng.includes('ev')) return 'electric';
    if (eng.includes('hybrid')) return 'hybrid';
    if (eng.includes('diesel')) return 'diesel';
    return 'gasoline';
  }

  /**
   * Map drivetrain to Facebook format
   */
  mapDrivetrain(drivetrain) {
    if (!drivetrain) return 'other';
    
    const drive = drivetrain.toLowerCase();
    if (drive.includes('fwd') || drive.includes('front')) return 'fwd';
    if (drive.includes('rwd') || drive.includes('rear')) return 'rwd';
    if (drive.includes('awd') || drive.includes('all')) return 'awd';
    if (drive.includes('4wd') || drive.includes('4x4')) return '4wd';
    return 'other';
  }

  /**
   * Update listing price
   */
  async updatePrice(externalId, newPrice, settings) {
    try {
      const payload = {
        price: Math.round(newPrice * 100), // Convert to cents
        access_token: settings.accessToken
      };
      
      const response = await fetch(`${this.baseUrl}/${externalId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Price update failed');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('❌ Price update error:', error);
      throw error;
    }
  }

  /**
   * Get listing analytics
   */
  async getAnalytics(externalId, settings) {
    try {
      const response = await fetch(
        `${this.baseUrl}/${externalId}/insights?metric=reach,impressions,clicks&access_token=${settings.accessToken}`
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Analytics fetch failed');
      }
      
      return await response.json();
      
    } catch (error) {
      console.error('❌ Analytics error:', error);
      throw error;
    }
  }
}
