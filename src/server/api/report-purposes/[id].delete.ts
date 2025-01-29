import { destroy } from "@/server/repositories/reportPurposeRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await destroy(id);
});
