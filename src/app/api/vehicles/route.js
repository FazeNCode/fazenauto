
// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

// 🚗 GET /api/vehicles - Fetch all vehicles
export async function GET() {
  try {
    console.log('🔍 API route called');
    console.log('🔍 Environment:', {
      hasMongoUri: !!process.env.MONGO_URI,
      mongoUriLength: process.env.MONGO_URI ? process.env.MONGO_URI.length : 0,
      mongoUriStart: process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) + '...' : 'undefined',
      nodeEnv: process.env.NODE_ENV,
      allEnvKeys: Object.keys(process.env).filter(key => key.includes('MONGO') || key.includes('AWS'))
    });

    await connectToDatabase();
    console.log('🔍 Database connected successfully');

    const vehicles = await Vehicle.find({});
    console.log('🔍 Found vehicles:', vehicles.length);

    return NextResponse.json({ success: true, data: vehicles });
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


