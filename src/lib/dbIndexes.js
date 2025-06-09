/**
 * Database indexes for optimal query performance
 * Run this script to create indexes on your MongoDB collections
 */

import { connectToDatabase } from './dbConnect.js';
import mongoose from 'mongoose';

/**
 * Create indexes for Vehicle collection
 */
export async function createVehicleIndexes() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const vehicleCollection = db.collection('vehicles');

    console.log('🔧 Creating Vehicle collection indexes...');

    const indexes = [
      {
        fields: { make: 'text', model: 'text', vin: 'text' },
        options: {
          name: 'vehicle_search_text',
          weights: { make: 10, model: 8, vin: 5 }
        }
      },
      { fields: { make: 1, model: 1 }, options: { name: 'make_model_idx' } },
      { fields: { year: 1 }, options: { name: 'year_idx' } },
      { fields: { price: 1 }, options: { name: 'price_idx' } },
      { fields: { mileage: 1 }, options: { name: 'mileage_idx' } },
      { fields: { status: 1 }, options: { name: 'status_idx' } },
      { fields: { status: 1, createdAt: -1 }, options: { name: 'status_created_idx' } },
      { fields: { make: 1, year: 1, price: 1 }, options: { name: 'make_year_price_idx' } },
      { fields: { vin: 1 }, options: { name: 'vin_unique_idx', unique: true } }
    ];

    let created = 0;
    let skipped = 0;

    for (const { fields, options } of indexes) {
      try {
        await vehicleCollection.createIndex(fields, options);
        console.log(`✅ Created index: ${options.name}`);
        created++;
      } catch (error) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict' || error.code === 11000) {
          console.log(`⚠️  Index already exists: ${options.name}`);
          skipped++;
        } else {
          console.error(`❌ Failed to create index ${options.name}:`, error.message);
          skipped++;
        }
      }
    }

    console.log(`\n📊 Vehicle Index Summary:`);
    console.log(`  - Created: ${created}`);
    console.log(`  - Skipped (already exist): ${skipped}`);
    console.log(`  - Total: ${created + skipped}`);

  } catch (error) {
    console.error('❌ Error creating vehicle indexes:', error);
    throw error;
  }
}

/**
 * Create indexes for User collection
 */
export async function createUserIndexes() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const userCollection = db.collection('users');

    console.log('🔧 Creating User collection indexes...');

    const indexes = [
      { fields: { email: 1 }, options: { name: 'email_unique_idx', unique: true } },
      { fields: { role: 1 }, options: { name: 'role_idx' } },
      { fields: { email: 1, role: 1 }, options: { name: 'email_role_idx' } }
    ];

    let created = 0;
    let skipped = 0;

    for (const { fields, options } of indexes) {
      try {
        await userCollection.createIndex(fields, options);
        console.log(`✅ Created index: ${options.name}`);
        created++;
      } catch (error) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict' || error.code === 11000) {
          console.log(`⚠️  Index already exists: ${options.name}`);
          skipped++;
        } else {
          console.error(`❌ Failed to create index ${options.name}:`, error.message);
          skipped++;
        }
      }
    }

    console.log(`\n📊 User Index Summary:`);
    console.log(`  - Created: ${created}`);
    console.log(`  - Skipped (already exist): ${skipped}`);
    console.log(`  - Total: ${created + skipped}`);

  } catch (error) {
    console.error('❌ Error creating user indexes:', error);
    throw error;
  }
}

/**
 * Create indexes for future syndication tracking
 */
