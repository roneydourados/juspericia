import { remove } from "@/server/repositories/fileRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 204);

  return remove(id);
});
