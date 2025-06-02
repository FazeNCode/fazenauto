
// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

// 🚗 GET /api/vehicles - Fetch all vehicles
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

    const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
    console.log(`🔍 Found ${vehicles.length} vehicles`);

    return NextResponse.json({
      success: true,
      data: vehicles,
    });
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


