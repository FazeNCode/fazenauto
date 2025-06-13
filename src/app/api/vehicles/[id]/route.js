import { NextResponse } from 'next/server';
import Vehicle from '@/models/Vehicle';
import { connectToDatabase } from '@/lib/dbConnect';
import { S3Client, DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

export async function GET(req, { params }) {
  await connectToDatabase();

  // Await params in Next.js 15+
  const { id } = await params;

  try {
    const vehicle = await Vehicle.findById(id);
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

  // Await params in Next.js 15+
  const { id } = await params;

  try {
    const contentType = req.headers.get('content-type');
    let updateData = {};
    let newImages = [];
    let imagesToDelete = [];

    if (contentType && contentType.includes('multipart/form-data')) {
      // Handle FormData (with file uploads)
      const formData = await req.formData();

      // Extract form fields
      for (let [key, value] of formData.entries()) {
        if (key === 'newImages') {
          newImages.push(value);
        } else if (key === 'imagesToDelete') {
          imagesToDelete.push(value);
        } else {
          updateData[key] = value;
        }
      }

      // Get current vehicle to access existing images
      const currentVehicle = await Vehicle.findById(id);
      if (!currentVehicle) {
        return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
      }

      let updatedImages = [...(currentVehicle.images || [])];

      // Delete specified images from S3 and remove from array
      if (imagesToDelete.length > 0) {
        for (const imageUrl of imagesToDelete) {
          try {
            // Extract key from S3 URL
            const urlParts = imageUrl.split('/');
            const key = urlParts.slice(-2).join('/'); // Get last two parts for vehicles/year/filename

            await s3.send(new DeleteObjectCommand({
              Bucket: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
              Key: key,
            }));

            // Remove from images array
            updatedImages = updatedImages.filter(img => img !== imageUrl);
          } catch (s3Error) {
            console.error('Error deleting image from S3:', s3Error);
          }
        }
      }

      // Upload new images to S3
      if (newImages.length > 0) {
        for (const imageFile of newImages) {
          try {
            const buffer = Buffer.from(await imageFile.arrayBuffer());
            const safeFileName = imageFile.name.replace(/\s+/g, '-').toLowerCase();
            const fileKey = `vehicles/${updateData.year || currentVehicle.year}/${uuidv4()}-${safeFileName}`;

            const uploadParams = {
              Bucket: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
              Key: fileKey,
              Body: buffer,
              ContentType: imageFile.type,
              CacheControl: 'public, max-age=31536000',
            };

            await s3.send(new PutObjectCommand(uploadParams));

            const imageUrl = `https://${process.env.CUSTOM_AWS_S3_BUCKET_NAME}.s3.${process.env.CUSTOM_AWS_REGION}.amazonaws.com/${fileKey}`;
            updatedImages.push(imageUrl);
          } catch (uploadError) {
            console.error('Error uploading image:', uploadError);
          }
        }
      }

      // Update images array and primary image URL
      updateData.images = updatedImages;
      if (updatedImages.length > 0) {
        updateData.imageUrl = updatedImages[0]; // Set first image as primary
      }
    } else {
      // Handle JSON data (no file uploads)
      updateData = await req.json();
    }

    const updatedVehicle = await Vehicle.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedVehicle) {
      return NextResponse.json({ success: false, message: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedVehicle });
  } catch (error) {
    console.error('Error updating vehicle:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();

  // Await params in Next.js 15+
  const { id } = await params;

  try {
    // First, get the vehicle to access its images
    const vehicle = await Vehicle.findById(id);

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
    await Vehicle.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Vehicle and associated images deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting vehicle:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
