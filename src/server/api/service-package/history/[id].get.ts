import { getHistory } from "~/server/repositories/servicePackageRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  return getHistory(id);
});
