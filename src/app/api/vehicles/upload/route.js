
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { v4 as uuidv4 } from 'uuid';
// import Vehicle from './../../../../models/Vehicle';
// import { connectToDatabase } from './../../../../lib/dbConnect';
// import { NextResponse } from 'next/server';

// const s3 = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// export async function POST(request) {
//   try {
//     await connectToDatabase();

//     const form = await request.formData();

//     const imageFile = form.get('image');
//     const buffer = Buffer.from(await imageFile.arrayBuffer());

//     const fileName = `${uuidv4()}-${imageFile.name}`;
//     const uploadParams = {
//       Bucket: process.env.AWS_S3_BUCKET_NAME,
//       Key: fileName,
//       Body: buffer,
//       ContentType: imageFile.type,
//     };

//     await s3.send(new PutObjectCommand(uploadParams));

//     const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

//     const vehicleData = {
//       make: form.get('make'),
//       model: form.get('model'),
//       year: parseInt(form.get('year')),
//       vin: form.get('vin'),
//       mileage: parseInt(form.get('mileage')),
//       color: form.get('color'),
//       price: parseFloat(form.get('price')), // ✅ this is what you were asking about
//       imageUrl,
//     };

//     const vehicle = await Vehicle.create(vehicleData);

//     return NextResponse.json({ success: true, data: vehicle });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//   }
// }



import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import Vehicle from './../../../../models/Vehicle';
import { connectToDatabase } from './../../../../lib/dbConnect';
import { NextResponse } from 'next/server';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function POST(request) {
  try {
    await connectToDatabase();

    const form = await request.formData();

    const imageFile = form.get('image');
    const buffer = Buffer.from(await imageFile.arrayBuffer());

const safeFileName = imageFile.name.replace(/\s+/g, '-').toLowerCase();
const year = form.get('year');
const fileKey = `vehicles/${year}/${uuidv4()}-${safeFileName}`;

const uploadParams = {
  Bucket: process.env.AWS_S3_BUCKET_NAME,
  Key: `vehicles/${year}/${uuidv4()}-${safeFileName}`,
  Body: buffer,
  ContentType: imageFile.type,
  CacheControl: 'public, max-age=31536000',
};


await s3.send(new PutObjectCommand(uploadParams));

const imageUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`;


    const vehicleData = {
      make: form.get('make'),
      model: form.get('model'),
      year: parseInt(form.get('year')),
      vin: form.get('vin'),
      mileage: parseInt(form.get('mileage')),
      color: form.get('color'),
      price: parseFloat(form.get('price')), // 
      imageUrl,
    };

    const vehicle = await Vehicle.create(vehicleData);

    return NextResponse.json({ success: true, data: vehicle });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
