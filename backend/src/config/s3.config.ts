import { registerAs } from '@nestjs/config';

export const s3Config = registerAs('s3', () => ({
  accountId: process.env.R2_ACCOUNT_ID || '',
  accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  bucketName: process.env.R2_BUCKET_NAME || 'primeone-media',
  publicDevUrl:
    process.env.R2_PUBLIC_DEV_URL || 'http://localhost:4000/uploads',
  uploadDir: process.env.UPLOAD_DIR || './uploads',
}));
