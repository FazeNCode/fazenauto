import { NextResponse } from 'next/server';
import Vehicle from '@/models/Vehicle';
import { connectToDatabase } from '@/lib/dbConnect';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

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
    // First, get the vehicle to access its images
    const vehicle = await Vehicle.findById(params.id);

    if (!vehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    // Delete images from S3
    if (vehicle.images && vehicle.images.length > 0) {
      for (const imageUrl of vehicle.images) {
        try {
          // Extract key from S3 URL
          const urlParts = imageUrl.split('/');
          const key = urlParts[urlParts.length - 1];

          await s3.send(new DeleteObjectCommand({
            Bucket: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
            Key: key,
          }));

          console.log(`Deleted image: ${key}`);
        } catch (s3Error) {
          console.error('Error deleting image from S3:', s3Error);
          // Continue with vehicle deletion even if image deletion fails
        }
      }
    }

    // Delete vehicle from database
    const deleted = await Vehicle.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: 'Vehicle and associated images deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
