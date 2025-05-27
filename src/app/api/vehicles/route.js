// src/app/api/vehicles/route.js

import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/dbConnect';  // adjust path if needed
import Vehicles from '@/models/VehicleInv';

export async function GET() {
  await connectToDatabase();

  const vehicles = await Vehicles.find({});
  return NextResponse.json({ success: true, data: vehicles });
}

export async function POST(req) {
  await connectToDatabase();
  const body = await req.json();

  try {
    const vehicle = await Vehicles.create(body);
    return NextResponse.json({ success: true, data: vehicle }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
