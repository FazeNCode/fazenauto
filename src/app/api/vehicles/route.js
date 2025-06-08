
// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

// 🚗 GET /api/vehicles - Fetch all vehicles with performance optimizations
export async function GET(request) {
  try {
    console.log('🔍 API route called');

    await connectToDatabase();
    console.log('🔍 Database connected successfully');

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const make = searchParams.get('make');
    const year = searchParams.get('year');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const fields = searchParams.get('fields'); // Allow field selection

    // Build filter object
    let filter = {};

    if (search) {
      filter.$or = [
        { vin: { $regex: search, $options: 'i' } },
        { make: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    if (make) {
      filter.make = { $regex: make, $options: 'i' };
    }

    if (year) {
      filter.year = parseInt(year);
    }

    if (status && status !== 'all') {
      filter.status = status;
    }

    console.log('🔍 Filter:', filter);

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Build query with pagination and field selection
    let query = Vehicle.find(filter);

    // Select only requested fields for better performance
    if (fields) {
      query = query.select(fields);
    }

    // Apply pagination and sorting
    query = query.sort({ createdAt: -1 }).skip(skip).limit(limit);

    // Execute query and get total count for pagination
    const [vehicles, totalCount] = await Promise.all([
      query.exec(),
      Vehicle.countDocuments(filter)
    ]);

    console.log(`🔍 Found ${vehicles.length} vehicles (page ${page}/${Math.ceil(totalCount / limit)})`);

    // Add cache headers for better performance
    const response = NextResponse.json({
      success: true,
      data: vehicles,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNext: page < Math.ceil(totalCount / limit),
        hasPrev: page > 1
      }
    });

    // Cache for 5 minutes for non-admin requests
    response.headers.set('Cache-Control', 'public, max-age=300, stale-while-revalidate=60');

    return response;
  } catch (error) {
    console.error('❌ Error in GET /api/vehicles:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error message:', error.message);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles', details: error.message },
      { status: 500 }
    );
  }
}

// 🚗 POST /api/vehicles - Create a new vehicle
export async function POST(req) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const vehicle = await Vehicle.create(body);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    console.error('❌ Error in POST /api/vehicles:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}


