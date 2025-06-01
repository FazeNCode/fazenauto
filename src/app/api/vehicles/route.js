
// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

export async function GET() {
  try {
    console.log('🔍 Starting GET /api/vehicles');
    console.log('🔍 MONGO_URI exists:', !!process.env.MONGO_URI);

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
