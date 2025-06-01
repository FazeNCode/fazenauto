/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGO_URI: process.env.MONGO_URI,
    CUSTOM_AWS_ACCESS_KEY_ID: process.env.CUSTOM_AWS_ACCESS_KEY_ID,
    CUSTOM_AWS_SECRET_ACCESS_KEY: process.env.CUSTOM_AWS_SECRET_ACCESS_KEY,
    CUSTOM_AWS_REGION: process.env.CUSTOM_AWS_REGION,
    CUSTOM_AWS_S3_BUCKET_NAME: process.env.CUSTOM_AWS_S3_BUCKET_NAME,
  },
};

export default nextConfig;
