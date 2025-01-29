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
    // Extrai o nome base da chave do arquivo, sem o índice (fileKeyBase) para manter associação com os campos
    const fileKeyBase = key.split(".")[0];
    const fileKey = `${fileKeyBase}_${fileCounter}`;

    // Inicializa a entrada no map apenas se não existir para o fileKey atual
    if (!fileDataMap[fileKey]) {
      fileDataMap[fileKey] = {};
    }

    if (value instanceof File) {
      fileDataMap[fileKey].fileData = value;
      fileDataMap[fileKey].fileName = value.name;
      fileCounter++; // Incrementa o contador para o próximo arquivo após preencher o fileData
    } else {
      // Associa os campos correspondentes ao mesmo fileKey
      switch (fileKeyBase) {
        case "fileCategory":
          fileDataMap[fileKey].fileCategory = value as string;
          break;
        case "ownerId":
          fileDataMap[fileKey].ownerId = parseInt(value as string);
          break;
      }
    }
  });

  let payload = {} as FileProps;

  // Constrói o array final de objetos FileProps para cada arquivo e seus campos
  for (const fileKey in fileDataMap) {
    const data = fileDataMap[fileKey] as FileProps;

    // verificar cada um dos campos para garantir que todos os campos necessários estão presentes
    if (data.fileData && !payload.fileData) {
      payload.fileData = data.fileData;
    }
    if (data.ownerId && !payload.ownerId) {
      payload.ownerId = data.ownerId;
    }
    if (data.fileCategory && !payload.fileCategory) {
      payload.fileCategory = data.fileCategory;
    }
    if (data.fileName && !payload.fileName) {
      payload.fileName = data.fileName;
    }

    if (
      payload.fileData &&
      payload.ownerId &&
      payload.fileCategory &&
      payload.fileName
    ) {
      arrayPayload.push(payload);
      payload = {} as FileProps;
    }
  }

  setResponseStatus(event, 200);

  // Chama a função para upload de múltiplos arquivos
  return uploadMany(arrayPayload);
});
