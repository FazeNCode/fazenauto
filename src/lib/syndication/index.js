/**
 * Vehicle Syndication Service
 * Handles posting vehicles to multiple platforms
 */

import SyndicationLog from '@/models/SyndicationLog';
import { connectToDatabase } from '@/lib/dbConnect';
import { Cache } from '@/lib/cache';

// Import platform-specific handlers
import FacebookMarketplaceHandler from './platforms/facebook';
import CraigslistHandler from './platforms/craigslist';
import AutoTraderHandler from './platforms/autotrader';
import KijijiHandler from './platforms/kijiji';
import CSVExportHandler from './platforms/csv-export';

/**
 * Main Syndication Service
 */
export class SyndicationService {
  constructor() {
    this.platforms = {
      facebook_marketplace: new FacebookMarketplaceHandler(),
      craigslist: new CraigslistHandler(),
      autotrader: new AutoTraderHandler(),
      kijiji: new KijijiHandler(),
      custom_export: new CSVExportHandler()
    };
  }

  /**
   * Syndicate a vehicle to specified platforms
   */
  async syndicateVehicle(vehicleId, platforms, options = {}) {
    try {
      await connectToDatabase();
      
      const results = [];
      
      for (const platform of platforms) {
        const result = await this.syndicateToSinglePlatform(vehicleId, platform, options);
        results.push(result);
      }
      
      return {
        success: true,
        results,
        vehicleId
      };
      
    } catch (error) {
      console.error('❌ Syndication error:', error);
      return {
        success: false,
        error: error.message,
        vehicleId
      };
    }
  }

  /**
   * Syndicate to a single platform
   */
  async syndicateToSinglePlatform(vehicleId, platform, options = {}) {
    const startTime = Date.now();
    
    try {
      // Create syndication log entry
      const syndicationLog = new SyndicationLog({
        vehicleId,
        platform,
        status: 'processing',
        metadata: {
          userId: options.userId,
          settings: options.platformSettings?.[platform] || {}
        }
      });
      
      await syndicationLog.save();
      
      // Get platform handler
      const handler = this.platforms[platform];
      if (!handler) {
        throw new Error(`Platform ${platform} not supported`);
      }
      
      // Execute syndication
      const result = await handler.postVehicle(vehicleId, options.platformSettings?.[platform] || {});
      
      // Update log with success
      await syndicationLog.markAsSuccess(
        result.externalId,
        result.externalUrl,
        {
          ...result.platformData,
          processingTime: Date.now() - startTime
        }
      );
      
      return {
        platform,
        status: 'success',
        externalId: result.externalId,
        externalUrl: result.externalUrl,
        processingTime: Date.now() - startTime
      };
      
    } catch (error) {
      console.error(`❌ ${platform} syndication failed:`, error);
      
      // Update log with failure
      const syndicationLog = await SyndicationLog.findOne({
        vehicleId,
        platform,
        status: 'processing'
      }).sort({ createdAt: -1 });
      
      if (syndicationLog) {
        await syndicationLog.markAsFailed(error.message);
      }
      
      return {
        platform,
        status: 'failed',
        error: error.message,
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Remove vehicle from platforms
   */
  async removeVehicle(vehicleId, platforms = null) {
    try {
      await connectToDatabase();
      
      // If no platforms specified, remove from all active platforms
      if (!platforms) {
        const activeLogs = await SyndicationLog.find({
          vehicleId,
          status: 'success'
        });
        platforms = activeLogs.map(log => log.platform);
      }
      
      const results = [];
      
      for (const platform of platforms) {
        const result = await this.removeFromSinglePlatform(vehicleId, platform);
        results.push(result);
      }
      
      return {
        success: true,
        results,
        vehicleId
      };
      
    } catch (error) {
      console.error('❌ Remove vehicle error:', error);
      return {
        success: false,
        error: error.message,
        vehicleId
      };
    }
  }

  /**
   * Remove from single platform
   */
  async removeFromSinglePlatform(vehicleId, platform) {
    try {
      // Find active listing
      const syndicationLog = await SyndicationLog.findOne({
        vehicleId,
        platform,
        status: 'success'
      }).sort({ createdAt: -1 });
      
      if (!syndicationLog) {
        return {
          platform,
          status: 'not_found',
          message: 'No active listing found'
        };
      }
      
      // Get platform handler
      const handler = this.platforms[platform];
      if (!handler) {
        throw new Error(`Platform ${platform} not supported`);
      }
      
      // Remove from platform
      await handler.removeVehicle(syndicationLog.externalId, syndicationLog.platformData);
      
      // Update log
      await syndicationLog.markAsRemoved();
      
      return {
        platform,
        status: 'removed',
        externalId: syndicationLog.externalId
      };
      
    } catch (error) {
      console.error(`❌ Remove from ${platform} failed:`, error);
      return {
        platform,
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * Get syndication status for a vehicle
   */
  async getVehicleStatus(vehicleId) {
    try {
      await connectToDatabase();
      
      const logs = await SyndicationLog.getVehicleSyncStatus(vehicleId);
      
      const statusByPlatform = {};
      logs.forEach(log => {
        if (!statusByPlatform[log.platform] || log.createdAt > statusByPlatform[log.platform].createdAt) {
          statusByPlatform[log.platform] = log;
        }
      });
      
      return {
        success: true,
        vehicleId,
        platforms: statusByPlatform,
        totalLogs: logs.length
      };
      
    } catch (error) {
      console.error('❌ Get vehicle status error:', error);
      return {
        success: false,
        error: error.message,
        vehicleId
      };
    }
  }

  /**
   * Process pending retries
   */
  async processRetries() {
    try {
      await connectToDatabase();
      
      const pendingRetries = await SyndicationLog.findPendingRetries();
      console.log(`🔄 Processing ${pendingRetries.length} pending retries`);
      
      const results = [];
      
      for (const log of pendingRetries) {
        const result = await this.syndicateToSinglePlatform(
          log.vehicleId._id,
          log.platform,
          { platformSettings: { [log.platform]: log.metadata.settings } }
        );
        results.push(result);
      }
      
      return {
        success: true,
        processed: results.length,
        results
      };
      
    } catch (error) {
      console.error('❌ Process retries error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get platform statistics
   */
  async getPlatformStats(platform, days = 30) {
    try {
      await connectToDatabase();
      
      const cacheKey = Cache.generateKey('platform_stats', { platform, days });
      const cached = await Cache.get(cacheKey);
      if (cached) return cached;
      
      const stats = await SyndicationLog.getPlatformStats(platform, days);
      const failureAnalysis = await SyndicationLog.getFailureAnalysis(days);
      
      const result = {
        success: true,
        platform,
        period: `${days} days`,
        stats,
        failures: failureAnalysis.filter(f => f._id.platform === platform)
      };
      
      // Cache for 1 hour
      await Cache.set(cacheKey, result, 3600);
      
      return result;
      
    } catch (error) {
      console.error('❌ Get platform stats error:', error);
      return {
        success: false,
        error: error.message,
        platform
      };
    }
  }

  /**
   * Get available platforms
   */
  getAvailablePlatforms() {
    return Object.keys(this.platforms).map(key => ({
      id: key,
      name: this.platforms[key].getName(),
      description: this.platforms[key].getDescription(),
      enabled: this.platforms[key].isEnabled(),
      requiresAuth: this.platforms[key].requiresAuth(),
      supportedFeatures: this.platforms[key].getSupportedFeatures()
    }));
  }
}

// Export singleton instance
export default new SyndicationService();
