import {
  PutObjectCommand,
  PutObjectRequest,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { awsS3Config } from "@/server/providers/awsS3";
import mime from "mime";
import { Readable } from "stream";

export const sendAwsS3File = async (input: {
  fileServerName: string;
  file: File;
}) => {
  const { file, fileServerName } = input;

  try {
    const fileData = await file.arrayBuffer();

    if (!fileData) {
      throw new Error(`No file data for: ${fileServerName}`);
    }

    console.log(`🚀 ~ Enviar Arquivo para aws S3 ${fileServerName}`);

    // Verifica se o arquivo já existe no S3
    const existsS3File = await getAwsS3File(fileServerName);
    if (existsS3File) {
      console.log(
        `🚀 ~ Arquivo já em aws S3 ${fileServerName}, então remover.`
      );
      await removeAwsS3File(fileServerName);
    }

    const ContentType =
      mime.getType(fileServerName) || "application/octet-stream";

    // Transforma arrayBuffer em readable stream
    const readableStream = Readable.from(Buffer.from(fileData));

    const paramsPutObject = {
      Bucket: awsS3Config.bucketName,
      Key: fileServerName,
      Body: readableStream,
      ContentType,
      ACL: "bucket-owner-full-control",
    } as PutObjectRequest;

    await awsS3Config.s3Client.send(new PutObjectCommand(paramsPutObject));

    console.log(
      `🚀 ~ Arquivo enviado com sucesso para aws S3 ${fileServerName}`
    );

    return `https://${awsS3Config.bucketName}.s3.${awsS3Config.region}.amazonaws.com/${fileServerName}`;
  } catch (error) {
    console.error(
      "🚀 ~ sendAwsS3File ~ error:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

export const removeAwsS3File = async (fileServerName: string) => {
  try {
    console.log(`🚀 ~ Apagar arquivo da aws S3 ${fileServerName}`);

    await awsS3Config.s3Client.send(
      new DeleteObjectCommand({
        Bucket: awsS3Config.bucketName,
        Key: fileServerName,
      })
    );
    console.log(`🚀 ~ Arquivo apagado com sucesso aws S3 ${fileServerName}`);
    return true;
  } catch (error) {
    console.error(
      "🚀 ~ removeAwsS3File ~ error:",
      error instanceof Error ? error.message : error
    );
    return false;
  }
};

export const getAwsS3File = async (fileServerName: string) => {
  try {
    console.log(`🚀 ~ Consultar se arquivo existe na aws S3 ${fileServerName}`);

    const resp = await awsS3Config.s3Client.send(
      new GetObjectCommand({
        Bucket: awsS3Config.bucketName,
        Key: fileServerName,
      })
    );

    if (resp.Body) {
      console.log(`🚀 ~ Arquivo existe na aws S3 ${fileServerName}`);
      return resp.Body?.transformToByteArray();
    }

    console.log(`🚀 ~ Arquivo não existe na aws S3 ${fileServerName}`);
    return null;
  } catch (error) {
    console.error(
      "🚀 ~ getAwsS3File ~ error:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
};

/*
export const sendAwsS3File = async (input: {
  fileServerName: string;
  file: File;
}) => {
  const { file, fileServerName } = input;
  checkUploadsDirectory();

  const uploadPath = path.join(process.cwd(), "./uploads");

  try {
    const fileData = await file.arrayBuffer();

    if (fileData) {
      console.log(`🚀 ~ Enviar Arquivo para aws S3 ${fileServerName}`);

      //verificar se existe o objeto na amazon
      const existsS3File = await getAwsS3File(fileServerName);

      //caso exista então apagar
      if (existsS3File) {
        await removeAwsS3File(fileServerName);
      }

      const filePath = `${uploadPath}/${fileServerName}`;
      const fileStream = await fs.promises.readFile(filePath);
      const readableStream = Readable.from(fileStream);
      const ContentType = mime.getType(filePath) || "application/octet-stream";

      if (!ContentType) {
        throw new Error(`file not found: ${fileServerName}`);
      }

      if (!readableStream) {
        throw new Error(`file no content from file: ${fileServerName}`);
      }

      const paramsPutObject = {
        Bucket: awsS3Config.bucketName, // The name of the bucket. For example, 'sample-bucket-101'.
        Key: fileServerName, // The name of the object. For example, 'sample_upload.txt'.
        Body: readableStream, // The content of the object as a readable stream.
        ContentType,
        ACL: "bucket-owner-full-control",
      } as PutObjectRequest;

      await awsS3Config.s3Client.send(new PutObjectCommand(paramsPutObject));

      console.log(
        `🚀 ~ Arquivo enviado com sucesso para aws S3 ${fileServerName}`
      );

      return `https://${awsS3Config.bucketName}.s3.${awsS3Config.region}.amazonaws.com/${fileServerName}`;
    }
  } catch (error) {
    console.log("🚀 ~ send aws s3 file ~ error:", error);
    return null;
  } finally {
    const deleteFilePath = path.join(process.cwd(), "./uploads");

    if (fs.existsSync(deleteFilePath)) {
      //apagar arquivo loval
      await fs.promises.unlink(deleteFilePath);
      console.log(
        `🚀 ~ Apagar arquivo diretório local async ${fileServerName}`
      );
    }
  }
};
*/
