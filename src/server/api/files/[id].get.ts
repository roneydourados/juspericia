import { readFile } from "fs/promises";
import fs from "fs";
import { download } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;
  const downloadData = await download(id);
  const { payload, file } = downloadData;

  return file
    .on("finish", async () => {
      const fileContent = await readFile(file.path);

      event.node.res.setHeader(
        "Content-Disposition",
        `attachment; filename="${payload.fileName}"`
      );

      event.node.res.setHeader("Content-Type", "application/octet-stream");

      return await send(event, fileContent);
    })
    .on("close", () => {
      //console.log("Arquivo fechado:", file.path);
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error("Erro ao apagar o arquivo:", err);
        } else {
          console.log(
            "Arquivo download temporário apagado com sucesso:",
            file.path
          );
        }
      });
    });

  /*
  const payload = await prisma.file.findFirst({
    where: {
      publicId: id,
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

  return file
    .on("finish", async () => {
      const fileContent = await readFile(filePath);

      event.node.res.setHeader(
        "Content-Disposition",
        `attachment; filename="${payload.fileName}"`
      );

      event.node.res.setHeader("Content-Type", "application/octet-stream");

      return await send(event, fileContent);
    })
    .on("close", () => {
      console.log("Arquivo fechado:", filePath);

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Erro ao apagar o arquivo:", err);
        } else {
          console.log("Arquivo apagado com sucesso:", filePath);
        }
      });
    });
  */
});
