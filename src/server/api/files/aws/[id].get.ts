import { downloadAwsS3 } from "@/server/repositories/fileRepository";
import { sendStream } from "h3"; // função do Nitro para enviar streams
import fs from "fs";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const downloadData = await downloadAwsS3(id);
  const { payload, filePath } = downloadData;

  const fileStream = fs.createReadStream(filePath);

  // Setar headers para forçar o download no navegador
  setResponseHeader(
    event,
    "Content-Disposition",
    `attachment; filename="${payload.fileName}"`
  );
  setResponseHeader(event, "Content-Type", "application/octet-stream");

  // Quando terminar de enviar o arquivo, apagar
  fileStream.on("close", async () => {
    try {
      await fs.promises.unlink(filePath);
      console.log(`🚀 Arquivo temporário apagado: ${filePath}`);
    } catch (err) {
      console.error("Erro ao apagar arquivo:", err);
    }
  });

  // Enviar o arquivo como resposta
  return sendStream(event, fileStream);
});
