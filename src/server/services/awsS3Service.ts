import {
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

import { awsS3Config } from "@/server/providers/awsS3";
import mime from "mime";

export const sendAwsS3File = async (input: {
  fileServerName: string;
  file: File;
}) => {
  const { file, fileServerName } = input;

  try {
    // Converte o arquivo para ArrayBuffer e depois para Buffer (requisito da AWS)
    const fileData = await file.arrayBuffer();
    const buffer = Buffer.from(fileData);

    if (!buffer.length) {
      console.error("❌ AWS Arquivo vazio:", fileServerName);
      throw new Error(`Arquivo vazio: ${fileServerName}`);
    }

    console.log(`🚀 Enviando arquivo para AWS S3: ${fileServerName}`);

    const ContentType =
      mime.getType(fileServerName) || "application/octet-stream";

    const paramsPutObject = {
      Bucket: awsS3Config.bucketName,
      Key: fileServerName,
      Body: buffer,
      ContentType,
      ContentLength: buffer.length, // Recomendado para arquivos binários
    };

    await awsS3Config.s3Client.send(new PutObjectCommand(paramsPutObject));

    console.log(`Arquivo: ${fileServerName}, enviado com sucesso para AWS S3.`);

    // Retorna a URL pública (ajuste se usar bucket privado ou CloudFront)
    return `https://${awsS3Config.bucketName}.s3.${awsS3Config.region}.amazonaws.com/${fileServerName}`;
  } catch (error) {
    console.error(
      "❌ Erro ao enviar arquivo para o S3:",
      error instanceof Error ? error.message : error
    );

    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao enviar arquivo para o S3",
    });
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