export async function createSyndicationIndexes() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const syndicationCollection = db.collection('syndication_logs');

    console.log('🔧 Creating Syndication collection indexes...');

    const indexes = [
      { fields: { vehicleId: 1 }, options: { name: 'vehicle_ref_idx' } },
      { fields: { platform: 1 }, options: { name: 'platform_idx' } },
      { fields: { status: 1 }, options: { name: 'sync_status_idx' } },
      { fields: { createdAt: 1 }, options: { name: 'created_timestamp_idx', expireAfterSeconds: 2592000 } },
      { fields: { vehicleId: 1, platform: 1, status: 1 }, options: { name: 'vehicle_platform_status_idx' } }
    ];

    let created = 0;
    let skipped = 0;

    for (const { fields, options } of indexes) {
      try {
        await syndicationCollection.createIndex(fields, options);
        console.log(`✅ Created index: ${options.name}`);
        created++;
      } catch (error) {
        if (error.code === 85 || error.codeName === 'IndexOptionsConflict' || error.code === 11000) {
          console.log(`⚠️  Index already exists: ${options.name}`);
          skipped++;
        } else {
          console.error(`❌ Failed to create index ${options.name}:`, error.message);
          skipped++;
        }
      }
    }

    console.log(`\n📊 Syndication Index Summary:`);
    console.log(`  - Created: ${created}`);
    console.log(`  - Skipped (already exist): ${skipped}`);
    console.log(`  - Total: ${created + skipped}`);

  } catch (error) {
    console.error('❌ Error creating syndication indexes:', error);
    throw error;
  }
}

/**
 * Get index information for a collection
 */
export async function getIndexInfo(collectionName) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    
    const indexes = await collection.indexes();
    return indexes;
  } catch (error) {
    console.error(`❌ Error getting index info for ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Drop all custom indexes (for development/testing)
 */
export async function dropCustomIndexes(collectionName) {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);
    
    const indexes = await collection.indexes();
    
    for (const index of indexes) {
      // Don't drop the default _id index
      if (index.name !== '_id_') {
        await collection.dropIndex(index.name);
        console.log(`🗑️ Dropped index: ${index.name}`);
      }
    }
    
    console.log(`✅ Custom indexes dropped for ${collectionName}`);
  } catch (error) {
    console.error(`❌ Error dropping indexes for ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Initialize all indexes
 */
export async function initializeAllIndexes() {
  console.log('🚀 Initializing database indexes...');
  
  try {
    await createVehicleIndexes();
    await createUserIndexes();
    await createSyndicationIndexes();
    
    console.log('🎉 All database indexes created successfully!');
    
    // Log index statistics
    const vehicleIndexes = await getIndexInfo('vehicles');
    const userIndexes = await getIndexInfo('users');
    const syndicationIndexes = await getIndexInfo('syndication_logs');
    
    console.log('📊 Index Summary:');
    console.log(`  - Vehicles: ${vehicleIndexes.length} indexes`);
    console.log(`  - Users: ${userIndexes.length} indexes`);
    console.log(`  - Syndication: ${syndicationIndexes.length} indexes`);
    
  } catch (error) {
    console.error('❌ Failed to initialize indexes:', error);
    throw error;
  }
}

/**
 * Check if indexes exist and are optimal
 */
export async function validateIndexes() {
  try {
    await connectToDatabase();
    const db = mongoose.connection.db;
    
    console.log('🔍 Validating database indexes...');
    
    // Check vehicle indexes
    const vehicleCollection = db.collection('vehicles');
    const vehicleCount = await vehicleCollection.countDocuments();
    const vehicleIndexes = await getIndexInfo('vehicles');
    
    console.log('📊 Vehicle Collection Stats:');
    console.log(`  - Documents: ${vehicleCount}`);
    console.log(`  - Indexes: ${vehicleIndexes.length}`);

    // Suggest optimizations
    if (vehicleCount > 1000 && vehicleIndexes.length < 5) {
      console.log('⚠️ Recommendation: Add more indexes for better query performance');
    } else if (vehicleIndexes.length >= 5) {
      console.log('✅ Good index coverage for optimal performance');
    }

    return {
      vehicles: {
        count: vehicleCount,
        indexes: vehicleIndexes.length,
        indexSize: 0 // Not available without stats
      }
    };
    
  } catch (error) {
    console.error('❌ Error validating indexes:', error);
    throw error;
  }
}

// Export all functions
export default {
  createVehicleIndexes,
  createUserIndexes,
  createSyndicationIndexes,
  getIndexInfo,
  dropCustomIndexes,
  initializeAllIndexes,
  validateIndexes
};
