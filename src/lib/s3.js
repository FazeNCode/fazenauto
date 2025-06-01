import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

const s3 = new S3Client({
  region: process.env.CUSTOM_AWS_REGION,
  credentials: {
    accessKeyId: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadToS3(file) {
  const fileExtension = file.originalname.split('.').pop();
  const Key = `${randomUUID()}.${fileExtension}`;

  const params = {
    Bucket: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
    Key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  await s3.send(new PutObjectCommand(params));
  return `https://${process.env.CUSTOM_AWS_S3_BUCKET_NAME}.s3.${process.env.CUSTOM_AWS_REGION}.amazonaws.com/${Key}`;
}
