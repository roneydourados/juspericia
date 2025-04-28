import { S3Client } from "@aws-sdk/client-s3";
const config = useRuntimeConfig();

const s3Client = new S3Client({
  region: config.s3.region,
  credentials: {
    accessKeyId: config.s3.secretAccessKeyId,
    secretAccessKey: config.s3.secretAccessKey,
  },
});

const awsS3Config = {
  bucketName: config.s3.bucketName,
  region: config.s3.region,
  s3Client,
};

export { awsS3Config };
