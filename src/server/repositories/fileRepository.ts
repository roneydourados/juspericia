import fs from "fs";
import path from "path";

import prisma from "~/lib/prisma";
import {
  getItemMinionFile,
  removeMinionFile,
  saveFileFromMinion,
} from "~/server/services/minioServce";

import {
  sendAwsS3File,
  removeAwsS3File,
  getAwsS3File,
} from "@/server/services/awsS3Service";

import { FileProps } from "~/types/File";
import { uuidv7 } from "uuidv7";

// AWS S3 functions and methods
export const uploadAwsS3 = async (payload: FileProps) => {
  try {
    const fileExtension = payload.fileName?.split(".").pop();
    const publicId = uuidv7();
    const fileServerName = `${publicId}.${fileExtension}`;

    // tentar enviar para S3 AWS
    const url = await sendAwsS3File({
      file: payload.fileData!,
      fileServerName,
    });

    if (!url) {
      throw createError({
        statusCode: 500,
        statusMessage: `Not send file to aws s3 file: ${fileServerName}`,
      });
    }

    // se deu certo então salvar informações do arquivo no banco de dados
    return prisma.file.create({
      data: {
        fileCategory: payload.fileCategory!,
        fileName: payload.fileName!,
        ownerId: payload.ownerId!,
        fileServerName,
        publicId,
      },
    });
  } catch (error) {
    console.log("🚀 ~ uploadAwsS3 ~ error:", error);

    throw createError({
      statusCode: 500,
      statusMessage: `Not send file to aws s3 file: ${payload.fileServerName}`,
    });
  }
};

export const uploadManyAwsS3 = async (payload: FileProps[]) => {
  try {
    const uploadResults = await Promise.all(
      payload.map(async (filePayload) => {
        if (!filePayload.fileData) return;

        await uploadAwsS3(filePayload);

        /* forma antiga
          const fileExtension = filePayload.fileName?.split(".").pop();
          const publicId = uuidv7();
          const fileServerName = `${publicId}.${fileExtension}`;

          const url = await sendAwsS3File({
            file: filePayload.fileData!,
            fileServerName,
          });

          if (!url) {
            throw createError({
              statusCode: 500,
              statusMessage: `File ${filePayload.fileName} could not be created, url not found`,
            });
          }

          return prisma.file.create({
            data: {
              fileCategory: filePayload.fileCategory!,
              fileName: filePayload.fileName!,
              ownerId: filePayload.ownerId!,
              fileServerName,
              publicId,
            },
          });
        */
      })
    );

    return uploadResults; // Retorna a lista de resultados do upload de arquivos
  } catch (error) {
    console.log("🚀 ~ error: create many aws s3", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Files could not be created many aws s3",
    });
  }
};

export const removeAwsS3 = async (publicId: string) => {
  const payload = await prisma.file.findFirst({
    where: {
      publicId,
    },
  });

  if (!payload) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  try {
    // remover do bucket
    await removeAwsS3File(payload.fileServerName);

    // remover do banco de dados
    await prisma.file.delete({
      where: {
        publicId: payload.publicId!,
      },
    });
  } catch (error) {
    console.log("🚀 ~ remove aws s3 ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "File Could not be removed",
    });
  }
};

export const downloadAwsS3 = async (publicId: string) => {
  try {
    const payload = await prisma.file.findFirst({
      where: { publicId },
    });

    if (!payload) {
      throw createError({
        statusCode: 404,
        statusMessage: "File not found",
      });
    }

    const objectData = await getAwsS3File(payload.fileServerName);

    if (!objectData) {
      throw createError({
        statusCode: 404,
        statusMessage: "File not found in aws s3",
      });
    }

    const uploadsDir = path.join(process.cwd(), "./uploads");

    // Garante que o diretório existe
    await fs.promises.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, payload.fileName);

    // Escreve o arquivo
    await fs.promises.writeFile(filePath, objectData);

    return { filePath, payload };
  } catch (error) {
    console.log("🚀 ~ downloadAwsS3 ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error dowload File in aws s3",
    });
  }
};

//Minio functions and methods
export const upload = async (payload: FileProps) => {
  try {
    const fileExtension = payload.fileName?.split(".").pop();

    const publicId = uuidv7();

    const fileServerName = `${publicId}.${fileExtension}`;

    const url = await saveFileFromMinion({
      file: payload.fileData!,
      fileServerName,
    });

    if (!url) {
      throw createError({
        statusCode: 500,
        statusMessage: "File Could not be created url not found",
      });
    }

    return prisma.file.create({
      data: {
        fileCategory: payload.fileCategory!,
        fileName: payload.fileName!,
        ownerId: payload.ownerId!,
        fileServerName,
        publicId,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error: create", error);
    throw createError({
      statusCode: 500,
      statusMessage: "File Could not be created",
    });
  }
};

export const index = async (input: {
  ownerId: number;
  fileCategory: string;
}) => {
  try {
    return prisma.file.findMany({
      where: {
        ownerId: input.ownerId,
        fileCategory: input.fileCategory,
      },
    });
  } catch (error) {
    console.log("🚀 ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "File Could not be list",
    });
  }
};

export const download = async (publicId: string) => {
  const payload = await prisma.file.findFirst({
    where: {
      publicId,
    },
  });

  if (!payload) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  const objectData = await getItemMinionFile(payload.fileServerName);

  if (!objectData) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  const filePath = `${path.join(process.cwd(), "./uploads")}/${
    payload.fileServerName
  }`;

  const file = fs.createWriteStream(filePath);

  objectData.pipe(file);

  return { file, payload };
};

export const remove = async (publicId: string) => {
  const payload = await prisma.file.findFirst({
    where: {
      publicId,
    },
  });

  if (!payload) {
    throw createError({
      statusCode: 404,
      statusMessage: "File not found",
    });
  }

  try {
    // remover do bucket
    await removeMinionFile(payload.fileServerName);

    // remover do banco de dados
    await prisma.file.delete({
      where: {
        publicId: payload.publicId!,
      },
    });
  } catch (error) {
    console.log("🚀 ~ remove ~ error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "File Could not be removed",
    });
  }
};

export const uploadMany = async (payload: FileProps[]) => {
  try {
    const uploadResults = await Promise.all(
      payload.map(async (filePayload) => {
        if (!filePayload.fileData) return;

        const fileExtension = filePayload.fileName?.split(".").pop();
        const publicId = uuidv7();
        const fileServerName = `${publicId}.${fileExtension}`;

        const url = await saveFileFromMinion({
          file: filePayload.fileData!,
          fileServerName,
        });

        if (!url) {
          throw createError({
            statusCode: 500,
            statusMessage: `File ${filePayload.fileName} could not be created, url not found`,
          });
        }

        return prisma.file.create({
          data: {
            fileCategory: filePayload.fileCategory!,
            fileName: filePayload.fileName!,
            ownerId: filePayload.ownerId!,
            fileServerName,
            publicId,
          },
        });
      })
    );

    return uploadResults; // Retorna a lista de resultados do upload de arquivos
  } catch (error) {
    console.log("🚀 ~ error: create", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Files could not be created",
    });
  }
};
