#!/usr/bin/env node

/**
 * Database Performance Validation Script
 * Tests query performance before and after index creation
 */

import { connectToDatabase } from '../src/lib/dbConnect.js';
import Vehicle from '../src/models/Vehicle.js';
import mongoose from 'mongoose';

async function testQueryPerformance() {
  console.log('🔍 Testing Database Query Performance...\n');
  
  try {
    await connectToDatabase();
    
    // Get collection stats
    const stats = await Vehicle.collection.stats();
    console.log(`📊 Collection Stats:`);
    console.log(`  - Documents: ${stats.count.toLocaleString()}`);
    console.log(`  - Data Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Index Size: ${(stats.totalIndexSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`  - Indexes: ${stats.nindexes}\n`);
    
    // Test queries with timing
    const queries = [
      {
        name: 'Find by Make',
        query: { make: 'Honda' },
        description: 'Find all Honda vehicles'
      },
      {
        name: 'Find by Make + Model',
        query: { make: 'Honda', model: 'Civic' },
        description: 'Find Honda Civics'
      },
      {
        name: 'Find by Price Range',
        query: { price: { $gte: 20000, $lte: 30000 } },
        description: 'Find vehicles $20k-$30k'
      },
      {
        name: 'Find Active Vehicles',
        query: { status: 'active' },
        description: 'Find all active listings'
      },
      {
        name: 'Complex Filter',
        query: { 
          make: 'Honda', 
          year: { $gte: 2018 }, 
          price: { $lte: 25000 },
          status: 'active'
        },
        description: 'Honda, 2018+, under $25k, active'
      },
      {
        name: 'Text Search',
        query: { $text: { $search: 'Honda Civic' } },
        description: 'Text search for "Honda Civic"'
      }
    ];
    
    console.log('⏱️  Query Performance Tests:\n');
    
    for (const test of queries) {
      try {
        const startTime = Date.now();
        
        // Execute query with explain to get execution stats
        const result = await Vehicle.find(test.query).explain('executionStats');
        const endTime = Date.now();
        
        const executionTime = endTime - startTime;
        const docsExamined = result.executionStats?.docsExamined || 0;
        const docsReturned = result.executionStats?.docsReturned || 0;
        const indexUsed = result.executionStats?.winningPlan?.inputStage?.indexName || 'COLLECTION_SCAN';
        
        console.log(`📋 ${test.name}:`);
        console.log(`   Description: ${test.description}`);
        console.log(`   ⏱️  Execution Time: ${executionTime}ms`);
        console.log(`   📄 Documents Examined: ${docsExamined.toLocaleString()}`);
        console.log(`   ✅ Documents Returned: ${docsReturned.toLocaleString()}`);
        console.log(`   🔍 Index Used: ${indexUsed}`);
        
        // Performance rating
        let rating = '🔴 Poor';
        if (executionTime < 10) rating = '🟢 Excellent';
        else if (executionTime < 50) rating = '🟡 Good';
        else if (executionTime < 100) rating = '🟠 Fair';
        
        console.log(`   📊 Performance: ${rating}`);
        console.log('');
        
      } catch (error) {
        console.log(`❌ ${test.name}: ${error.message}\n`);
      }
    }
    
    // Index usage analysis
    console.log('📈 Index Usage Analysis:\n');
    
    const indexes = await Vehicle.collection.indexes();
    console.log('Available Indexes:');
    indexes.forEach((index, i) => {
      console.log(`  ${i + 1}. ${index.name}: ${JSON.stringify(index.key)}`);
    });
    
    console.log('\n💡 Performance Recommendations:');
    
    if (stats.count < 100) {
      console.log('  - Your collection is small, performance should be good');
      console.log('  - Consider adding test data to better evaluate performance');
    } else if (stats.count < 1000) {
      console.log('  - Good collection size for testing');
      console.log('  - Indexes will provide noticeable improvements');
    } else {
      console.log('  - Large collection - indexes are crucial for performance');
      console.log('  - Monitor slow queries and add indexes as needed');
    }
    
    if (stats.nindexes < 5) {
      console.log('  - ⚠️  Consider running: npm run init-indexes');
      console.log('  - More indexes will significantly improve query performance');
    } else {
      console.log('  - ✅ Good number of indexes configured');
    }
    
    // Memory usage recommendations
    const indexSizeRatio = stats.totalIndexSize / stats.size;
    if (indexSizeRatio > 0.5) {
      console.log('  - ⚠️  Index size is large relative to data size');
      console.log('  - Monitor memory usage and consider index optimization');
    } else {
      console.log('  - ✅ Index size is reasonable');
    }
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    throw error;
  }
}

async function generateTestData() {
  console.log('🔧 Generating test data for performance testing...\n');
  
  const testVehicles = [];
  const makes = ['Honda', 'Toyota', 'Ford', 'Chevrolet', 'Nissan', 'BMW', 'Mercedes', 'Audi'];
  const models = ['Civic', 'Accord', 'Camry', 'Corolla', 'F-150', 'Silverado', 'Altima', 'Sentra'];
  const colors = ['Black', 'White', 'Silver', 'Red', 'Blue', 'Gray'];
  const statuses = ['active', 'draft', 'sold'];
  
  for (let i = 0; i < 100; i++) {
    const make = makes[Math.floor(Math.random() * makes.length)];
    const model = models[Math.floor(Math.random() * models.length)];
    const year = 2015 + Math.floor(Math.random() * 9); // 2015-2023
    const price = 15000 + Math.floor(Math.random() * 35000); // $15k-$50k
    const mileage = Math.floor(Math.random() * 150000); // 0-150k km
    
    testVehicles.push({
      vin: `TEST${i.toString().padStart(13, '0')}`,
      imageHash: `hash_${i}`,
      make,
      model,
      color: colors[Math.floor(Math.random() * colors.length)],
      year,
      price,
      mileage,
      engine: '2.0L 4-Cylinder',
      drivetrain: 'FWD',
      transmission: 'Automatic',
      status: statuses[Math.floor(Math.random() * statuses.length)]
    });
  }
  
  try {
    // Check if test data already exists
    const existingTestData = await Vehicle.countDocuments({ vin: /^TEST/ });
    
    if (existingTestData > 0) {
      console.log(`✅ Found ${existingTestData} existing test vehicles`);
      return;
    }
    
    await Vehicle.insertMany(testVehicles);
    console.log(`✅ Generated ${testVehicles.length} test vehicles for performance testing`);
    
  } catch (error) {
    if (error.code === 11000) {
      console.log('✅ Test data already exists');
    } else {
      console.error('❌ Failed to generate test data:', error.message);
    }
  }
}

async function main() {
  console.log('🚀 Database Performance Validation\n');
  
  try {
    await connectToDatabase();
    
    // Generate test data if needed
    await generateTestData();
    
    // Run performance tests
    await testQueryPerformance();
    
    console.log('\n🎉 Performance validation complete!');
    console.log('\n📋 Next Steps:');
    console.log('  1. If performance is poor, run: npm run init-indexes');
    console.log('  2. Re-run this script to see improvements');
    console.log('  3. Monitor query performance in production');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export default main;
