/**
 * Kijiji Handler
 * Placeholder for Kijiji API integration
 */

export default class KijijiHandler {
  getName() {
    return 'Kijiji';
  }

  getDescription() {
    return 'Post vehicles to Kijiji.ca (requires API access)';
  }

  isEnabled() {
    return process.env.KIJIJI_ENABLED === 'true';
  }

  requiresAuth() {
    return true;
  }

  getSupportedFeatures() {
    return [
      'local_listings',
      'featured_ads',
      'bump_up',
      'urgent_ads'
    ];
  }

  async postVehicle(vehicleId, settings = {}) {
    // Placeholder implementation
    throw new Error('Kijiji integration not yet implemented. Contact support for setup.');
  }

  async removeVehicle(externalId, platformData = {}) {
    throw new Error('Kijiji integration not yet implemented.');
  }
}
