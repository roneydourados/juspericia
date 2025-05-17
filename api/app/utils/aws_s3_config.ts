import { S3Client } from '@aws-sdk/client-s3'
import env from '#start/env'

const s3Client = new S3Client({
  region: env.get('S3_REGION', ''),
  credentials: {
    accessKeyId: env.get('S3_ACCESS_KEYID', ''),
    secretAccessKey: env.get('S3_SECRET_ACCESS_KEY', ''),
  },
})

const awsS3Config = {
  bucketName: env.get('S3_BUCKET', ''),
  region: env.get('S3_REGION', ''),
  s3Client,
}

export { awsS3Config }
