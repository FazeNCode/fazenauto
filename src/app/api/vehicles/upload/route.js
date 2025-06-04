import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import Vehicle from './../../../../models/Vehicle';
import { connectToDatabase } from './../../../../lib/dbConnect';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    await connectToDatabase();

    const form = await request.formData();
    // 🔍 DEBUG: Log all incoming form data keys and values
    for (let [key, value] of form.entries()) {
      console.log(`${key}: ${value}`);
    }

    const imageFiles = form.getAll('images');
    const vin = form.get('vin');
    const year = form.get('year');

    // 🔁 1. Check for duplicate VIN
    const vinExists = await Vehicle.findOne({ vin });
    if (vinExists) {
      return NextResponse.json({ success: false, error: 'A vehicle with this VIN already exists.' }, { status: 409 });
    }

    // Validate image files
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json({ success: false, error: 'At least one image is required.' }, { status: 400 });
    }

    if (imageFiles.length > 25) {
      return NextResponse.json({ success: false, error: 'Maximum 25 images allowed.' }, { status: 400 });
    }

    // Process and upload all images
    const imageUrls = [];
    const imageHashes = [];

    for (let i = 0; i < imageFiles.length; i++) {
      const imageFile = imageFiles[i];
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      // 🔁 2. Check for duplicate image using hash
      const hash = crypto.createHash('sha256').update(buffer).digest('hex');
      const hashExists = await Vehicle.findOne({ imageHash: hash });
      if (hashExists) {
        return NextResponse.json({ success: false, error: `Duplicate image detected: ${imageFile.name}` }, { status: 409 });
      }

      // 🆕 File naming
      const safeFileName = imageFile.name.replace(/\s+/g, '-').toLowerCase();
      const fileKey = `vehicles/${year}/${uuidv4()}-${safeFileName}`;

      const uploadParams = {
        Bucket: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: imageFile.type,
        CacheControl: 'public, max-age=31536000',
      };

      await s3.send(new PutObjectCommand(uploadParams));

      const imageUrl = `https://${process.env.CUSTOM_AWS_S3_BUCKET_NAME}.s3.${process.env.CUSTOM_AWS_REGION}.amazonaws.com/${fileKey}`;
      imageUrls.push(imageUrl);
      imageHashes.push(hash);
    }

    // Use first image as primary image for backward compatibility
    const primaryImageUrl = imageUrls[0];
    const primaryImageHash = imageHashes[0];

    const vehicleData = {
      make: form.get('make'),
      model: form.get('model'),
      year: parseInt(year),
      vin,
      mileage: parseInt(form.get('mileage')),
      color: form.get('color'),
      price: parseFloat(form.get('price')),
      engine: form.get('engine'),
      drivetrain: form.get('drivetrain'),
      transmission: form.get('transmission'),
      imageUrl: primaryImageUrl, // Primary image for backward compatibility
      images: imageUrls, // All images array
      imageHash: primaryImageHash, // Primary image hash for duplicate detection
    };

    const vehicle = await Vehicle.create(vehicleData);

    

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
