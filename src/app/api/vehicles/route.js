
// src/app/api/vehicles/route.js
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';
import Vehicle from '@/models/Vehicle';

export async function GET() {
  try {
    await connectToDatabase();
    const vehicles = await Vehicle.find({});
    return NextResponse.json({ success: true, data: vehicles });
  } catch (error) {
    console.error('❌ Error in GET /api/vehicles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vehicles' },
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
