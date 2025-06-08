import mongoose, { Schema } from 'mongoose';

const vehicleSchema = new Schema(
  {
    vin: { type: String, required: true, unique: true, index: true },
    imageHash: { type: String, required: true },
    make: { type: String, required: true, index: true },
    model: { type: String, required: true, index: true },
    color: { type: String, required: true },
    year: { type: Number, required: true, index: true },
    price: { type: Number, required: true, index: true },
    mileage: { type: Number, required: true, index: true },
    location: { type: String },
    imageUrl: { type: String }, // S3 image URL (primary/main image for backward compatibility)
    images: [{ type: String }], // Array of S3 image URLs for multiple images
    videoUrl: { type: String }, // S3 video URL for vehicle video
    cargurus: { type: String },
    engine: { type: String, required: true },
    drivetrain: { type: String, required: true },
    transmission: { type: String, required: true },

    // Vehicle status for inventory management
    status: {
      type: String,
      enum: ['draft', 'active', 'sold', 'pending', 'removed'],
      default: 'draft',
      index: true
    },

    // Additional fields for better syndication
    bodyType: { type: String },
    fuelType: { type: String },
    description: { type: String },
    features: [{ type: String }],

    // Syndication tracking
    lastSynced: { type: Date },
    syndicationStatus: {
      type: Map,
      of: {
        status: { type: String, enum: ['pending', 'success', 'failed'] },
        lastAttempt: { type: Date },
        externalId: { type: String }
      }
    },

    // Performance and analytics
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    lastViewed: { type: Date }
  },
  {
    timestamps: true, // ⏱️ Automatically adds createdAt and updatedAt
    // Add text index for search functionality
    index: {
      make: 'text',
      model: 'text',
      vin: 'text'
    }
  }
);

// Add compound indexes for better query performance
vehicleSchema.index({ make: 1, model: 1, year: 1 });
vehicleSchema.index({ status: 1, createdAt: -1 });
vehicleSchema.index({ price: 1, mileage: 1 });

// Instance methods
vehicleSchema.methods.incrementViews = function() {
  this.views = (this.views || 0) + 1;
  this.lastViewed = new Date();
  return this.save();
};

vehicleSchema.methods.incrementInquiries = function() {
  this.inquiries = (this.inquiries || 0) + 1;
  return this.save();
};

vehicleSchema.methods.updateSyndicationStatus = function(platform, status, externalId = null) {
  if (!this.syndicationStatus) {
    this.syndicationStatus = new Map();
  }

  this.syndicationStatus.set(platform, {
    status,
    lastAttempt: new Date(),
    externalId
  });

  this.lastSynced = new Date();
  return this.save();
};

// Static methods for performance
vehicleSchema.statics.findActiveVehicles = function(filters = {}) {
  return this.find({ status: 'active', ...filters }).sort({ createdAt: -1 });
};

vehicleSchema.statics.findByMakeModel = function(make, model) {
  return this.find({
    make: { $regex: make, $options: 'i' },
    model: { $regex: model, $options: 'i' },
    status: 'active'
  });
};

vehicleSchema.statics.getInventoryStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' },
        avgMileage: { $avg: '$mileage' }
      }
    }
  ]);
};

vehicleSchema.statics.getPopularMakes = function(limit = 10) {
  return this.aggregate([
    { $match: { status: 'active' } },
    {
      $group: {
        _id: '$make',
        count: { $sum: 1 },
        avgPrice: { $avg: '$price' }
      }
    },
    { $sort: { count: -1 } },
    { $limit: limit }
  ]);
};

// Virtual for full vehicle name
vehicleSchema.virtual('fullName').get(function() {
  return `${this.year} ${this.make} ${this.model}`;
});

// Virtual for price display
vehicleSchema.virtual('priceDisplay').get(function() {
  return `$${this.price?.toLocaleString() || 'N/A'}`;
});

// Virtual for mileage display
vehicleSchema.virtual('mileageDisplay').get(function() {
  return `${this.mileage?.toLocaleString() || 'N/A'} km`;
});

// Ensure virtuals are included in JSON output
vehicleSchema.set('toJSON', { virtuals: true });
vehicleSchema.set('toObject', { virtuals: true });

// Prevent model overwrite issues in dev/hot reload
export default mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
