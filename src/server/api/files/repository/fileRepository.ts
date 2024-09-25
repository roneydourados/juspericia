import { readFile } from "fs/promises";
import fs from "fs";
import path from "path";

import prisma from "~/lib/prisma";
import {
  getItemMinionFile,
  removeMinionFile,
  saveFileFromMinion,
} from "~/server/utils/functionts";

import { FileProps } from "~/types/File";
import { uuidv7 } from "uuidv7";

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
        publicId: payload.publicId,
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
