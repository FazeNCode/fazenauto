import { NextResponse } from 'next/server';
import Vehicle from '@/models/Vehicle';
import { connectToDatabase } from '@/lib/dbConnect';

export async function GET(req, { params }) {
  await connectToDatabase();

  try {
    const vehicle = await Vehicle.findById(params.id);
    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectToDatabase();

  try {
    const data = await req.json();

    const updatedVehicle = await Vehicle.findByIdAndUpdate(params.id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedVehicle });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();

  try {
    const deleted = await Vehicle.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Vehicle deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
