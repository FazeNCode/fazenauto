import mongoose, { Schema } from 'mongoose';

/**
 * Syndication Log Schema
 * Tracks vehicle postings across different platforms
 */
const syndicationLogSchema = new Schema(
  {
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
      index: true
    },
    
    platform: {
      type: String,
      required: true,
      enum: [
        'facebook_marketplace',
        'craigslist',
        'autotrader',
        'cars_com',
        'kijiji',
        'marketplace_facebook',
        'custom_export'
      ],
      index: true
    },
    
    status: {
      type: String,
      required: true,
      enum: [
        'pending',     // Queued for syndication
        'processing',  // Currently being posted
        'success',     // Successfully posted
        'failed',      // Failed to post
        'removed',     // Removed from platform
        'expired'      // Listing expired
      ],
      default: 'pending',
      index: true
    },
    
    externalId: {
      type: String,
      // Platform-specific listing ID (e.g., Facebook listing ID)
      sparse: true
    },
    
    externalUrl: {
      type: String,
      // Direct URL to the listing on the platform
      sparse: true
    },
    
    platformData: {
      type: Schema.Types.Mixed,
      // Platform-specific data and responses
      default: {}
    },
    
    errorMessage: {
      type: String,
      // Error details if syndication failed
      sparse: true
    },
    
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    
    lastAttempt: {
      type: Date,
      default: Date.now
    },
    
    nextRetry: {
      type: Date,
      // When to retry if failed
      sparse: true
    },
    
    syncedAt: {
      type: Date,
      // When successfully synced
      sparse: true
    },
    
    removedAt: {
      type: Date,
      // When removed from platform
      sparse: true
    },
    
    metadata: {
      // Additional tracking data
      userAgent: String,
      ipAddress: String,
      userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      
      // Platform-specific settings used
      settings: {
        type: Schema.Types.Mixed,
        default: {}
      },
      
      // Performance metrics
      processingTime: Number, // milliseconds
      imageUploadTime: Number, // milliseconds
      
      // Pricing and promotion data
      originalPrice: Number,
      promotedPrice: Number,
      promotionType: String
    }
  },
  {
    timestamps: true,
    // Auto-delete logs after 90 days to keep collection size manageable
    expireAfterSeconds: 7776000 // 90 days
  }
);

// Compound indexes for efficient queries
syndicationLogSchema.index({ vehicleId: 1, platform: 1 });
syndicationLogSchema.index({ status: 1, createdAt: -1 });
syndicationLogSchema.index({ platform: 1, status: 1, createdAt: -1 });
syndicationLogSchema.index({ nextRetry: 1 }, { sparse: true });

// Instance methods
syndicationLogSchema.methods.markAsSuccess = function(externalId, externalUrl, platformData = {}) {
  this.status = 'success';
  this.externalId = externalId;
  this.externalUrl = externalUrl;
  this.platformData = { ...this.platformData, ...platformData };
  this.syncedAt = new Date();
  this.errorMessage = undefined;
  return this.save();
};

syndicationLogSchema.methods.markAsFailed = function(errorMessage, shouldRetry = true) {
  this.status = 'failed';
  this.errorMessage = errorMessage;
  this.retryCount += 1;
  this.lastAttempt = new Date();
  
  if (shouldRetry && this.retryCount < 5) {
    // Exponential backoff: 5min, 15min, 45min, 2h, 6h
    const backoffMinutes = Math.pow(3, this.retryCount) * 5;
    this.nextRetry = new Date(Date.now() + backoffMinutes * 60 * 1000);
    this.status = 'pending';
  }
  
  return this.save();
};

syndicationLogSchema.methods.markAsRemoved = function() {
  this.status = 'removed';
  this.removedAt = new Date();
  return this.save();
};

// Static methods
syndicationLogSchema.statics.findPendingRetries = function() {
  return this.find({
    status: 'pending',
    nextRetry: { $lte: new Date() },
    retryCount: { $lt: 5 }
  }).populate('vehicleId');
};

syndicationLogSchema.statics.getVehicleSyncStatus = function(vehicleId) {
  return this.find({ vehicleId }).sort({ createdAt: -1 });
};

syndicationLogSchema.statics.getPlatformStats = function(platform, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        platform,
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgProcessingTime: { $avg: '$metadata.processingTime' }
      }
    }
  ]);
};

syndicationLogSchema.statics.getFailureAnalysis = function(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return this.aggregate([
    {
      $match: {
        status: 'failed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          platform: '$platform',
          error: '$errorMessage'
        },
        count: { $sum: 1 },
        lastOccurrence: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

// Virtual for human-readable status
syndicationLogSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    pending: 'Pending',
    processing: 'Processing',
    success: 'Live',
    failed: 'Failed',
    removed: 'Removed',
    expired: 'Expired'
  };
  return statusMap[this.status] || this.status;
});

// Virtual for platform display name
syndicationLogSchema.virtual('platformDisplay').get(function() {
  const platformMap = {
    facebook_marketplace: 'Facebook Marketplace',
    craigslist: 'Craigslist',
    autotrader: 'AutoTrader',
    cars_com: 'Cars.com',
    kijiji: 'Kijiji',
    marketplace_facebook: 'Facebook Marketplace',
    custom_export: 'Custom Export'
  };
  return platformMap[this.platform] || this.platform;
});

// Ensure virtuals are included in JSON output
syndicationLogSchema.set('toJSON', { virtuals: true });
syndicationLogSchema.set('toObject', { virtuals: true });

// Prevent model overwrite issues in dev/hot reload
export default mongoose.models.SyndicationLog || mongoose.model('SyndicationLog', syndicationLogSchema);
