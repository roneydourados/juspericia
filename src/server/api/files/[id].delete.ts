import { remove } from "./repository/fileRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 204);

  await remove(id);
});
