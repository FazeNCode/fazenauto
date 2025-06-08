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

    // 1. Search indexes for text search
    await vehicleCollection.createIndex({
      make: 'text',
      model: 'text',
      vin: 'text'
    }, {
      name: 'vehicle_search_text',
      weights: {
        make: 10,
        model: 8,
        vin: 5
      }
    });

    // 2. Filter indexes for common queries
    await vehicleCollection.createIndex({ make: 1, model: 1 }, { name: 'make_model_idx' });
    await vehicleCollection.createIndex({ year: 1 }, { name: 'year_idx' });
    await vehicleCollection.createIndex({ price: 1 }, { name: 'price_idx' });
    await vehicleCollection.createIndex({ mileage: 1 }, { name: 'mileage_idx' });
    await vehicleCollection.createIndex({ status: 1 }, { name: 'status_idx' });

    // 3. Compound indexes for common filter combinations
    await vehicleCollection.createIndex({ 
      status: 1, 
      createdAt: -1 
    }, { name: 'status_created_idx' });

    await vehicleCollection.createIndex({ 
      make: 1, 
      year: 1, 
      price: 1 
    }, { name: 'make_year_price_idx' });

    // 4. Unique indexes
    await vehicleCollection.createIndex({ vin: 1 }, { 
      name: 'vin_unique_idx', 
      unique: true 
    });

    // 5. Geospatial index for location-based queries (future use)
    // await vehicleCollection.createIndex({ location: '2dsphere' }, { name: 'location_geo_idx' });

    console.log('✅ Vehicle indexes created successfully');

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

    // 1. Unique email index
    await userCollection.createIndex({ email: 1 }, { 
      name: 'email_unique_idx', 
      unique: true 
    });

    // 2. Role index for authorization queries
    await userCollection.createIndex({ role: 1 }, { name: 'role_idx' });

    // 3. Compound index for login queries
    await userCollection.createIndex({ 
      email: 1, 
      role: 1 
    }, { name: 'email_role_idx' });

    console.log('✅ User indexes created successfully');

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

    // Create syndication_logs collection if it doesn't exist
    const syndicationCollection = db.collection('syndication_logs');

    console.log('🔧 Creating Syndication collection indexes...');

    // 1. Vehicle reference index
    await syndicationCollection.createIndex({ vehicleId: 1 }, { name: 'vehicle_ref_idx' });

    // 2. Platform index
    await syndicationCollection.createIndex({ platform: 1 }, { name: 'platform_idx' });

    // 3. Status index
    await syndicationCollection.createIndex({ status: 1 }, { name: 'sync_status_idx' });

    // 4. Timestamp index for cleanup and reporting
    await syndicationCollection.createIndex({ createdAt: 1 }, { 
      name: 'created_timestamp_idx',
      expireAfterSeconds: 2592000 // Auto-delete after 30 days
    });

    // 5. Compound index for tracking
    await syndicationCollection.createIndex({ 
      vehicleId: 1, 
      platform: 1, 
      status: 1 
    }, { name: 'vehicle_platform_status_idx' });

    console.log('✅ Syndication indexes created successfully');

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
    const vehicleStats = await db.collection('vehicles').stats();
    const vehicleIndexes = await getIndexInfo('vehicles');
    
    console.log('📊 Vehicle Collection Stats:');
    console.log(`  - Documents: ${vehicleStats.count}`);
    console.log(`  - Indexes: ${vehicleIndexes.length}`);
    console.log(`  - Total Index Size: ${(vehicleStats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Suggest optimizations
    if (vehicleStats.count > 1000 && vehicleIndexes.length < 5) {
      console.log('⚠️ Recommendation: Add more indexes for better query performance');
    }
    
    return {
      vehicles: {
        count: vehicleStats.count,
        indexes: vehicleIndexes.length,
        indexSize: vehicleStats.totalIndexSize
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
