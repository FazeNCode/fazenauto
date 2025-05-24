import multer from 'multer';
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import dbConnect from '../../lib/dbConnect';
import mongoose from 'mongoose';

// Disable Next.js default body parsing to allow multer to handle the multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Set up multer for memory storage (we'll compress the image before saving)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Main handler
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const uploadMiddleware = upload.single('image');

  uploadMiddleware(req, res, async (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: 'Image upload failed' });
    }

    try {
      // 1. Connect to MongoDB
      await dbConnect();
      const db = mongoose.connection;

      // 2. Compress the image
      const compressedBuffer = await sharp(req.file.buffer)
        .resize({ width: 800 }) // Resize width to 800px (height auto)
        .jpeg({ quality: 70 })  // Compress JPEG to 70% quality
        .toBuffer();

      // 3. Define filename and path
      const fileName = `${Date.now()}_${req.file.originalname}`;
      const imageUrl = `/uploads/${fileName}`;
      const outputPath = path.join(process.cwd(), 'public', 'uploads', fileName);

      // 4. Ensure 'public/uploads' directory exists
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // 5. Save compressed image to disk
      fs.writeFileSync(outputPath, compressedBuffer);

      // 6. Save image info in MongoDB
      await db.collection('vehicles').insertOne({
        imageUrl,
        uploadedAt: new Date(),
      });

      // 7. Respond with success
      res.status(200).json({ success: true, imageUrl });
    } catch (error) {
      console.error('Processing error:', error);
      res.status(500).json({ error: 'Image processing failed' });
    }
  });
}
