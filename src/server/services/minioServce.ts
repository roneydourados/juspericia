import { s3MinioClient } from "~/server/providers/minio";
import fs from "fs";
import path from "path";

export const saveFileFromMinion = async (input: {
  fileServerName: string;
  file: File;
}) => {
  const { file, fileServerName } = input;
  checkUploadsDirectory();

  const uploadPath = path.join(process.cwd(), "./uploads");

  try {
    const fileData = await file.arrayBuffer();

    if (fileData) {
      const filePath = `${uploadPath}/${fileServerName}`;

      fs.writeFile(filePath, Buffer.from(fileData), (error) => {
        if (error) {
          throw new Error(`Error creating file: ${error.message}`);
        }
      });

      // apagar do minion caso exista
      //await minioClient.removeObject("factory", fileServerName);
      removeMinionFile(fileServerName);

      // enviar para o minion
      await s3MinioClient.putObject(
        "juspericia",
        fileServerName!,
        Buffer.from(fileData)
      );

      // apagar arquivo local
      fs.unlinkSync(filePath);

      return fileServerName;
    }

    return null;
  } catch (error) {
    console.log("🚀 ~ saveFileFromMinion ~ error:", error);
    return null;
  }
};

export const removeMinionFile = async (fileServerName: string) => {
  await s3MinioClient.removeObject("juspericia", fileServerName);
};

export const getItemMinionFile = async (fileServerName: string) => {
  checkUploadsDirectory();
  return await s3MinioClient.getObject("juspericia", fileServerName);
};

const checkUploadsDirectory = () => {
  const uploadPath = path.join(process.cwd(), "./uploads");

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
  }
};
