import { Client } from "minio";

const config = useRuntimeConfig();

// minio
export const s3MinioClient = new Client({
  endPoint: "justpericia-minio.jrwfye.easypanel.host",
  port: 443,
  useSSL: true,
  accessKey: "ydeiTLIGv3dalgBsdjoc",
  secretKey: "MaqOrnLYmg7SfR4yc4HjIcEctDfx9OL2cnBlplBp",
});
