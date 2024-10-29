import { uploadMany } from "@/server/repositories/fileRepository";
import { FileProps } from "~/types/File";
import { readFormData, setResponseStatus, H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const body = await readFormData(event);
  const arrayPayload: FileProps[] = [];
  const fileDataMap: { [key: string]: Partial<FileProps> } = {};
  let fileCounter = 0;

  // Itera sobre o formData e agrupa arquivos e seus campos
  body.forEach((value, key) => {
    // Adiciona um contador para garantir que cada arquivo tenha uma chave exclusiva
    const [fileKeyBase, field] = key.split(".");
    const fileKey = `${fileKeyBase}_${fileCounter}`; // fileKey com contador para evitar repetição

    if (!fileDataMap[fileKey]) {
      fileDataMap[fileKey] = {}; // Cria um novo objeto parcial para cada arquivo
      fileCounter++; // Incrementa o contador para o próximo arquivo
    }

    if (value instanceof File) {
      fileDataMap[fileKey].fileData = value;
      fileDataMap[fileKey].fileName = value.name;
    } else {
      switch (field) {
        case "fileCategory":
          fileDataMap[fileKey].fileCategory = value as string;
          break;
        case "ownerId":
          fileDataMap[fileKey].ownerId = parseInt(value as string);
          break;
        case "fileName":
          fileDataMap[fileKey].fileName = value as string;
          break;
      }
    }
  });

  // Constrói o array final de objetos FileProps para cada arquivo e seus campos
  for (const fileKey in fileDataMap) {
    const data = fileDataMap[fileKey] as FileProps;
    if (data.fileName) {
      arrayPayload.push(data);
    }
  }

  console.log("🚀 ~ arrayPayload:", arrayPayload);

  setResponseStatus(event, 200);

  // Chama a função para upload de múltiplos arquivos
  return uploadMany(arrayPayload);
});
