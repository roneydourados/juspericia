import { destroy } from "@/server/repositories/reportModelRepository";

export default defineEventHandler(async (event) => {
  const id = event.context.params!.id;

  setResponseStatus(event, 200);

  await destroy(id);
});
